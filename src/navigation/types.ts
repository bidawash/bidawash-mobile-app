import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// One ParamList per stack. Each tab in the bottom tab navigator hosts its
// own stack so that pushing into a detail screen doesn't dismiss the tab
// bar.

export type AuthStackParamList = {
  Onboarding: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type AppTabsParamList = {
  HomeTab: undefined;
  LocationsTab: undefined;
  MembershipTab: undefined;
  AccountTab: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  Services: undefined;
};

export type LocationsStackParamList = {
  LocationsList: undefined;
  LocationDetail: { locationId: string };
};

export type MembershipStackParamList = {
  MembershipInfo: undefined;
};

export type AccountStackParamList = {
  AccountHome: undefined;
  EditProfile: undefined;
  Faqs: undefined;
  Support: undefined;
  Privacy: undefined;
  Terms: undefined;
};

// Typed screen-prop shortcuts so screens can write
//   function SignInScreen({ navigation }: AuthScreenProps<'SignIn'>) {…}
export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;
export type HomeScreenProps<T extends keyof HomeStackParamList> = NativeStackScreenProps<
  HomeStackParamList,
  T
>;
export type LocationsScreenProps<T extends keyof LocationsStackParamList> = NativeStackScreenProps<
  LocationsStackParamList,
  T
>;
export type AccountScreenProps<T extends keyof AccountStackParamList> = NativeStackScreenProps<
  AccountStackParamList,
  T
>;
