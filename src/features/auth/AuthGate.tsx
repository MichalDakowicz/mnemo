import type { ReactNode } from 'react';

import { useAuth } from './AuthProvider';
import { SignInScreen } from './SignInScreen';

// Everything needs a session; signed-out visitors get the sign-in screen.
export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="signin" aria-busy="true" />;
  if (!user) return <SignInScreen />;
  return <>{children}</>;
}
