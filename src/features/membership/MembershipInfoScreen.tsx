import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { useRequireAuth } from '@/auth/useRequireAuth';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { theme } from '@/theme';

const CARD_ASPECT = 1.6; // source image (243×153) aspect ratio
const CARD_SIDE_MARGIN = theme.spacing.xxl; // 48px gutter from each screen edge

// Pre-launch waitlist for BidaWash Premium. The loyalty programme runs
// in-branch once launched; this screen previews the concept and lets
// signed-in customers opt in to a per-user launch notification. The
// opt-in is stored on profiles.membership_interest_at so we can build
// a launch mailing list without scraping the support inbox.
export function MembershipInfoScreen() {
  const { user, setMembershipInterest } = useAuth();
  const requireAuth = useRequireAuth();
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth - CARD_SIDE_MARGIN * 2;
  const cardHeight = Math.round(cardWidth / CARD_ASPECT);
  const isInterested = Boolean(user?.membershipInterestedAt);

  async function optIn() {
    if (!requireAuth('join the BidaWash Premium launch waitlist')) return;
    try {
      await setMembershipInterest(true);
    } catch {
      // AuthContext rolls back optimistic state on failure.
    }
  }

  async function optOut() {
    try {
      await setMembershipInterest(false);
    } catch {
      // AuthContext rolls back optimistic state on failure.
    }
  }

  return (
    <Screen contentContainerStyle={styles.root}>
      <View style={styles.headline}>
        <View style={styles.brandBlock}>
          <View style={styles.tagPill}>
            <Text style={styles.tagLabel}>BIDAWASH PREMIUM</Text>
          </View>
          <Text style={styles.launchLabel}>LAUNCHING SOON</Text>
        </View>
        <Text style={styles.preheader}>Coming to BidaWash</Text>
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
        <Text style={styles.perksHeader}>What to expect at launch</Text>
        <Text style={styles.perkLine}>• Loyalty rewards for frequent customers</Text>
        <Text style={styles.perkLine}>• Branch-exclusive seasonal offers</Text>
      </View>

      {isInterested ? (
        <View style={[styles.confirmWrap, { width: cardWidth }]}>
          <View style={styles.confirm}>
            <Text style={styles.confirmTitle}>★ You&apos;re on the list.</Text>
            <Text style={styles.confirmBody}>
              We&apos;ll email you at {user?.email} when BidaWash Premium launches.
            </Text>
          </View>
          <Button title="Leave the list" variant="ghost" onPress={optOut} />
        </View>
      ) : (
        <View style={[styles.ctaWrap, { width: cardWidth }]}>
          <Button title="Notify me when memberships launch" variant="dark" onPress={optIn} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { gap: theme.spacing.lg, paddingBottom: theme.spacing.xl },
  headline: { alignItems: 'center', gap: theme.spacing.sm },
  brandBlock: { alignItems: 'center', gap: 4 },
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
  launchLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.muted,
    letterSpacing: 0.8,
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
  perksHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  perkLine: {
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 22,
  },
  ctaWrap: {
    alignSelf: 'center',
  },
  confirmWrap: {
    alignSelf: 'center',
    gap: theme.spacing.sm,
  },
  confirm: {
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.brand,
  },
  confirmTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.brand },
  confirmBody: { fontSize: 14, color: theme.colors.text, lineHeight: 20 },
});
