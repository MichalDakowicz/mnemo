import { Search, X } from 'lucide-react-native';
import { forwardRef } from 'react';
import { Pressable, StyleSheet, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme/colors';
import { fonts } from '@/theme/fonts';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onSubmit?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Pill search field (web `.search-small`): 40px, inputFill, dim placeholder, clear button. */
export const SearchField = forwardRef<TextInput, Props>(function SearchField(
  { value, onChangeText, placeholder = 'Search', autoFocus, onSubmit, style },
  ref,
) {
  return (
    <View style={[styles.box, style]}>
      <Search size={16} color={colors.dim} strokeWidth={1.8} />
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.dim}
        autoFocus={autoFocus}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        selectionColor={colors.primary}
        accessibilityLabel={placeholder}
        style={styles.input}
      />
      {value ? (
        <Pressable accessibilityLabel="Clear search" hitSlop={10} onPress={() => onChangeText('')}>
          <X size={16} color={colors.dim} />
        </Pressable>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  box: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: colors.inputFill,
    borderWidth: 1,
    borderColor: colors.chipBorder,
  },
  input: { flex: 1, minWidth: 0, padding: 0, fontSize: 14, fontFamily: fonts.regular, color: colors.text },
});
