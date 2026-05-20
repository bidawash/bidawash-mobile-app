import { StyleSheet, Text } from 'react-native';

import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import type { LocationsScreenProps } from '@/navigation/types';
import { theme } from '@/theme';

import { mockLocations } from './mockLocations';

export function LocationsScreen({ navigation }: LocationsScreenProps<'LocationsList'>) {
  return (
    <Screen>
      <Text style={styles.intro}>
        Tap a branch to see opening hours, contact info, and how to get there.
      </Text>
      {mockLocations.map((loc) => (
        <Card
          key={loc.id}
          onPress={() => navigation.navigate('LocationDetail', { locationId: loc.id })}
        >
          <Text style={styles.name}>{loc.name}</Text>
          <Text style={styles.address}>{loc.address}</Text>
          <Text style={styles.features}>{loc.features.slice(0, 3).join(' • ')}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { fontSize: 14, color: theme.colors.muted, lineHeight: 20 },
  name: { fontSize: 17, fontWeight: '700', color: theme.colors.text },
  address: { fontSize: 14, color: theme.colors.muted, lineHeight: 20 },
  features: { fontSize: 12, color: theme.colors.primary, marginTop: theme.spacing.xs },
});
