import { Check, Plus } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';

// Tints of the ground and text tokens: a dark glass dot that stays legible over any poster.
const DOT_FILL = 'rgba(10,10,11,0.7)';
const DOT_BORDER = 'rgba(255,255,255,0.18)';

type Props = { added: boolean; pending: boolean; title: string; onToggle: () => void; size?: number };

/** The round + / check on a card corner: adds to the watchlist, or removes from the library. */
export function AddButton({ added, pending, title, onToggle, size = 28 }: Props) {
  const glyph = added ? colors.onPrimary : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${added ? 'Remove from library' : 'Add to watchlist'}: ${title}`}
      accessibilityState={{ selected: added, disabled: pending }}
      disabled={pending}
      hitSlop={6}
      onPress={onToggle}
      style={({ pressed }) => [
        styles.dot,
        { width: size, height: size, borderRadius: size / 2 },
        added && styles.added,
        pending && { opacity: 0.55 },
        pressed && { transform: [{ scale: 0.92 }] },
      ]}>
      {added ? <Check size={size * 0.5} strokeWidth={3} color={glyph} /> : <Plus size={size * 0.5} strokeWidth={2.6} color={glyph} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DOT_FILL,
    borderWidth: 1,
    borderColor: DOT_BORDER,
  },
  added: { backgroundColor: colors.primary, borderColor: colors.primary },
});
