import { Dices } from 'lucide-react';
import { createPortal } from 'react-dom';

import type { Movie } from '@/types/movie';

import { RandomReel } from './RandomReel';
import { useRandomPick } from './useRandomPick';

/** The toolbar's Random button; it opens the Discover coverflow filled with the library and spins it. */
export function RandomPick({ pool }: { pool: Movie[] }) {
  const { spin, pick, close, empty } = useRandomPick(pool);
  return (
    <>
      <button type="button" className="pill rand" onClick={pick} disabled={empty} title={empty ? 'Nothing to pick from with these filters' : undefined}>
        <Dices size={16} aria-hidden="true" />Random
      </button>
      {spin ? createPortal(<RandomReel items={spin.items} winner={spin.winner} run={spin.run} onAnother={pick} onClose={close} />, document.body) : null}
    </>
  );
}
