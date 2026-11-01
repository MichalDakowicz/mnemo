import { useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/fonts';

import { useScrollIntoView } from './ScrollIntoView';

type Props = { value: string; onChange: (v: string) => void };

/** Your notes: every keystroke goes to the form, which saves on its own (useTitleForm). */
export function NotesPanel({ value, onChange }: Props) {
  const box = useRef<View>(null);
  const scrollIntoView = useScrollIntoView();
  return (
    <View ref={box}>
      <View style={styles.lab}>
        <Text style={styles.title}>Your notes</Text>
        <Text style={styles.hint}>Only you see these</Text>
      </View>
      <TextInput
        multiline
        textAlignVertical="top"
        accessibilityLabel="Your notes"
        value={value}
        onChangeText={onChange}
        onFocus={() => scrollIntoView(box.current)}
        placeholder="What stayed with you? Scenes, lines, who you watched it with…"
        placeholderTextColor={colors.dim}
        selectionColor={colors.primary}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  lab: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 10 },
  title: { fontSize: 13, fontWeight: '600' },
  hint: { fontSize: 12, color: colors.dim },
  input: {
    minHeight: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    backgroundColor: colors.wash,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
