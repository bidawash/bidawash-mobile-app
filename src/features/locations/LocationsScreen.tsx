import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  distanceKm,
  ensureLocationPermission,
  formatDistance,
  getCurrentCoords,
  type Coords,
} from '@/api/geolocation';
import { fetchLocations } from '@/api/locations';
import { Screen } from '@/components/Screen';
import type { LocationsScreenProps } from '@/navigation/types';
import { theme } from '@/theme';

import { mockLocations, type Location } from './mockLocations';

type SortMode = 'alpha' | 'nearest';

// Strip the "BidaWash " prefix for the card title — the brand mark in
// the navigator header already establishes context, and the design
// reads each card as just "GH Mall" / "Parqal" / etc.
function shortName(name: string): string {
  return name.replace(/^BidaWash\s+/i, '');
}

function matchesQuery(loc: Location, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return loc.name.toLowerCase().includes(q) || loc.address.toLowerCase().includes(q);
}

export function LocationsScreen({ navigation }: LocationsScreenProps<'LocationsList'>) {
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('alpha');
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [userCoords, setUserCoords] = useState<Coords | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);

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

  const requestNearest = useCallback(async () => {
    const state = await ensureLocationPermission(true);
    if (state !== 'granted') {
      setLocationDenied(true);
      Alert.alert(
        'Location permission needed',
        'Enable location for BidaWash in your device Settings to sort branches by distance.',
      );
      return;
    }
    const coords = await getCurrentCoords();
    if (!coords) {
      Alert.alert('Could not get your location', 'Please try again in a moment.');
      return;
    }
    setUserCoords(coords);
    setLocationDenied(false);
    setSortMode('nearest');
  }, []);

  const sortedFiltered = useMemo(() => {
    const filtered = locations.filter((loc) => matchesQuery(loc, query));
    if (sortMode === 'nearest' && userCoords) {
      return [...filtered].sort((a, b) => {
        const da =
          a.latitude != null && a.longitude != null
            ? distanceKm(userCoords, { latitude: a.latitude, longitude: a.longitude })
            : Infinity;
        const db =
          b.latitude != null && b.longitude != null
            ? distanceKm(userCoords, { latitude: b.latitude, longitude: b.longitude })
            : Infinity;
        return da - db;
      });
    }
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }, [locations, query, sortMode, userCoords]);

  return (
    <Screen>
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={theme.colors.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search Locations"
          placeholderTextColor={theme.colors.muted}
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort by</Text>
        <Pressable
          onPress={() => setSortMode('alpha')}
          style={[styles.sortPill, sortMode === 'alpha' ? styles.sortPillActive : null]}
          accessibilityRole="button"
          accessibilityState={{ selected: sortMode === 'alpha' }}
        >
          <Text style={[styles.sortText, sortMode === 'alpha' ? styles.sortTextActive : null]}>
            A–Z
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            if (sortMode === 'nearest') {
              setSortMode('alpha');
              return;
            }
            if (userCoords) {
              setSortMode('nearest');
              return;
            }
            requestNearest();
          }}
          style={[styles.sortPill, sortMode === 'nearest' ? styles.sortPillActive : null]}
          accessibilityRole="button"
          accessibilityState={{ selected: sortMode === 'nearest' }}
        >
          <Ionicons
            name="location-outline"
            size={14}
            color={sortMode === 'nearest' ? '#FFFFFF' : theme.colors.primary}
          />
          <Text style={[styles.sortText, sortMode === 'nearest' ? styles.sortTextActive : null]}>
            Nearest
          </Text>
        </Pressable>
      </View>

      {locationDenied ? (
        <Text style={styles.permissionHint}>
          Location permission was denied. Enable it in device Settings to sort by nearest.
        </Text>
      ) : null}

      <Text style={styles.intro}>Tap a branch to see opening hours & how to get there.</Text>

      {sortedFiltered.map((loc) => {
        const distance =
          sortMode === 'nearest' && userCoords && loc.latitude != null && loc.longitude != null
            ? distanceKm(userCoords, { latitude: loc.latitude, longitude: loc.longitude })
            : null;
        return (
          <Pressable
            key={loc.id}
            onPress={() => navigation.navigate('LocationDetail', { locationId: loc.id })}
            style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}
            accessibilityRole="button"
            accessibilityLabel={`${loc.name}. ${loc.address}${loc.isComingSoon ? '. Coming soon.' : ''}${distance !== null ? `. ${formatDistance(distance)} away.` : ''}`}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{shortName(loc.name)}</Text>
                {distance !== null ? (
                  <Text style={styles.distance}>{formatDistance(distance)}</Text>
                ) : null}
              </View>
              <Text style={styles.address}>{loc.address}</Text>
              <Text style={styles.features}>{loc.features.slice(0, 3).join(' · ')}</Text>
              {loc.isComingSoon ? (
                <View style={styles.comingSoonPillWrap}>
                  <View style={styles.comingSoonPill}>
                    <Text style={styles.comingSoonText}>COMING SOON</Text>
                  </View>
                </View>
              ) : null}
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.primary} />
          </Pressable>
        );
      })}

      {sortedFiltered.length === 0 ? (
        <Text style={styles.empty}>No branches match &ldquo;{query}&rdquo;.</Text>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    height: 48,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    padding: 0,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  sortPillActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  sortTextActive: {
    color: '#FFFFFF',
  },
  permissionHint: {
    fontSize: 12,
    color: theme.colors.muted,
    fontStyle: 'italic',
  },
  intro: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '700',
    lineHeight: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
  },
  cardPressed: { opacity: 0.85 },
  cardContent: { flex: 1, gap: 4 },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.5,
    flex: 1,
  },
  distance: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.brand,
  },
  address: { fontSize: 13, color: theme.colors.muted, lineHeight: 18 },
  features: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '600',
    marginTop: theme.spacing.xs,
  },
  comingSoonPillWrap: {
    marginTop: theme.spacing.xs,
    flexDirection: 'row',
  },
  comingSoonPill: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    backgroundColor: theme.colors.brand,
    borderRadius: theme.radius.full,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  empty: {
    fontSize: 14,
    color: theme.colors.muted,
    textAlign: 'center',
    paddingVertical: theme.spacing.lg,
  },
});
