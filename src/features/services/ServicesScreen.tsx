import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { Card } from '@/components/Card';
import { FavoriteToggle } from '@/components/FavoriteToggle';
import { Screen } from '@/components/Screen';
import { theme } from '@/theme';

import { mockServices } from './mockServices';

function formatPrice(php: number): string {
  return `₱${php.toLocaleString('en-PH')}`;
}

function formatDuration(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const rem = minutes % 60;
    return rem ? `${hours}h ${rem}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

export function ServicesScreen() {
  const { user, updateFavorites } = useAuth();

  async function toggleFavorite(serviceId: string) {
    const isCurrent = user?.favoriteServiceId === serviceId;
    try {
      await updateFavorites({ favoriteServiceId: isCurrent ? null : serviceId });
    } catch {
      // AuthContext rolls back optimistic state on failure.
    }
  }

  return (
    <Screen>
      <Text style={styles.intro}>
        Two ways to keep your car looking sharp — here&apos;s what we offer.
      </Text>
      {mockServices.map((s) => {
        const isFavorite = user?.favoriteServiceId === s.id;
        return (
          <Card key={s.id}>
            <View style={styles.headerRow}>
              <Text style={styles.name}>{s.name}</Text>
              <Text style={styles.price}>from {formatPrice(s.startingPricePhp)}</Text>
            </View>
            <Text style={styles.body}>{s.description}</Text>
            <Text style={styles.duration}>≈ {formatDuration(s.durationMinutes)}</Text>
            <FavoriteToggle
              isFavorite={isFavorite}
              onToggle={() => toggleFavorite(s.id)}
              labelWhenFavorite="Your usual"
              labelWhenNot="Set as your usual"
            />
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { fontSize: 14, color: theme.colors.muted, lineHeight: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  name: { fontSize: 17, fontWeight: '700', color: theme.colors.text },
  price: { fontSize: 14, fontWeight: '600', color: theme.colors.primary },
  body: { fontSize: 14, color: theme.colors.muted, lineHeight: 20 },
  duration: { fontSize: 12, color: theme.colors.muted, marginTop: theme.spacing.xs },
});
