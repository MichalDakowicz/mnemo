import { useState } from 'react';

import type { SeasonInfo } from '@/lib/tmdbExtra';

import { ConfirmDialog } from './ConfirmDialog';
import { EpisodeRow } from './EpisodeRow';
import type { EpisodeTracker } from './useEpisodeTracker';
import type { TitleForm } from './useTitleForm';

type Props = { tracker: EpisodeTracker; seasonCount: number; seasons: SeasonInfo[]; tf: TitleForm | null };

/** Season chips, progress bar and the episode checklist (episode_watch_dates is the source of truth). */
export function EpisodesPanel({ tracker: t, seasonCount, seasons, tf }: Props) {
  const [confirmRewatch, setConfirmRewatch] = useState(false);
  const numbers = t.episodes.map((e) => e.episode_number);
  const complete = t.progress.total > 0 && t.progress.watched === t.progress.total;
  const chips = Array.from({ length: Math.max(1, seasonCount) }, (_, i) => i + 1);

  return (
    <section className="panel" aria-label="Episodes">
      <div className="ti-panel-head tight">
        <h2>Episodes</h2>
        <div className="ti-chips" role="group" aria-label="Season">
          {chips.map((n) => {
            const total = seasons.find((s) => s.number === n)?.episodeCount;
            return (
              <button key={n} type="button" className="chip" aria-pressed={t.season === n} onClick={() => t.setSeason(n)}>
                Season {n}
                {total ? <small>{tf ? `${t.watchedIn(n)}/` : ''}{total}</small> : null}
              </button>
            );
          })}
          {tf && t.episodes.length > 0 ? (
            <>
              <button
                type="button"
                className="text-button"
                onClick={() => (complete ? tf.clearSeason(t.season, numbers) : tf.completeSeason(t.season, numbers))}
              >
                {complete ? 'Clear season' : 'Mark season watched'}
              </button>
              <button type="button" className="text-button" onClick={() => setConfirmRewatch(true)}>Rewatch season</button>
            </>
          ) : null}
        </div>
      </div>

      {t.loading ? <p className="ti-note">Loading episodes…</p> : null}
      {!t.loading && t.episodes.length === 0 ? <p className="ti-note">TMDB has no episodes for this season yet.</p> : null}
      {t.episodes.length > 0 ? (
        <>
          <div className="ti-prog">
            <p>Season {t.season} · {t.progress.total} episodes{tf ? ` · ${t.progress.watched} watched` : ''}</p>
            {tf ? <div className="ti-bar"><span style={{ width: `${t.progress.pct}%` }} /></div> : null}
          </div>
          <div className="ti-eps">
            {t.episodes.map((e) => (
              <EpisodeRow
                key={e.id}
                season={t.season}
                episode={e}
                count={t.counts[e.episode_number] ?? 0}
                lastWatch={t.lastWatch(e.episode_number)}
                onToggle={tf ? () => tf.toggleEpisode(t.season, e.episode_number) : null}
                onBump={(d) => tf?.bumpEpisode(t.season, e.episode_number, d)}
              />
            ))}
          </div>
        </>
      ) : null}

      <ConfirmDialog
        open={confirmRewatch}
        title={`Rewatch season ${t.season}?`}
        description={`Logs another watch of all ${t.episodes.length} episodes, dated now. Use the minus and plus on a row to correct a single episode.`}
        confirmLabel="Log rewatch"
        onCancel={() => setConfirmRewatch(false)}
        onConfirm={() => {
          setConfirmRewatch(false);
          tf?.rewatchSeason(t.season, numbers);
        }}
      />
    </section>
  );
}
