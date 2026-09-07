import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '@/auth/AuthContext';
import { ResetPasswordScreen } from '@/features/auth/ResetPasswordScreen';
import { theme } from '@/theme';

import { AppTabs } from './AppTabs';
import { AuthStack } from './AuthStack';

// Single source of truth for which navigation tree is mounted. Swapping at
// this level (rather than navigating between auth and app screens) means
// the stack histories don't bleed across the auth boundary.
export function RootNavigator() {
  const { user, isInitializing, passwordRecovery } = useAuth();
  if (isInitializing) {
    // Match the native splash (brand red, white spinner) so users don't see a
    // jarring white flash between the native splash and the first navigator.
    return (
      <View style={styles.splash}>
        <ActivityIndicator color="#FFFFFF" />
      </View>
    );
  }
  if (passwordRecovery) {
    return <ResetPasswordScreen />;
  }
  return user ? <AppTabs /> : <AuthStack />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.brand,
  },
});
