import { useState } from 'react';
import { ChevronRight, Trophy } from 'lucide-react';

import { Poster } from '@/components/media/Poster';

import type { useRankedYears } from './useRankedYears';

const PODIUM = 6;

export function RankedYearsSection({ ranked }: { ranked: ReturnType<typeof useRankedYears> }) {
  const [listOpen, setListOpen] = useState(false);
  const { selected, years } = ranked;
  return (
    <section aria-labelledby="h-ranked">
      <div className="sect-head">
        <h2 id="h-ranked">Ranked years</h2>
        <span className="note">By release year</span>
      </div>
      {!selected ? (
        <p className="note">Rate the titles you finish and each release year gets its own ranking.</p>
      ) : (
        <>
          <div className="ranked">
            <div className="ranked-card">
              <div className="ranked-top">
                <Trophy size={16} strokeWidth={1.8} aria-hidden="true" />
                <b>{selected.year} ranked</b>
                <span className="note">{selected.entries.length}</span>
              </div>
              <ol className="podium">
                {selected.entries.slice(0, PODIUM).map((e) => (
                  <li key={e.movie.id}>
                    <Poster
                      title={e.movie.title}
                      coverUrl={e.movie.coverUrl}
                      to={e.movie.tmdbId != null ? `/title/${e.movie.type}/${e.movie.tmdbId}` : undefined}
                    />
                    <span>{e.rank}</span>
                  </li>
                ))}
              </ol>
            </div>
            <button type="button" className="years-tile" onClick={() => setListOpen((v) => !v)} aria-expanded={listOpen}>
              <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
              <b>All years</b>
              <span className="note">{years.length}</span>
            </button>
          </div>
          {listOpen ? (
            <div className="years-list" role="group" aria-label="Ranked year">
              {years.map((y) => (
                <button key={y.year} type="button" className="chip" aria-pressed={y.year === selected.year} onClick={() => ranked.select(y.year)}>
                  {y.year}
                </button>
              ))}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
