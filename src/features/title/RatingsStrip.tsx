import { ChevronDown } from 'lucide-react';

import { averageRating, ratingText } from '@/lib/titleStatus';

import type { FriendTake } from './useTitleFriends';

type Props = {
  voteAverage: number;
  voteCount: number;
  /** null when the title is not in the library: nothing to rate yet. */
  mine: number | null;
  open: boolean;
  onToggle: () => void;
  friends: FriendTake[];
  controls: string;
};

/** TMDB score, your rating (opens the drawer) and your friends' average. */
export function RatingsStrip({ voteAverage, voteCount, mine, open, onToggle, friends, controls }: Props) {
  const rated = friends.filter((f) => f.rating > 0);
  const friendAvg = averageRating(rated.map((f) => f.rating));
  const mineText = ratingText(mine);

  return (
    <div className="ti-ratings">
      <div>
        <span className="ti-k caps">TMDB</span>
        {voteAverage > 0 ? (
          <>
            <strong className="ti-big">{voteAverage.toFixed(1)}</strong>
            <small>/10{voteCount > 0 ? ` · ${voteCount.toLocaleString('en-US')} votes` : ''}</small>
          </>
        ) : (
          <strong className="ti-big">—</strong>
        )}
      </div>
      <div>
        <button type="button" className="ti-rate-toggle" onClick={onToggle} aria-expanded={open} aria-controls={controls} disabled={mine === null}>
          <span className="ti-k">Your rating</span>
          <span className="row1">
            <strong className="ti-big">{mineText ?? (mine === null ? '—' : 'Rate')}</strong>
            <small>{mineText ? '/5' : ''}</small>
            {mine !== null ? <ChevronDown size={14} className={`ti-chev${open ? ' open' : ''}`} aria-hidden="true" /> : null}
          </span>
        </button>
      </div>
      <div>
        <span className="ti-k">Friends</span>
        <strong className="ti-big">{friendAvg ? friendAvg.toFixed(1) : '—'}</strong>
        <small>{rated.length ? ` · ${rated.length} rated` : ''}</small>
      </div>
    </div>
  );
}
