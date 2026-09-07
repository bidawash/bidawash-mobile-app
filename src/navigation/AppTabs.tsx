import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BrandMark } from '@/components/BrandMark';
import { AccountScreen } from '@/features/account/AccountScreen';
import { EditProfileScreen } from '@/features/account/EditProfileScreen';
import { FaqsScreen } from '@/features/faqs/FaqsScreen';
import { HomeScreen } from '@/features/home/HomeScreen';
import { PrivacyScreen } from '@/features/legal/PrivacyScreen';
import { TermsScreen } from '@/features/legal/TermsScreen';
import { LocationDetailScreen } from '@/features/locations/LocationDetailScreen';
import { LocationsScreen } from '@/features/locations/LocationsScreen';
import { MembershipInfoScreen } from '@/features/membership/MembershipInfoScreen';
import { ServicesScreen } from '@/features/services/ServicesScreen';
import { SupportScreen } from '@/features/support/SupportScreen';
import { theme } from '@/theme';

import type {
  AccountStackParamList,
  AppTabsParamList,
  HomeStackParamList,
  LocationsStackParamList,
  MembershipStackParamList,
} from './types';

type IconName = keyof typeof Ionicons.glyphMap;

const sharedStackOptions = {
  headerStyle: { backgroundColor: theme.colors.background },
  headerTitleStyle: { color: theme.colors.text },
  headerTintColor: theme.colors.primary,
  contentStyle: { backgroundColor: theme.colors.background },
};

// Tab-root headers show the BrandMark instead of a plain title to match
// the brand-pack design. Inner stack screens keep their text titles so
// users always know where they are.
//
// The NotificationBell (import kept) is hidden until we wire push
// notifications + an inbox screen. To re-enable:
//   headerRight: () => <NotificationBell />
const brandHeader = {
  headerTitle: () => <BrandMark size="lg" />,
  headerTitleAlign: 'center' as const,
};

const HomeNav = createNativeStackNavigator<HomeStackParamList>();
function HomeStack() {
  return (
    <HomeNav.Navigator screenOptions={sharedStackOptions}>
      <HomeNav.Screen name="HomeScreen" component={HomeScreen} options={brandHeader} />
      <HomeNav.Screen
        name="Services"
        component={ServicesScreen}
        options={{ title: 'Services', headerBackTitle: 'Home' }}
      />
    </HomeNav.Navigator>
  );
}

const LocationsNav = createNativeStackNavigator<LocationsStackParamList>();
function LocationsStack() {
  return (
    <LocationsNav.Navigator screenOptions={sharedStackOptions}>
      <LocationsNav.Screen name="LocationsList" component={LocationsScreen} options={brandHeader} />
      <LocationsNav.Screen
        name="LocationDetail"
        component={LocationDetailScreen}
        options={{ title: 'Branch details', headerBackTitle: 'Locations' }}
      />
    </LocationsNav.Navigator>
  );
}

const MembershipNav = createNativeStackNavigator<MembershipStackParamList>();
function MembershipStack() {
  return (
    <MembershipNav.Navigator screenOptions={sharedStackOptions}>
      <MembershipNav.Screen
        name="MembershipInfo"
        component={MembershipInfoScreen}
        options={brandHeader}
      />
    </MembershipNav.Navigator>
  );
}

const AccountNav = createNativeStackNavigator<AccountStackParamList>();
function AccountStack() {
  return (
    <AccountNav.Navigator screenOptions={sharedStackOptions}>
      <AccountNav.Screen name="AccountHome" component={AccountScreen} options={brandHeader} />
      <AccountNav.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit profile', headerBackTitle: 'Account' }}
      />
      <AccountNav.Screen
        name="Faqs"
        component={FaqsScreen}
        options={{ title: 'FAQs', headerBackTitle: 'Account' }}
      />
      <AccountNav.Screen
        name="Support"
        component={SupportScreen}
        options={{ title: 'Support', headerBackTitle: 'Account' }}
      />
      <AccountNav.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{ title: 'Privacy', headerBackTitle: 'Account' }}
      />
      <AccountNav.Screen
        name="Terms"
        component={TermsScreen}
        options={{ title: 'Terms', headerBackTitle: 'Account' }}
      />
    </AccountNav.Navigator>
  );
}

const Tabs = createBottomTabNavigator<AppTabsParamList>();

function iconFor(route: keyof AppTabsParamList, focused: boolean): IconName {
  switch (route) {
    case 'HomeTab':
      return focused ? 'home' : 'home-outline';
    case 'LocationsTab':
      return focused ? 'location' : 'location-outline';
    case 'MembershipTab':
      return focused ? 'card' : 'card-outline';
    case 'AccountTab':
      return focused ? 'person-circle' : 'person-circle-outline';
  }
}

export function AppTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={iconFor(route.name, focused)} size={size} color={color} />
        ),
      })}
    >
      <Tabs.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
      <Tabs.Screen
        name="LocationsTab"
        component={LocationsStack}
        options={{ title: 'Locations' }}
      />
      <Tabs.Screen
        name="MembershipTab"
        component={MembershipStack}
        options={{ title: 'Membership' }}
      />
      <Tabs.Screen name="AccountTab" component={AccountStack} options={{ title: 'Account' }} />
    </Tabs.Navigator>
  );
}
