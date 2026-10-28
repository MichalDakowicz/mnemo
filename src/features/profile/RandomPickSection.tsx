import { Link } from 'react-router-dom';

import { Poster } from '@/components/media/Poster';
import { formatRuntime } from '@/lib/cardInfo';
import { titleMeta } from '@/lib/statsSummary';

import type { useRandomPick } from './useRandomPick';

export function RandomPickSection({ pick }: { pick: ReturnType<typeof useRandomPick> }) {
  const { picked, counts } = pick;
  const meta = picked ? [titleMeta(picked), formatRuntime(picked.runtime)].filter(Boolean).join(' · ') : '';
  return (
    <section aria-labelledby="h-pick">
      <h2 id="h-pick" className="h2">Don&apos;t know what to watch?</h2>
      <p className="note" style={{ margin: '6px 0 16px' }}>Let me pick something off your watchlist</p>
      <div className="pick-scopes">
        <button
          type="button"
          className="pill"
          onClick={() => pick.pick('services')}
          disabled={!pick.hasServices || counts.services === 0}
          title={pick.hasServices ? undefined : 'Choose your streaming services in Settings first'}
        >
          On my services <small>{counts.services}</small>
        </button>
        <button type="button" className="pill" onClick={() => pick.pick('library')} disabled={counts.library === 0}>
          Whole watchlist <small>{counts.library}</small>
        </button>
      </div>
      {counts.library === 0 ? <p className="note" style={{ marginTop: 12 }}>Your watchlist is empty.</p> : null}
      {picked ? (
        <div className="pick-result" aria-live="polite">
          <Poster title={picked.title} coverUrl={picked.coverUrl} />
          <div>
            <p className="pick-title">{picked.title}</p>
            <p className="pick-meta">{meta}</p>
            <div className="btns">
              {picked.tmdbId != null ? (
                <Link className="pill small primary" to={`/title/${picked.type}/${picked.tmdbId}`}>
                  Details
                </Link>
              ) : null}
              <button type="button" className="pill small" onClick={pick.again}>
                Another
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
