import { Redirect } from 'expo-router';

// Google sign-in returns to mnemo://auth-callback. The PKCE code is exchanged in features/auth/authActions
// once the browser session closes; the router only has to land somewhere real instead of "unmatched route".
export default function AuthCallback() {
  return <Redirect href="/" />;
}
