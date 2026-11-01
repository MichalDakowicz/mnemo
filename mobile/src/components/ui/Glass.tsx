import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme/colors';

type Props = {
  children?: ReactNode;
  radius?: number;
  /** Menus and sheets sit on a near-opaque panel instead of the floating-chrome glass. */
  solid?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Floating chrome: translucent #1a1a1c8c + backdrop blur + 1px #ffffff14 border + soft shadow. */
export function Glass({ children, radius = 999, solid, style }: Props) {
  return (
    <View
      style={[
        styles.base,
        { borderRadius: radius, backgroundColor: solid ? colors.glassSolid : colors.glass },
        Platform.OS === 'web' ? WEB_ISOLATE : null,
        style,
      ]}>
      {solid ? null : <BlurView intensity={36} tint="dark" style={[StyleSheet.absoluteFill, WEB_BEHIND]} />}
      {children}
    </View>
  );
}

// react-native-web only: a positioned blur layer would paint over unpositioned siblings such as <input>.
// Native draws children in order, so these are no-ops there.
const WEB_BEHIND = (Platform.OS === 'web' ? { zIndex: -1 } : null) as ViewStyle | null;
const WEB_ISOLATE = { isolation: 'isolate' } as unknown as ViewStyle;

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.hairline,
    boxShadow: '0 10px 30px #0006',
  },
});
