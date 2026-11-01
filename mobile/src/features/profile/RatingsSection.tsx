import { View } from 'react-native';

import { SectionHead } from '@/components/ui/SectionHead';
import { Text } from '@/components/ui/Text';
import { formatScore } from '@/lib/profileFormat';
import type { RatingCurve } from '@/lib/ratingCurve';
import { colors } from '@/theme/colors';

import { RatingCurveChart } from './RatingCurveChart';

type Props = { rated: number; average: number | null; curve: RatingCurve | null };

export function RatingsSection({ rated, average, curve }: Props) {
  const note = rated === 0 ? 'Nothing rated yet' : `${rated} rated · avg ★ ${formatScore(average)}`;
  return (
    <View>
      <SectionHead title="Ratings" meta={note} />
      {curve ? (
        <RatingCurveChart curve={curve} rated={rated} label={`How your ${rated} ratings spread from 0 to 5 stars`} />
      ) : (
        <Text style={{ fontSize: 13, color: colors.dim }}>Rate a title and the curve appears.</Text>
      )}
    </View>
  );
}
