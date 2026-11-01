import { X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Modal, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { titleHref } from '@/components/media/MovieCard';
import { IconButton } from '@/components/ui/IconButton';
import { Pill } from '@/components/ui/Pill';
import { Text } from '@/components/ui/Text';
import { cardSubtitleLine } from '@/lib/cardInfo';
import { colors } from '@/theme/colors';
import type { Movie } from '@/types/movie';

import { ReelItem, REEL_CARD_WIDTH } from './ReelItem';
import { useReelSpin } from './useReelSpin';

type Props = { items: Movie[]; winner: number; run: number; onAnother: () => void; onClose: () => void };

/** Full-screen coverflow of library titles that spins to the random pick. */
export function RandomReel({ items, winner, run, onAnother, onClose }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { pos, landed } = useReelSpin(items.length, winner, run);
  const picked = items[winner];
  const href = titleHref(picked);

  const open = () => {
    if (!href) return;
    onClose();
    router.push(href);
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom + 16 }]} accessibilityViewIsModal>
        <View style={[styles.close, { top: insets.top + 12 }]}>
          <IconButton label="Close" onPress={onClose}>
            <X size={18} color={colors.text} />
          </IconButton>
        </View>
        <View style={styles.stage} accessibilityLabel="Your library, spinning to a random pick">
          {items.map((m, i) => <ReelItem key={m.id} movie={m} index={i} count={items.length} pos={pos} />)}
        </View>
        <View style={styles.info} accessibilityLiveRegion="polite">
          {landed ? (
            <Animated.View entering={FadeIn.duration(450)} style={styles.infoIn}>
              <Text style={styles.kicker}>Tonight, maybe</Text>
              <Text numberOfLines={2} tracking={-0.04} style={styles.title}>{picked.title}</Text>
              <Text style={styles.meta}>{cardSubtitleLine(picked) || ' '}</Text>
              <View style={styles.actions}>
                {href ? <Pill variant="primary" label="Open" height={44} style={styles.action} onPress={open} /> : null}
                <Pill label="Spin again" height={44} style={styles.action} onPress={onAnother} />
              </View>
            </Animated.View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.scrim, justifyContent: 'center', gap: 28 },
  close: { position: 'absolute', right: 16, zIndex: 200 },
  stage: { height: REEL_CARD_WIDTH * 1.5 + 40, justifyContent: 'center', overflow: 'visible' },
  info: { minHeight: 170, paddingHorizontal: 24 },
  infoIn: { alignItems: 'center', gap: 4 },
  kicker: { fontSize: 11, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', color: colors.dim },
  title: { fontSize: 26, fontWeight: '500', lineHeight: 29, textAlign: 'center' },
  meta: { fontSize: 12.5, color: colors.dim },
  actions: { flexDirection: 'row', gap: 8, marginTop: 14 },
  action: { paddingHorizontal: 22 },
});
