import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import type { AuthScreenProps } from '@/navigation/types';
import { theme } from '@/theme';

const SLIDES = [
  {
    title: 'Welcome to BidaWash',
    body: 'Your car. Cleaner, faster. At every BidaWash location across Metro Manila.',
  },
  {
    title: 'Find your nearest branch',
    body: 'Operating hours, services, and directions at your fingertips.',
  },
  {
    title: 'Memberships, coming soon',
    body: 'Unlimited washes, prepaid packages, and member perks. Sign up early to be notified the moment they launch.',
  },
];

export function OnboardingScreen({ navigation }: AuthScreenProps<'Onboarding'>) {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  if (!slide) {
    return null;
  }

  return (
    <Screen scroll={false} contentContainerStyle={styles.root}>
      <View style={styles.top}>
        <Text style={styles.brand}>BidaWash</Text>
        <Button title="Skip" variant="ghost" onPress={() => navigation.navigate('SignIn')} />
      </View>

      <View style={styles.slideArea}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.body}>{slide.body}</Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index ? styles.dotActive : null]} />
          ))}
        </View>
        <Button
          title={isLast ? 'Get started' : 'Next'}
          onPress={() => {
            if (isLast) {
              navigation.navigate('SignUp');
            } else {
              setIndex(index + 1);
            }
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'space-between' },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { fontSize: 18, fontWeight: '700', color: theme.colors.primary },
  slideArea: { gap: theme.spacing.md, paddingVertical: theme.spacing.xxl },
  title: { fontSize: 32, fontWeight: '700', color: theme.colors.text, lineHeight: 38 },
  body: { fontSize: 16, color: theme.colors.muted, lineHeight: 24 },
  bottom: { gap: theme.spacing.lg },
  dots: { flexDirection: 'row', gap: theme.spacing.sm, justifyContent: 'center' },
  dot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.border,
  },
  dotActive: { backgroundColor: theme.colors.primary, width: 24 },
});
