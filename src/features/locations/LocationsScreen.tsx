import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/components/Screen';
import type { LocationsScreenProps } from '@/navigation/types';
import { theme } from '@/theme';

import { mockLocations, type Location } from './mockLocations';

// Strip the "BidaWash " prefix for the card title — the brand mark in
// the navigator header already establishes context, and the design
// reads each card as just "BGC" / "Makati" / "Quezon City".
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
  const filtered = mockLocations.filter((loc) => matchesQuery(loc, query));

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

      <Text style={styles.intro}>
        Tap a branch to see opening hours, contact info & how to get there.
      </Text>

      {filtered.map((loc) => (
        <Pressable
          key={loc.id}
          onPress={() => navigation.navigate('LocationDetail', { locationId: loc.id })}
          style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}
          accessibilityRole="button"
          accessibilityLabel={`${loc.name}. ${loc.address}`}
        >
          <View style={styles.cardContent}>
            <Text style={styles.name}>{shortName(loc.name)}</Text>
            <Text style={styles.address}>{loc.address}</Text>
            <Text style={styles.features}>{loc.features.slice(0, 3).join(' · ')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={theme.colors.primary} />
        </Pressable>
      ))}

      {filtered.length === 0 ? (
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
    // Slate-400. Clearly visible against white without feeling heavy.
    borderColor: '#94A3B8',
  },
  cardPressed: { opacity: 0.85 },
  cardContent: { flex: 1, gap: 4 },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  address: { fontSize: 13, color: theme.colors.muted, lineHeight: 18 },
  features: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '600',
    marginTop: theme.spacing.xs,
  },
  empty: {
    fontSize: 14,
    color: theme.colors.muted,
    textAlign: 'center',
    paddingVertical: theme.spacing.lg,
  },
});
