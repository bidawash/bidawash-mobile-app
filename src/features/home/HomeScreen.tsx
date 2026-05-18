import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import type { HomeScreenProps } from '@/navigation/types';
import { theme } from '@/theme';

import { mockAnnouncements } from './mockAnnouncements';

export function HomeScreen({ navigation }: HomeScreenProps<'HomeScreen'>) {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0] ?? 'there';

  return (
    <Screen>
      <View>
        <Text style={styles.greeting}>Hi, {firstName}.</Text>
        <Text style={styles.tagline}>Welcome back to BidaWash.</Text>
      </View>

      <Section title="What's new" subtitle="Latest updates from BidaWash">
        {mockAnnouncements.map((a) => (
          <Card key={a.id}>
            <Text style={styles.cardTitle}>{a.title}</Text>
            <Text style={styles.cardBody}>{a.body}</Text>
            <Text style={styles.cardMeta}>{a.publishedAt}</Text>
          </Card>
        ))}
      </Section>

      <Section title="Our services" subtitle="From a quick rinse to full detailing">
        <Button title="See all services" onPress={() => navigation.navigate('Services')} />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  greeting: { fontSize: 28, fontWeight: '700', color: theme.colors.text },
  tagline: { fontSize: 15, color: theme.colors.muted, marginTop: 2 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
  cardBody: { fontSize: 14, color: theme.colors.muted, lineHeight: 20 },
  cardMeta: { fontSize: 12, color: theme.colors.muted, marginTop: theme.spacing.xs },
});
