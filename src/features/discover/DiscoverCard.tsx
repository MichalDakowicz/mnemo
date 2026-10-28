import { Link } from 'react-router-dom';

import { Art } from '@/components/media/Art';
import { discoverMeta } from '@/lib/discoverCardMeta';
import type { DiscoverItem } from '@/lib/toDiscoveryMovie';

import { AddButton } from './AddButton';
import type { CardActions } from './useCardActions';

/** One title: cover (or generated art), name, "year · genre · kind", and a quick add / remove. */
export function DiscoverCard({ item, actions }: { item: DiscoverItem; actions: CardActions }) {
  const target = { tmdbId: item.tmdbId, type: item.type, title: item.title };
  return (
    <div className="card">
      <Link to={`/title/${item.type}/${item.tmdbId}`} aria-label={item.title}>
        <span className="cover">
          {item.coverUrl ? <img src={item.coverUrl} alt="" loading="lazy" /> : <Art title={item.title} />}
        </span>
        <span className="card-title">{item.title}</span>
        <span className="card-meta">{discoverMeta(item)}</span>
      </Link>
      <AddButton
        added={actions.isAdded(item)}
        pending={actions.isPending(item)}
        title={item.title}
        onToggle={() => void actions.toggle(target)}
      />
    </div>
  );
}
