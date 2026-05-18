import { useAuth } from '@/auth/AuthContext';

import { AppTabs } from './AppTabs';
import { AuthStack } from './AuthStack';

// Single source of truth for which navigation tree is mounted. Swapping at
// this level (rather than navigating between auth and app screens) means
// the stack histories don't bleed across the auth boundary.
export function RootNavigator() {
  const { user } = useAuth();
  return user ? <AppTabs /> : <AuthStack />;
}
