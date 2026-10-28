import { supabase } from '@/lib/supabase';

/**
 * Google OAuth against Radar's Supabase project, so the same account (and the same
 * library) signs in. The page redirects out and back; supabase-js reads the code from the URL.
 * In the desktop app the Google page opens in the system browser, so use email there.
 */
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/' },
  });
  if (error) throw error;
}

export async function signInWithEmail(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

/** Ends this device's session only; other devices stay signed in. */
export async function signOut() {
  const { error } = await supabase.auth.signOut({ scope: 'local' });
  if (error) throw error;
}
