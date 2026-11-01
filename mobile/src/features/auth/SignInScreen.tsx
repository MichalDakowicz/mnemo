import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/layout/BrandMark';
import { Glass } from '@/components/ui/Glass';
import { Pill } from '@/components/ui/Pill';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/fonts';

import { signInWithEmail, signInWithGoogle } from './authActions';

// Not covered by the design artboards: built from the same tokens. See docs/DESIGN-GAPS.md.
export function SignInScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Glass radius={20} style={styles.card}>
        <View style={styles.brand}>
          <BrandMark />
          <Text tracking={-0.04} style={{ fontSize: 28, fontWeight: '600' }}>Mnemo</Text>
        </View>
        <Text style={styles.lede}>Your memory of what you watched. Sign in with the account you use in Radar.</Text>
        <Pill variant="primary" height={44} label="Continue with Google" disabled={busy} onPress={() => run(signInWithGoogle)} />
        <Text style={styles.or}>or</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.dim}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
          selectionColor={colors.primary}
          accessibilityLabel="Email"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.dim}
          autoCapitalize="none"
          autoComplete="current-password"
          secureTextEntry
          textContentType="password"
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={() => run(() => signInWithEmail(email, password))}
          selectionColor={colors.primary}
          accessibilityLabel="Password"
        />
        <Pill height={44} label="Sign in" disabled={busy || !email || !password} onPress={() => run(() => signInWithEmail(email, password))} />
        {error ? <Text accessibilityRole="alert" style={{ fontSize: 13, color: colors.warn }}>{error}</Text> : null}
      </Glass>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ground, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 400, padding: 28, gap: 14 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  lede: { fontSize: 14, lineHeight: 21, color: colors.muted },
  or: { fontSize: 12, color: colors.dim, textAlign: 'center' },
  input: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    backgroundColor: colors.inputFill,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
  },
});
