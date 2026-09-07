import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { theme } from '@/theme';

// Bell icon for tab-root headers. The red badge counts user-facing
// "things to do" — for now that's just "verify your email", but the
// concept extends to push-notification inbox / membership reminders
// when Phase 3 lands. Decorative for now: tapping it is a no-op
// until we wire a notifications screen.
export function NotificationBell() {
  const { user } = useAuth();
  const unread = user && !user.emailVerified ? 1 : 0;

  return (
    <Pressable
      onPress={() => {
        // Future: navigate to a notifications inbox. No-op for now so
        // it doesn't break anything.
      }}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={unread > 0 ? `${unread} unread notification` : 'Notifications'}
      style={styles.root}
    >
      <Ionicons name="notifications" size={22} color={theme.colors.text} />
      {unread > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>{unread}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { paddingHorizontal: 4 },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    backgroundColor: theme.colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
  },
});
