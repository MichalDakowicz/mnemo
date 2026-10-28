import { CheckCheck, ChevronDown, Eraser, RotateCcw } from 'lucide-react';
import { useState } from 'react';

import type { SeasonInfo } from '@/lib/tmdbExtra';

import { Collapse } from './Collapse';
import { ConfirmDialog } from './ConfirmDialog';
import { EpisodeRow } from './EpisodeRow';
import type { EpisodeTracker } from './useEpisodeTracker';
import type { TitleForm } from './useTitleForm';

type Props = { tracker: EpisodeTracker; seasonCount: number; seasons: SeasonInfo[]; tf: TitleForm | null };

/** Season chips, progress bar and the episode checklist (episode_watch_dates is the source of truth). */
export function EpisodesPanel({ tracker: t, seasonCount, seasons, tf }: Props) {
  const [confirmRewatch, setConfirmRewatch] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [folded, setFolded] = useState(false);
  const numbers = t.episodes.map((e) => e.episode_number);
  const complete = t.progress.total > 0 && t.progress.watched === t.progress.total;
  const chips = Array.from({ length: Math.max(1, seasonCount) }, (_, i) => i + 1);
  // Whole-series progress, shown in the header while the card is folded.
  const total = chips.reduce((sum, n) => sum + (seasons.find((x) => x.number === n)?.episodeCount ?? 0), 0);
  const overall = { total, watched: tf ? chips.reduce((sum, n) => sum + t.watchedIn(n), 0) : null };

  return (
    <section className={folded ? 'panel card folded' : 'panel card'} aria-label="Episodes">
      <div className="ti-panel-head tight">
        <h2>
          <button type="button" className="ti-fold" aria-expanded={!folded} onClick={() => setFolded((f) => !f)}>
            Episodes
            <ChevronDown size={14} className={`ti-chev${folded ? '' : ' open'}`} aria-hidden="true" />
          </button>
        </h2>
        {folded ? (
          <div className="ti-prog ti-head-in" aria-label="Progress across all seasons">
            <p>{overall.watched !== null ? `${overall.watched} / ${overall.total} watched` : `${overall.total} episodes`}</p>
            {overall.watched !== null ? <div className="ti-bar"><span style={{ width: `${overall.total ? (overall.watched / overall.total) * 100 : 0}%` }} /></div> : null}
          </div>
        ) : (
          <div className="ti-chips ti-head-in" role="group" aria-label="Season">
            {chips.map((n) => {
              const count = seasons.find((s) => s.number === n)?.episodeCount;
              return (
                <button key={n} type="button" className="chip" aria-pressed={t.season === n} onClick={() => t.setSeason(n)}>
                  Season {n}
                  {count ? <small>{tf ? `${t.watchedIn(n)}/` : ''}{count}</small> : null}
                </button>
              );
            })}
            {tf && t.episodes.length > 0 ? (
              <>
                <button
                  type="button"
                  className="text-button ti-act"
                  aria-label={complete ? 'Clear season' : 'Mark season watched'}
                  onClick={() => (complete ? setConfirmClear(true) : tf.completeSeason(t.season, numbers))}
                >
                  {complete ? <Eraser size={13} aria-hidden="true" /> : <CheckCheck size={13} aria-hidden="true" />}
                  {complete ? 'Clear' : 'Mark watched'}
                </button>
                <button type="button" className="text-button ti-act" aria-label="Rewatch season" onClick={() => setConfirmRewatch(true)}>
                  <RotateCcw size={13} aria-hidden="true" />
                  Rewatch
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>

      <Collapse open={!folded}>
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
      </Collapse>

      <ConfirmDialog
        open={confirmClear}
        title={`Clear season ${t.season}?`}
        description={`Removes every watch logged for all ${t.episodes.length} episodes of season ${t.season}, dates included. This cannot be undone.`}
        confirmLabel="Clear season"
        destructive
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          setConfirmClear(false);
          tf?.clearSeason(t.season, numbers);
        }}
      />
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
