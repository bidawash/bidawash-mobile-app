import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandMark } from '@/components/BrandMark';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import type { AuthScreenProps } from '@/navigation/types';
import { theme } from '@/theme';

const SLIDES = [
  {
    title: 'Welcome to BidaWash',
    body: 'Your Car. Cleaner, Faster.\nProfessional Car Wash Services in Metro Manila.',
  },
  {
    title: 'Find a branch near you',
    body: "Now in Ortigas and Pasay — and we're just getting started. Hours, services, and directions in seconds.",
  },
  {
    title: 'Memberships coming soon',
    body: "Earn massive savings with our membership program. Create an account now and we'll let you know the moment it launches.",
  },
];

export function OnboardingScreen({ navigation }: AuthScreenProps<'Onboarding'>) {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  if (!slide) {
    return null;
  }

  const goNext = () => {
    // The last slide nudges users toward signup explicitly ("Create an
    // account now"), so we route there instead of SignIn. Existing
    // users can still tap "Sign in" from the SignUp screen footer.
    if (isLast) navigation.navigate('SignUp');
    else setIndex(index + 1);
  };

  return (
    <Screen scroll={false} safeAreaTop contentContainerStyle={styles.root}>
      {/* Slide 0 hides the brand+skip row — the welcome layout has the
          logo and wordmark as the focal point. Slides 1+ show the
          regular onboarding chrome. */}
      {index === 0 ? (
        <View style={styles.topSkip}>
          <SignInShortcut onPress={() => navigation.navigate('SignIn')} />
        </View>
      ) : (
        <View style={styles.top}>
          <BrandMark size="md" />
          <SignInShortcut onPress={() => navigation.navigate('SignIn')} />
        </View>
      )}

      {index === 0 ? (
        <WelcomeSlide body={slide.body} />
      ) : (
        <View style={styles.slideArea}>
          {index === 1 ? <BranchIllustration /> : <MembershipIllustration />}
          <View style={styles.slideCopy}>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.body}>{slide.body}</Text>
          </View>
        </View>
      )}

      <View style={styles.bottom}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index ? styles.dotActive : null]} />
          ))}
        </View>

        {index === 0 ? (
          <Pressable
            onPress={goNext}
            style={({ pressed }) => [styles.nextLink, pressed ? styles.nextLinkPressed : null]}
            accessibilityRole="button"
            accessibilityLabel="Next"
          >
            <Text style={styles.nextLinkLabel}>Next</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.primary} />
          </Pressable>
        ) : (
          <View style={styles.actions}>
            <View style={styles.actionItem}>
              <Button title="Back" variant="secondary" onPress={() => setIndex(index - 1)} />
            </View>
            <View style={styles.actionItem}>
              <Button title={isLast ? 'Create account' : 'Next'} onPress={goNext} />
            </View>
          </View>
        )}
      </View>
    </Screen>
  );
}

// Top-right "Sign in ›" shortcut. Replaces the older Skip ghost button so
// the action is named (Sign in) and visually styled like the slide 0
// "Next ›" link, with a small chevron to suggest forward motion.
function SignInShortcut({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.signInLink, pressed ? styles.signInLinkPressed : null]}
      accessibilityRole="button"
      accessibilityLabel="Sign in"
    >
      <Text style={styles.signInLinkLabel}>Sign in</Text>
      <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
    </Pressable>
  );
}

// Slide 2 illustration — a stylized "find a branch" map cluster:
// a large tinted circle backdrop, a primary-coloured pin in the middle,
// and two smaller pins offset to suggest multiple branches.
function BranchIllustration() {
  return (
    <View style={styles.illustWrap}>
      <View style={styles.branchBackdrop} />
      <View style={styles.branchSmallPinLeft}>
        <Ionicons name="location" size={28} color={theme.colors.brand} />
      </View>
      <View style={styles.branchSmallPinRight}>
        <Ionicons name="location" size={28} color={theme.colors.brand} />
      </View>
      <Ionicons name="location" size={96} color={theme.colors.primary} />
    </View>
  );
}

// Slide 3 illustration — reuses the premium-card asset so users see the
// concrete reward before they sign up.
function MembershipIllustration() {
  return (
    <View style={styles.illustWrap}>
      <Image
        source={require('../../../assets/bidawash-premium-card.png')}
        style={styles.membershipCard}
        resizeMode="contain"
        accessibilityLabel="BidaWash Premium membership card preview"
      />
    </View>
  );
}

function WelcomeSlide({ body }: { body: string }) {
  return (
    <View style={styles.welcomeRoot}>
      <Image
        source={require('../../../assets/icon.png')}
        style={styles.welcomeLogo}
        resizeMode="contain"
        accessibilityLabel="BidaWash logo"
      />
      <View style={styles.welcomeTitle}>
        <Text style={styles.welcomeIntro}>Welcome to</Text>
        <View style={styles.welcomeWordmarkRow}>
          <Text style={[styles.welcomeWordmark, { color: theme.colors.brand }]}>Bida</Text>
          <Text style={[styles.welcomeWordmark, { color: theme.colors.primary }]}>Wash</Text>
        </View>
      </View>
      <Text style={styles.welcomeTagline}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'space-between' },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  // Just the Sign-in shortcut on slide 0; logo is in the body.
  topSkip: { flexDirection: 'row', justifyContent: 'flex-end' },

  // Generic slide (slides 1 and 2).
  slideArea: {
    flex: 1,
    justifyContent: 'center',
    gap: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  slideCopy: { gap: theme.spacing.md },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.text,
    lineHeight: 38,
    textAlign: 'center',
  },
  // Body text adopts the welcome tagline's brand-blue + bold treatment so
  // all three onboarding slides feel like one color family.
  body: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
    lineHeight: 22,
    textAlign: 'center',
  },

  // Illustration row for slides 1 and 2.
  illustWrap: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  branchBackdrop: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: theme.radius.full,
    backgroundColor: '#E0E7FF',
  },
  branchSmallPinLeft: {
    position: 'absolute',
    left: '30%',
    top: 60,
  },
  branchSmallPinRight: {
    position: 'absolute',
    right: '28%',
    top: 78,
  },
  membershipCard: {
    width: 260,
    height: 165,
  },

  // Welcome (slide 0) layout.
  welcomeRoot: { alignItems: 'center', gap: theme.spacing.xl },
  welcomeLogo: { width: 200, height: 200 },
  welcomeTitle: { alignItems: 'center' },
  welcomeIntro: {
    fontSize: 22,
    fontStyle: 'italic',
    fontWeight: '700',
    color: theme.colors.text,
  },
  welcomeWordmarkRow: { flexDirection: 'row' },
  welcomeWordmark: {
    fontSize: 46,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 50,
  },
  welcomeTagline: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: theme.spacing.md,
  },

  bottom: { gap: theme.spacing.lg, paddingBottom: theme.spacing.lg },
  actions: { flexDirection: 'row', gap: theme.spacing.sm },
  actionItem: { flex: 1 },
  dots: { flexDirection: 'row', gap: theme.spacing.sm, justifyContent: 'center' },
  // All dots share the same dimensions so the row stays anchored and
  // each dot keeps its position as you swipe between slides. Only the
  // colour changes to indicate the active panel.
  dot: {
    width: 10,
    height: 10,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.border,
  },
  dotActive: { backgroundColor: theme.colors.primary },

  // Top-right "Sign in ›" link — same visual treatment as the slide 0
  // "Next ›" link below.
  signInLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  signInLinkPressed: { opacity: 0.6 },
  signInLinkLabel: { fontSize: 16, fontWeight: '700', color: theme.colors.primary },

  // Slide 0 "Next ›" link, replacing the filled button. minHeight
  // matches Button's 48px so the bottom container is the same total
  // height as on slides 1+ — keeps the dots row anchored across all
  // three slides instead of jumping when you advance from slide 0.
  nextLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 48,
  },
  nextLinkPressed: { opacity: 0.6 },
  nextLinkLabel: { fontSize: 16, fontWeight: '700', color: theme.colors.primary },
});
