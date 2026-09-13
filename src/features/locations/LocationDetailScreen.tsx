import { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { fetchLocations } from '@/api/locations';
import { useAuth } from '@/auth/AuthContext';
import { useRequireAuth } from '@/auth/useRequireAuth';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { FavoriteToggle } from '@/components/FavoriteToggle';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import type { LocationsScreenProps } from '@/navigation/types';
import { theme } from '@/theme';

import { mockLocations, type Location, type LocationHours } from './mockLocations';

// Convert "HH:mm" (24h) to "H:mm AM/PM" for display.
function to12h(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12}:00 ${period}` : `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

// If every day of the week has the same open/close, collapse to a
// single "Every day · X – Y" line; otherwise return per-day lines.
function formatHoursLines(hours: LocationHours[]): string[] {
  const first = hours[0];
  if (!first) return ['Every day · 8:00 AM – 7:00 PM'];
  const allSame = hours.every((h) => h.open === first.open && h.close === first.close);
  if (allSame) return [`Every day · ${to12h(first.open)} – ${to12h(first.close)}`];
  return hours.map((h) => `${h.day} · ${to12h(h.open)} – ${to12h(h.close)}`);
}

export function LocationDetailScreen({ route }: LocationsScreenProps<'LocationDetail'>) {
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const { user, updateFavorites } = useAuth();
  const requireAuth = useRequireAuth();

  useEffect(() => {
    let cancelled = false;
    fetchLocations().then((remote) => {
      if (cancelled) return;
      if (remote.length > 0) setLocations(remote);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const location = locations.find((l) => l.id === route.params.locationId);

  if (!location) {
    return (
      <Screen>
        <Text style={styles.notFound}>Branch not found.</Text>
      </Screen>
    );
  }

  const isFavorite = user?.favoriteLocationId === location.id;

  async function toggleFavorite() {
    if (!location) return;
    if (!requireAuth('save favorite branches')) return;
    try {
      await updateFavorites({ favoriteLocationId: isFavorite ? null : location.id });
    } catch {
      // AuthContext rolls back optimistic state on failure.
    }
  }

  function openDirections() {
    if (!location) return;
    // Universal maps URL — Google Maps, Apple Maps, and Waze on iOS will
    // all offer to open it. On Android the user picks via the share /
    // intent sheet. Falls back to the browser if no map app is installed.
    const query = encodeURIComponent(location.mapsQuery);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`).catch(() => {});
  }

  return (
    <Screen>
      <View>
        <Text style={styles.name}>{location.name}</Text>
        <Text style={styles.address} onPress={openDirections} suppressHighlighting>
          {location.address}
        </Text>
      </View>

      {location.isComingSoon ? (
        <View style={styles.comingSoonBanner}>
          <Text style={styles.comingSoonLabel}>COMING SOON</Text>
          <Text style={styles.comingSoonBody}>
            This branch isn&apos;t open yet. The hours and services below are what to expect when we
            open — check back soon.
          </Text>
        </View>
      ) : null}

      <FavoriteToggle
        isFavorite={isFavorite}
        onToggle={toggleFavorite}
        labelWhenFavorite="Your favorite branch"
        labelWhenNot="Set as favorite branch"
      />

      <Button title="Get directions" onPress={openDirections} />

      <Section title="Opening hours">
        <Card>
          {formatHoursLines(location.hours).map((line) => (
            <Text key={line} style={styles.hoursLine}>
              {line}
            </Text>
          ))}
        </Card>
      </Section>

      <Section title="Available services">
        <Card>
          {location.features.map((feature) => (
            <Text key={feature} style={styles.feature}>
              • {feature}
            </Text>
          ))}
        </Card>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  notFound: { fontSize: 16, color: theme.colors.muted },
  name: { fontSize: 24, fontWeight: '800', color: theme.colors.text },
  // Address is tappable — opens in the user's maps app, with a primary-blue
  // colour to suggest the link affordance.
  address: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 20,
  },
  comingSoonBanner: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.brand,
    borderRadius: theme.radius.lg,
    gap: 4,
  },
  comingSoonLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  comingSoonBody: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.95,
    lineHeight: 18,
  },
  hoursLine: { fontSize: 14, color: theme.colors.text, fontWeight: '600' },
  feature: { fontSize: 14, color: theme.colors.text, paddingVertical: 2 },
});
