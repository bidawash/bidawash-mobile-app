import { Image, Linking, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { theme } from '@/theme';

const CARD_ASPECT = 1.6; // source image (243×153) aspect ratio
const CARD_SIDE_MARGIN = theme.spacing.xxl; // 48px gutter from each screen edge
const SUPPORT_EMAIL = 'support@bidawash.com';

// Informational screen for the BidaWash Premium loyalty programme.
// Premium is operated in-branch (no in-app purchase). This screen
// introduces the benefits and points customers to email for details.
export function MembershipInfoScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth - CARD_SIDE_MARGIN * 2;
  const cardHeight = Math.round(cardWidth / CARD_ASPECT);

  function emailUs() {
    Linking.openURL(
      `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('BidaWash Premium — question')}`,
    ).catch(() => {});
  }

  return (
    <Screen contentContainerStyle={styles.root}>
      <View style={styles.headline}>
        <View style={styles.tagPill}>
          <Text style={styles.tagLabel}>BIDAWASH PREMIUM</Text>
        </View>
        <Text style={styles.preheader}>Rewarding our regulars with</Text>
        <Text style={styles.heroline}>Loyalty benefits</Text>
        <Text style={styles.heroline}>
          <Text style={styles.andText}>and </Text>seasonal promos
        </Text>
      </View>

      <Image
        source={require('../../../assets/bidawash-premium-card.png')}
        style={[styles.card, { width: cardWidth, height: cardHeight }]}
        resizeMode="cover"
        accessibilityLabel="BidaWash Premium loyalty card preview"
      />

      <View style={[styles.perks, { width: cardWidth }]}>
        <Text style={styles.perkLine}>• Preferred wash slots during peak hours</Text>
        <Text style={styles.perkLine}>• Loyalty rewards for frequent customers</Text>
        <Text style={styles.perkLine}>• Branch-exclusive seasonal offers</Text>
      </View>

      <View style={[styles.ctaWrap, { width: cardWidth }]}>
        <Button title="Ask about Premium" variant="dark" onPress={emailUs} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { gap: theme.spacing.lg, paddingBottom: theme.spacing.xl },
  headline: { alignItems: 'center', gap: theme.spacing.sm },
  tagPill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
  },
  tagLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#FFFFFF',
  },
  preheader: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  heroline: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  andText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0,
  },
  card: {
    alignSelf: 'center',
    borderRadius: theme.radius.lg,
  },
  perks: {
    alignSelf: 'center',
    gap: theme.spacing.xs,
  },
  perkLine: {
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 22,
  },
  ctaWrap: {
    alignSelf: 'center',
  },
});
