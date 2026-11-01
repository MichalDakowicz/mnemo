import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { Text } from '@/components/ui/Text';
import { CURVE_HEIGHT, CURVE_WIDTH, type RatingCurve } from '@/lib/ratingCurve';
import { colors } from '@/theme/colors';

type Props = { curve: RatingCurve; rated: number; label?: string };

/** How titles are rated, 0 to 5 stars, as a smooth curve: one star under its left end, five under its right. */
export function RatingCurveChart({ curve, rated, label }: Props) {
  const gradient = useId().replace(/:/g, '');
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={label ?? `How ${rated} ratings spread from 0 to 5 stars`}>
      <Svg width="100%" height={CURVE_HEIGHT} viewBox={`0 0 ${CURVE_WIDTH} ${CURVE_HEIGHT}`} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.text} stopOpacity={0.16} />
            <Stop offset="1" stopColor={colors.text} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Path d={curve.area} fill={`url(#${gradient})`} />
        <Path d={curve.line} fill="none" stroke={colors.text} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <View style={styles.axis} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Text style={styles.star}>★</Text>
        <Text style={styles.star}>★★★★★</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  axis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  star: { fontSize: 11, color: colors.dim },
});
