import { X } from 'lucide-react';
import { useEffect, type CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { titleHref } from '@/components/media/MovieCard';
import { ReelStage } from '@/features/discover/ReelStage';
import { useReel } from '@/features/discover/useReel';
import { cardSubtitleLine } from '@/lib/cardInfo';
import type { Movie } from '@/types/movie';

import { useReelSpin } from './useReelSpin';
import '@/features/discover/discover.css';

type Props = { items: Movie[]; winner: number; run: number; onAnother: () => void; onClose: () => void };

/** Full-screen Discover coverflow of library titles that spins to the random pick. */
export function RandomReel({ items, winner, run, onAnother, onClose }: Props) {
  const navigate = useNavigate();
  const reel = useReel(items, true);
  const { landed } = useReelSpin(reel, items.length, winner, run);
  const picked = items[winner];
  const href = titleHref(picked);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const open = (m: Movie) => {
    const to = titleHref(m);
    if (to) navigate(to);
  };

  return (
    <div className="rr" role="dialog" aria-modal="true" aria-label="Random pick" style={{ '--cx': `${reel.frame.cx.toFixed(1)}px` } as CSSProperties}>
      <button type="button" className="icon-button rr-x" aria-label="Close" onClick={onClose}><X size={18} /></button>
      <div className={landed ? 'rr-stage' : 'rr-stage spinning'}>
        <ReelStage items={items} reel={reel} label="Your library. Scroll sideways, drag, or use the arrow keys." onOpen={open} />
      </div>
      <div className={landed ? 'rr-info on' : 'rr-info'} aria-live="polite">
        <span className="rr-kicker">Tonight, maybe</span>
        <strong>{landed ? picked.title : ' '}</strong>
        <span className="mc-meta">{landed ? cardSubtitleLine(picked) : ' '}</span>
        <div className="rr-actions">
          {href ? <Link className="pill primary" to={href}>Open</Link> : null}
          <button type="button" className="pill" onClick={onAnother}>Another</button>
        </div>
      </div>
    </div>
  );
}
