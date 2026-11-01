import { ScrollView, View } from 'react-native';

import { SectionHead } from '@/components/ui/SectionHead';
import type { PersonCredit } from '@/lib/personCredits';
import { yearOf } from '@/lib/titleFacts';
import { PAGE_GUTTER } from '@/theme/layout';

import { CreditCard } from './CreditCard';
import type { useLibraryIndex } from './useLibraryIndex';

type Props = { items: PersonCredit[]; library: ReturnType<typeof useLibraryIndex> };

export function KnownForRow({ items, library }: Props) {
  if (items.length === 0) return null;
  return (
    <View style={{ marginBottom: 28 }}>
      <SectionHead title="Known for" meta="Most popular on TMDB" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -PAGE_GUTTER }}
        contentContainerStyle={{ paddingHorizontal: PAGE_GUTTER, gap: 12 }}>
        {items.map((c) => (
          <CreditCard
            key={c.key}
            width={92}
            tag={false}
            item={{ tmdbId: c.tmdbId, type: c.type, title: c.title, coverUrl: c.coverUrl, role: c.role, meta: yearOf(c.releaseDate) }}
            entry={library[c.key]}
          />
        ))}
      </ScrollView>
    </View>
  );
}
