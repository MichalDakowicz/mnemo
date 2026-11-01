import { StyleSheet, Text as RNText, type TextProps } from 'react-native';

import { colors } from '@/theme/colors';
import { familyForWeight } from '@/theme/fonts';

type Props = TextProps & {
  /** Geist Mono: paths, times, counts. */
  mono?: boolean;
  /** Letter spacing in em, like the web's `-.04em`. Converted to px from the font size. */
  tracking?: number;
};

/**
 * Themed text. Write styles like CSS: `fontWeight: '600'` picks the bundled Geist file that carries it
 * (React Native has no variable weights), default colour is the page text, default size 14.
 */
export function Text({ style, mono, tracking, ...rest }: Props) {
  const { fontWeight, fontSize = 14, ...flat } = StyleSheet.flatten(style) ?? {};
  return (
    <RNText
      {...rest}
      style={[
        { color: colors.text, fontSize, fontFamily: familyForWeight(fontWeight, mono) },
        tracking != null ? { letterSpacing: fontSize * tracking } : null,
        flat,
      ]}
    />
  );
}
