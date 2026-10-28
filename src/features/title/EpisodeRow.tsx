import { Check, Minus, Plus } from 'lucide-react';
import { useState, type CSSProperties } from 'react';

import type { CachedEpisode } from '@/lib/seasonCache';
import { hueFromTitle } from '@/lib/hue';
import { formatDate } from '@/lib/titleFacts';
import { shortDay } from '@/lib/titleStatus';

import { Collapse } from './Collapse';

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
  const [min, setMin] = useState(false);
  const done = count > 0;
  const n = episode.episode_number;
  const hue = (hueFromTitle(episode.name || `e${n}`) + n * 9) % 360;
  const aired = formatDate(episode.air_date);
  const watched = shortDay(lastWatch);

  return (
    <div className={min ? 'ti-ep min' : 'ti-ep'}>
      <span className={`ti-ep-thumb art ${VARIANTS[n % 3]}`} style={{ '--h': hue } as CSSProperties}>
        {episode.still ? <img src={episode.still} alt="" loading="lazy" draggable={false} /> : null}
        <span className="ti-ep-code">S{season} E{n}</span>
        {onToggle && !done ? (
          <button type="button" className="ti-ep-check" aria-label={`Mark watched: ${episode.name || `Episode ${n}`}`} onClick={onToggle}>
            <Check size={10} strokeWidth={3} aria-hidden="true" />
          </button>
        ) : null}
        {onToggle && done ? (
          <span className="ti-ep-badge">
            <span className="ti-ep-mark" aria-hidden="true"><Check size={10} strokeWidth={3} /></span>
            <span className="ti-ep-count" role="group" aria-label="Times watched">
              <button type="button" aria-label="One fewer watch" onClick={() => onBump(-1)}><Minus size={11} /></button>
              <span>{count}</span>
              <button type="button" aria-label="One more watch" onClick={() => onBump(1)}><Plus size={11} /></button>
            </span>
          </span>
        ) : null}
      </span>
      <span className="ti-ep-text" onClick={() => setMin((m) => !m)}>
        <button type="button" className={`ti-ep-title${done ? ' done' : ''}`} aria-expanded={!min}>{n}. {episode.name || `Episode ${n}`}</button>
        <Collapse open={!min}>
          <span className="ti-ep-meta">{aired ?? 'Air date unknown'}{done && watched ? ` · Watched ${watched}` : ''}</span>
          {episode.overview ? <span className="ti-ep-desc">{episode.overview}</span> : null}
        </Collapse>
      </span>
    </div>
  );
}
