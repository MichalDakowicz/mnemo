import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme/colors';

// Mnemo's logo (assets/logo.svg): a stacked play mark over a bar and dot. Shown on the sign-in screen only;
// the app has no logo on its working screens.
export function BrandMark({ size = 40 }: { size?: number }) {
  const c = colors.primary;
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Path d="M47 13L26 25.5L47 38Z" fill={c} stroke={c} strokeWidth={5} strokeLinejoin="round" opacity={0.35} />
      <Path d="M37 13L16 25.5L37 38Z" fill={c} stroke={c} strokeWidth={5} strokeLinejoin="round" />
      <Rect x={12} y={46} width={40} height={6} rx={3} fill={c} />
      <Circle cx={47} cy={49} r={5} fill={c} />
    </Svg>
  );
}
