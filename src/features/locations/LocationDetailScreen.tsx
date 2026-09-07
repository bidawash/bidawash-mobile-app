import { Linking, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { FavoriteToggle } from '@/components/FavoriteToggle';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import type { LocationsScreenProps } from '@/navigation/types';
import { theme } from '@/theme';

import { findLocation } from './mockLocations';

export function LocationDetailScreen({ route }: LocationsScreenProps<'LocationDetail'>) {
  const location = findLocation(route.params.locationId);
  const { user, updateFavorites } = useAuth();

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

      <FavoriteToggle
        isFavorite={isFavorite}
        onToggle={toggleFavorite}
        labelWhenFavorite="Your favorite branch"
        labelWhenNot="Set as favorite branch"
      />

      <Button title="Get directions" onPress={openDirections} />

      <Section title="Opening hours">
        <Card>
          <Text style={styles.hoursLine}>Every day · 8:00 AM – 7:00 PM</Text>
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
  hoursLine: { fontSize: 14, color: theme.colors.text, fontWeight: '600' },
  feature: { fontSize: 14, color: theme.colors.text, paddingVertical: 2 },
});
