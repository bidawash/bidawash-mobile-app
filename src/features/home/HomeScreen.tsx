import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fetchAnnouncements } from '@/api/announcements';
import { fetchLocations } from '@/api/locations';
import { fetchServices } from '@/api/services';
import { useAuth } from '@/auth/AuthContext';
import { Screen } from '@/components/Screen';
import { VerifyEmailBanner } from '@/components/VerifyEmailBanner';
import { mockAnnouncements, type Announcement } from '@/features/home/mockAnnouncements';
import { mockLocations, type Location } from '@/features/locations/mockLocations';
import { mockServices, type Service } from '@/features/services/mockServices';
import type { HomeScreenProps } from '@/navigation/types';
import { theme } from '@/theme';

// Static per-service icon map. Adding a new service to the DB without
// an entry here just falls back to DEFAULT_ICON — no client change
// required, but a follow-up commit picking the right icon is nicer.
const SERVICE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  'deluxe-foam': 'water-outline',
  'premium-wax': 'sparkles-outline',
};
const DEFAULT_ICON: keyof typeof Ionicons.glyphMap = 'car-outline';

function timeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function HomeScreen({ navigation }: HomeScreenProps<'HomeScreen'>) {
  const { user } = useAuth();
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [services, setServices] = useState<Service[]>(mockServices);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const firstName = user?.name.split(' ')[0];

  useEffect(() => {
    let cancelled = false;
    fetchLocations().then((r) => {
      if (!cancelled && r.length > 0) setLocations(r);
    });
    fetchServices().then((r) => {
      if (!cancelled && r.length > 0) setServices(r);
    });
    fetchAnnouncements().then((r) => {
      if (!cancelled && r.length > 0) setAnnouncements(r);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const favoriteLocation = user?.favoriteLocationId
    ? locations.find((l) => l.id === user.favoriteLocationId)
    : undefined;

  // Tiles come from featured services when any exist; otherwise show
  // every active service so the home grid is never empty.
  const featuredTiles = useMemo(() => {
    const featured = services.filter((s) => s.isFeatured);
    const source = featured.length > 0 ? featured : services;
    return source.map((s) => ({
      key: s.id,
      label: s.name,
      icon: SERVICE_ICONS[s.id] ?? DEFAULT_ICON,
    }));
  }, [services]);

  function openFavoriteBranch() {
    if (!favoriteLocation) return;
    const parent = navigation.getParent() as
      | { navigate: (tab: string, params?: object) => void }
      | undefined;
    parent?.navigate('LocationsTab', {
      screen: 'LocationDetail',
      params: { locationId: favoriteLocation.id },
    });
  }

  return (
    <Screen>
      <View>
        <Text style={styles.greeting}>
          {timeGreeting()}
          {firstName ? `, ${firstName}` : ''}!
        </Text>
        <Text style={styles.tagline}>Here&apos;s what&apos;s happening.</Text>
      </View>

      <VerifyEmailBanner />

      {favoriteLocation ? (
        <Pressable
          onPress={openFavoriteBranch}
          accessibilityRole="button"
          accessibilityLabel={`Your favorite branch: ${favoriteLocation.name}`}
          style={({ pressed }) => [
            styles.favoriteBranchCard,
            pressed ? styles.favoriteBranchPressed : null,
          ]}
        >
          <Text style={styles.favoriteBranchLabel}>★ YOUR FAVORITE BRANCH</Text>
          <Text style={styles.favoriteBranchName}>{favoriteLocation.name}</Text>
          <Text style={styles.favoriteBranchAddress}>{favoriteLocation.address}</Text>
        </Pressable>
      ) : null}

      <View>
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.servicesGrid}>
          {featuredTiles.map((tile) => {
            const isFavorite = user?.favoriteServiceId === tile.key;
            return (
              <Pressable
                key={tile.key}
                onPress={() => navigation.navigate('Services')}
                accessibilityRole="button"
                accessibilityLabel={isFavorite ? `${tile.label} — your usual` : tile.label}
                style={({ pressed }) => [
                  styles.serviceTile,
                  pressed ? styles.servicePressed : null,
                ]}
              >
                <View style={styles.serviceIconWrap}>
                  <Ionicons name={tile.icon} size={26} color={theme.colors.primary} />
                </View>
                <Text style={styles.serviceLabel}>{tile.label}</Text>
                {isFavorite ? <Text style={styles.usualPill}>★ Your usual</Text> : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View>
        <Text style={styles.sectionTitle}>Latest Updates</Text>
        {announcements.map((a, i) => {
          // Rotate background per card: hero → dark slate, then
          // brand blue / brand red. All three use white text.
          const isHero = i === 0;
          const bg = isHero
            ? PINNED_CARD_BG
            : i % 2 === 1
              ? theme.colors.primary
              : theme.colors.brand;

          const cardInner = (
            <>
              <Text
                style={[
                  styles.updateTitle,
                  styles.updateTitleOnDark,
                  isHero ? styles.heroTitle : null,
                ]}
              >
                {a.title}
              </Text>
              <Text style={[styles.updateBody, styles.updateBodyOnDark]}>{a.body}</Text>
              <Text style={[styles.updateDate, styles.updateDateOnDark]}>{a.publishedAt}</Text>
            </>
          );

          if (a.navigateTo) {
            const { tab: targetTab, screen, params } = a.navigateTo;
            // When `screen` is set we drill into a nested stack — e.g.
            // jump from Home directly to LocationDetail for a specific
            // branch. Otherwise we just open the tab root. The cross-
            // navigator types don't compose cleanly here, hence the cast.
            const handlePress = () => {
              const parent = navigation.getParent() as
                | { navigate: (tab: string, params?: object) => void }
                | undefined;
              if (screen) {
                parent?.navigate(targetTab, { screen, params });
              } else {
                parent?.navigate(targetTab);
              }
            };
            return (
              <Pressable
                key={a.id}
                onPress={handlePress}
                style={({ pressed }) => [
                  styles.updateCard,
                  { backgroundColor: bg, borderColor: bg },
                  pressed ? styles.updateCardPressed : null,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${a.title}. Opens ${targetTab.replace('Tab', '')} tab.`}
              >
                {cardInner}
              </Pressable>
            );
          }

          return (
            <View key={a.id} style={[styles.updateCard, { backgroundColor: bg, borderColor: bg }]}>
              {cardInner}
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

const SERVICE_TILE_BG = '#E0E7FF';
const PINNED_CARD_BG = '#0F172A';
const FAVORITE_BRANCH_BG = '#FFF5F5';

const styles = StyleSheet.create({
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: -0.5,
  },
  tagline: { fontSize: 15, color: theme.colors.text, marginTop: 2 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.brand,
    marginBottom: theme.spacing.sm,
  },
  favoriteBranchCard: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    backgroundColor: FAVORITE_BRANCH_BG,
    borderWidth: 1.5,
    borderColor: theme.colors.brand,
    gap: theme.spacing.xs,
  },
  favoriteBranchPressed: { opacity: 0.85 },
  favoriteBranchLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.colors.brand,
  },
  favoriteBranchName: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
  },
  favoriteBranchAddress: {
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 18,
  },
  servicesGrid: { flexDirection: 'row', gap: theme.spacing.sm },
  serviceTile: { flex: 1, alignItems: 'center', gap: 6 },
  servicePressed: { opacity: 0.7 },
  serviceIconWrap: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.lg,
    backgroundColor: SERVICE_TILE_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  usualPill: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.brand,
    marginTop: 2,
    letterSpacing: 0.4,
  },
  updateCard: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
  },
  updateCardPressed: { opacity: 0.85 },
  updateTitle: { fontSize: 18, fontWeight: '800' },
  updateTitleOnDark: { color: '#FFFFFF' },
  heroTitle: { fontSize: 22, letterSpacing: -0.5 },
  updateBody: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: theme.spacing.xs,
  },
  updateBodyOnDark: { color: '#FFFFFF', opacity: 0.9 },
  updateDate: {
    fontSize: 11,
    marginTop: theme.spacing.sm,
  },
  updateDateOnDark: { color: '#FFFFFF', opacity: 0.6 },
});
