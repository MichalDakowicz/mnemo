import { Bookmark, Check, Play, Plus } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

import { Art } from '@/components/media/Art';
import { hueFromTitle } from '@/lib/hue';
import type { LibraryEntry } from '@/lib/personCredits';
import type { MediaType } from '@/types/movie';

export type CardItem = {
  tmdbId: number;
  type: MediaType;
  title: string;
  coverUrl: string | null;
  role?: string;
  meta?: string;
};

type Props = {
  item: CardItem;
  entry?: LibraryEntry;
  /** Show the kind tag (FILM / SERIES). */
  tag?: boolean;
  adding?: boolean;
  onAdd?: () => void;
};

const STATUS_LABEL = { watched: 'Watched', watching: 'Watching', watchlist: 'On watchlist' } as const;

/** A 2:3 cover with its library badge and the quick add-to-watchlist button (artboard: .card). */
export function CreditCard({ item, entry, tag = true, adding, onAdd }: Props) {
  const meta = [item.meta, entry ? STATUS_LABEL[entry.status] : '', entry && entry.rating > 0 ? `★ ${entry.rating.toFixed(1)}` : '']
    .filter(Boolean)
    .join(' · ');
  const Icon = entry?.status === 'watched' ? Check : entry?.status === 'watching' ? Play : Bookmark;

  return (
    <div className="pe-card">
      <Link to={`/title/${item.type}/${item.tmdbId}`} aria-label={item.title}>
        <span className="pe-cover" style={{ '--h': hueFromTitle(item.title) } as CSSProperties}>
          {item.coverUrl ? <img src={item.coverUrl} alt="" loading="lazy" /> : <Art title={item.title} />}
          {tag ? <span className="pe-kind">{item.type === 'tv' ? 'SERIES' : 'FILM'}</span> : null}
          {entry ? (
            <span className={`pe-badge${entry.status === 'watched' ? ' good' : ''}`}>
              <Icon size={12} strokeWidth={2.6} aria-label={STATUS_LABEL[entry.status]} role="img" />
            </span>
          ) : null}
        </span>
        <span className="n">{item.title}</span>
        {item.role ? <span className="r">{item.role}</span> : null}
        {meta ? <span className="m">{meta}</span> : null}
      </Link>
      {!entry && onAdd ? (
        <button type="button" className="pe-add" onClick={onAdd} disabled={adding} aria-label={`Add to watchlist: ${item.title}`}>
          <Plus size={14} strokeWidth={2.6} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
