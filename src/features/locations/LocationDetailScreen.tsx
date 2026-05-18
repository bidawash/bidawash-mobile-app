import { Linking, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import type { LocationsScreenProps } from '@/navigation/types';
import { theme } from '@/theme';

import { findLocation } from './mockLocations';

export function LocationDetailScreen({ route }: LocationsScreenProps<'LocationDetail'>) {
  const location = findLocation(route.params.locationId);

  if (!location) {
    return (
      <Screen>
        <Text style={styles.notFound}>Branch not found.</Text>
      </Screen>
    );
  }

  function callBranch() {
    if (!location) return;
    Linking.openURL(`tel:${location.phone.replace(/\s+/g, '')}`).catch(() => {});
  }

  function openDirections() {
    if (!location) return;
    const query = encodeURIComponent(location.address);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`).catch(() => {});
  }

  return (
    <Screen>
      <View>
        <Text style={styles.name}>{location.name}</Text>
        <Text style={styles.address}>{location.address}</Text>
        <Text style={styles.phone}>{location.phone}</Text>
      </View>

      <View style={styles.actions}>
        <Button title="Call" variant="secondary" onPress={callBranch} />
        <Button title="Get directions" onPress={openDirections} />
      </View>

      <Section title="Opening hours">
        <Card>
          {location.hours.map((row) => (
            <View key={row.day} style={styles.hoursRow}>
              <Text style={styles.day}>{row.day}</Text>
              <Text style={styles.time}>
                {row.open} – {row.close}
              </Text>
            </View>
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
  name: { fontSize: 24, fontWeight: '700', color: theme.colors.text },
  address: { fontSize: 14, color: theme.colors.muted, marginTop: 4, lineHeight: 20 },
  phone: { fontSize: 14, color: theme.colors.primary, marginTop: 4 },
  actions: { flexDirection: 'row', gap: theme.spacing.sm },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  day: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
  time: { fontSize: 14, color: theme.colors.muted },
  feature: { fontSize: 14, color: theme.colors.text, paddingVertical: 2 },
});
