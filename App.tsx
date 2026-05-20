import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/auth/AuthContext';
import { initSentry } from '@/lib/sentry';
import { RootNavigator } from '@/navigation/RootNavigator';

// Initialize crash reporting before anything else runs. Safe to call without
// a DSN configured — initSentry no-ops in that case.
initSentry();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
