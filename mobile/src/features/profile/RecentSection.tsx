import { ScrollView, View } from 'react-native';

import { SectionHead } from '@/components/ui/SectionHead';
import { Text } from '@/components/ui/Text';
import { personalScore } from '@/lib/personalScore';
import { formatScore } from '@/lib/profileFormat';
import { whenLabel } from '@/lib/statsSummary';
import { colors } from '@/theme/colors';
import { PAGE_GUTTER } from '@/theme/layout';
import type { Movie } from '@/types/movie';

import { TitleCard } from './TitleCard';

export function RecentSection({ recent }: { recent: Movie[] }) {
  return (
    <View>
      <SectionHead title="Recently logged" meta={recent.length > 0 ? `Last ${recent.length}` : undefined} />
      {recent.length === 0 ? (
        <Text style={{ fontSize: 13, color: colors.dim }}>Nothing finished yet. Titles you complete land here.</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: -PAGE_GUTTER }}
          contentContainerStyle={{ paddingHorizontal: PAGE_GUTTER, gap: 12 }}>
          {recent.map((m) => (
            <TitleCard
              key={m.id}
              title={m.title}
              coverUrl={m.coverUrl}
              width={92}
              to={m.tmdbId != null ? `/title/${m.type}/${m.tmdbId}` : null}
              meta={`★ ${formatScore(personalScore(m.ratings))} · ${whenLabel(m.completedAt || m.updatedAt)}`}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
