import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AccountScreen } from '@/features/account/AccountScreen';
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

const HomeNav = createNativeStackNavigator<HomeStackParamList>();
function HomeStack() {
  return (
    <HomeNav.Navigator screenOptions={sharedStackOptions}>
      <HomeNav.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }} />
      <HomeNav.Screen name="Services" component={ServicesScreen} options={{ title: 'Services' }} />
    </HomeNav.Navigator>
  );
}

const LocationsNav = createNativeStackNavigator<LocationsStackParamList>();
function LocationsStack() {
  return (
    <LocationsNav.Navigator screenOptions={sharedStackOptions}>
      <LocationsNav.Screen
        name="LocationsList"
        component={LocationsScreen}
        options={{ title: 'Locations' }}
      />
      <LocationsNav.Screen
        name="LocationDetail"
        component={LocationDetailScreen}
        options={{ title: 'Branch details' }}
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
        options={{ title: 'Membership' }}
      />
    </MembershipNav.Navigator>
  );
}

const AccountNav = createNativeStackNavigator<AccountStackParamList>();
function AccountStack() {
  return (
    <AccountNav.Navigator screenOptions={sharedStackOptions}>
      <AccountNav.Screen
        name="AccountHome"
        component={AccountScreen}
        options={{ title: 'Account' }}
      />
      <AccountNav.Screen name="Faqs" component={FaqsScreen} options={{ title: 'FAQs' }} />
      <AccountNav.Screen name="Support" component={SupportScreen} options={{ title: 'Support' }} />
      <AccountNav.Screen name="Privacy" component={PrivacyScreen} options={{ title: 'Privacy' }} />
      <AccountNav.Screen name="Terms" component={TermsScreen} options={{ title: 'Terms' }} />
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
