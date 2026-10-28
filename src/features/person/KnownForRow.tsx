import type { PersonCredit } from '@/lib/personCredits';
import { yearOf } from '@/lib/titleFacts';

import { CreditCard } from './CreditCard';
import type { useLibraryIndex } from './useLibraryIndex';

type Props = { items: PersonCredit[]; library: ReturnType<typeof useLibraryIndex> };

export function KnownForRow({ items, library }: Props) {
  if (items.length === 0) return null;
  return (
    <section className="pe-section" aria-labelledby="h-known">
      <div className="pe-sec-head">
        <h2 id="h-known">Known for</h2>
        <span>Most popular on TMDB</span>
      </div>
      <div className="pe-row">
        {items.map((c) => (
          <CreditCard
            key={c.key}
            tag={false}
            item={{ tmdbId: c.tmdbId, type: c.type, title: c.title, coverUrl: c.coverUrl, role: c.role, meta: yearOf(c.releaseDate) }}
            entry={library[c.key]}
          />
        ))}
      </div>
    </section>
  );
}
