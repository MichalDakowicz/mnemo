import { Link2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Pressable, Share, StyleSheet, View } from 'react-native';

import { Panel } from '@/components/ui/Panel';
import { Pill } from '@/components/ui/Pill';
import { SectionHead } from '@/components/ui/SectionHead';
import { Text } from '@/components/ui/Text';
import { useAuth } from '@/features/auth/AuthProvider';
import { colors } from '@/theme/colors';

import { useShelfLink } from './useShelfLink';
import { VisibilityChips } from './VisibilityChips';

/** "Your shelf": who may open it, and the link to share. */
export function ShelfPanel() {
  const { user } = useAuth();
  const router = useRouter();
  const { url, copied, copy } = useShelfLink(user?.id);
  return (
    <Panel>
      <SectionHead
        title="Your shelf"
        right={
          user ? (
            <Pressable accessibilityRole="link" hitSlop={8} onPress={() => router.push(`/u/${user.id}`)}>
              <Text style={styles.preview}>Preview</Text>
            </Pressable>
          ) : undefined
        }
      />
      <Text style={styles.lead}>Your library, ratings and stats as a read-only page. Choose who can open it.</Text>
      <VisibilityChips />
      <View style={styles.linkRow}>
        <Link2 size={15} color={colors.dim} strokeWidth={1.8} />
        <Text mono numberOfLines={1} style={styles.url}>{url.replace(/^https?:\/\//, '')}</Text>
      </View>
      <View style={styles.actions}>
        <Pill label={copied ? 'Copied' : 'Copy link'} disabled={!url} onPress={() => void copy()} />
        <Pill label="Share" disabled={!url} onPress={() => void Share.share({ message: url })} />
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  preview: { fontSize: 13, color: colors.muted },
  lead: { fontSize: 13, lineHeight: 21, color: colors.muted },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.hairline },
  url: { flex: 1, minWidth: 0, fontSize: 12, color: colors.muted },
  actions: { flexDirection: 'row', gap: 8 },
});
