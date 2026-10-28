import { Check, Minus, Plus } from 'lucide-react';
import type { CSSProperties } from 'react';

import type { CachedEpisode } from '@/lib/seasonCache';
import { hueFromTitle } from '@/lib/hue';
import { formatDate } from '@/lib/titleFacts';
import { shortDay } from '@/lib/titleStatus';

type Props = {
  season: number;
  episode: CachedEpisode;
  count: number;
  lastWatch: string | null;
  /** null = read-only (title not in the library). */
  onToggle: (() => void) | null;
  onBump: (delta: number) => void;
};

const VARIANTS = ['', 'v1', 'v3'];

export function EpisodeRow({ season, episode, count, lastWatch, onToggle, onBump }: Props) {
  const done = count > 0;
  const n = episode.episode_number;
  const hue = (hueFromTitle(episode.name || `e${n}`) + n * 9) % 360;
  const aired = formatDate(episode.air_date);
  const watched = shortDay(lastWatch);

  return (
    <div className="ti-ep">
      <span className={`ti-ep-thumb art ${VARIANTS[n % 3]}`} style={{ '--h': hue } as CSSProperties}>
        <span className="ti-ep-code">S{season} E{n}</span>
        {onToggle ? (
          <button
            type="button"
            className="ti-ep-check"
            aria-pressed={done}
            aria-label={`${done ? 'Mark unwatched' : 'Mark watched'}: ${episode.name || `Episode ${n}`}`}
            onClick={onToggle}
          >
            <Check size={12} strokeWidth={3} aria-hidden="true" />
          </button>
        ) : null}
      </span>
      <span className="ti-ep-text">
        <span className={`ti-ep-title${done ? ' done' : ''}`}>{n}. {episode.name || `Episode ${n}`}</span>
        <span className="ti-ep-meta">
          <span>{aired ?? 'Air date unknown'}{done && watched ? ` · Watched ${watched}` : ''}</span>
          {done ? (
            <span className="ti-step" role="group" aria-label="Times watched">
              <button type="button" aria-label="One fewer watch" onClick={() => onBump(-1)}><Minus size={12} /></button>
              <span>{count}</span>
              <button type="button" aria-label="One more watch" onClick={() => onBump(1)}><Plus size={12} /></button>
            </span>
          ) : null}
        </span>
        {episode.overview ? <span className="ti-ep-desc">{episode.overview}</span> : null}
      </span>
    </div>
  );
}
