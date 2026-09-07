import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ForgotPasswordScreen } from '@/features/auth/ForgotPasswordScreen';
import { SignInScreen } from '@/features/auth/SignInScreen';
import { SignUpScreen } from '@/features/auth/SignUpScreen';
import { OnboardingScreen } from '@/features/onboarding/OnboardingScreen';
import { theme } from '@/theme';

import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

// Minimal header used on screens that should be back-navigable from the
// auth flow. No title — each screen renders its own brand/title block.
const backOnlyHeader = {
  headerShown: true,
  headerTitle: '',
  headerBackTitle: '',
  headerShadowVisible: false,
  headerStyle: { backgroundColor: theme.colors.background },
  headerTintColor: theme.colors.text,
} as const;

export function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} options={backOnlyHeader} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={backOnlyHeader} />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={backOnlyHeader}
      />
    </Stack.Navigator>
  );
}
