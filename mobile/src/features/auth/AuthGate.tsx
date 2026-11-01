import type { ReactNode } from 'react';
import { View } from 'react-native';

import { colors } from '@/theme/colors';

import { useAuth } from './AuthProvider';
import { SignInScreen } from './SignInScreen';

// Everything needs a session; signed-out visitors get the sign-in screen.
export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <View accessibilityState={{ busy: true }} style={{ flex: 1, backgroundColor: colors.ground }} />;
  if (!user) return <SignInScreen />;
  return <>{children}</>;
}
