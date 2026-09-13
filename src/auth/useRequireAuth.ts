import { Alert } from 'react-native';

import { useAuth } from './AuthContext';

// Guards actions that only make sense for signed-in users when the app
// is in guest mode. Returns true to proceed; false + shows an alert
// prompting sign-up otherwise. The "Sign up" button exits guest mode,
// which drops the user back onto the auth flow (Onboarding → SignUp).
//
// Usage:
//   const requireAuth = useRequireAuth();
//   async function toggleFavorite() {
//     if (!requireAuth('save favorite branches')) return;
//     // ... proceed
//   }
export function useRequireAuth() {
  const { user, exitGuestMode } = useAuth();
  return function requireAuth(reason: string): boolean {
    if (user) return true;
    Alert.alert('Sign up to continue', `Create a free BidaWash account to ${reason}.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign up', onPress: exitGuestMode },
    ]);
    return false;
  };
}
