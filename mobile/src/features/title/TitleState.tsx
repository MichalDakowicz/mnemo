import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { Pill } from '@/components/ui/Pill';
import { useScreenPadding } from '@/components/layout/Screen';
import { colors } from '@/theme/colors';

type Props = { kind: 'loading' | 'error' | 'invalid'; onRetry?: () => void };

/** Loading, load-failed and not-a-title states, centred under the status bar (web `.ti-state`). */
export function TitleState({ kind, onRetry }: Props) {
  const router = useRouter();
  const pad = useScreenPadding();
  return (
    <ScrollView style={styles.page} contentContainerStyle={[pad, styles.content]}>
      {kind === 'loading' ? <EmptyState body="Loading…" /> : null}
      {kind === 'error' ? (
        <>
          <EmptyState body="Could not load this title." tone="warn" />
          <View style={styles.btn}><Pill label="Try again" onPress={onRetry} /></View>
        </>
      ) : null}
      {kind === 'invalid' ? (
        <>
          <EmptyState body="That is not a title Mnemo can open." />
          <View style={styles.btn}><Pill label="Back to library" onPress={() => router.replace('/')} /></View>
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.ground },
  content: { paddingTop: 140 },
  btn: { alignItems: 'center' },
});
