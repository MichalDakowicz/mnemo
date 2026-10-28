import { Calculator } from 'lucide-react';
import { useState } from 'react';

import type { EditForm } from '@/lib/editForm';

import { PreciseSlider } from './PreciseSlider';
import { TickRating } from './TickRating';
import type { TitleForm } from './useTitleForm';

const CATS = [
  ['story', 'Story'],
  ['acting', 'Acting'],
  ['ending', 'Ending'],
  ['enjoyment', 'Enjoyment'],
] as const;
const EMPTY = { overall: 0, story: 0, acting: 0, ending: 0, enjoyment: 0 };

type Props = { id: string; form: EditForm; title: string; tf: TitleForm };

function AutoButton({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button type="button" className="text-button ti-small-btn" onClick={onClick}>
      <Calculator size={13} aria-hidden="true" />
      {children}
    </button>
  );
}

/** The rating drawer under the strip: overall slider, per-season (series) and category ticks. */
export function ReviewPanel({ id, form, title, tf }: Props) {
  const [season, setSeason] = useState(1);
  const isTv = form.type === 'tv';
  const seasons = Array.from({ length: Math.max(1, form.numberOfSeasons) }, (_, i) => i + 1);
  const s = form.seasonRatings[season] ?? EMPTY;

  return (
    <div id={id} className="ti-review">
      <div>
        <div className="ti-rate-row">
          <span className="ti-rate-label">Overall</span>
          <span className="ti-rate-tools">
            <AutoButton onClick={tf.autoOverall}>{isTv ? 'Auto-calc from seasons' : 'Auto-calc from categories'}</AutoButton>
            <span className="ti-rate-val">{form.overallRating.toFixed(1)} / 5</span>
          </span>
        </div>
        <PreciseSlider value={form.overallRating} label={`Overall rating for ${title}`} onChange={tf.setOverall} />
      </div>

      {isTv ? (
        <>
          <div className="ti-split">
            <div className="ti-chips" role="group" aria-label="Rate by season">
              {seasons.map((n) => {
                const v = form.seasonRatings[n]?.overall ?? 0;
                return (
                  <button key={n} type="button" className="chip" aria-pressed={season === n} onClick={() => setSeason(n)}>
                    Season {n} <small>{v > 0 ? v.toFixed(1) : '—'}</small>
                  </button>
                );
              })}
            </div>
            <AutoButton onClick={() => tf.autoSeason(season)}>Auto-calc season</AutoButton>
          </div>
          <div>
            <div className="ti-rate-row">
              <span className="ti-rate-label">Season {season} overall</span>
              <span className="ti-rate-val">{s.overall.toFixed(1)} / 5</span>
            </div>
            <PreciseSlider value={s.overall} label={`Season ${season} overall rating`} onChange={(v) => tf.setSeasonRating(season, 'overall', v)} />
          </div>
          <div className="ti-cats">
            {CATS.map(([key, label]) => (
              <TickRating key={`${season}${key}`} label={label} value={s[key]} onChange={(v) => tf.setSeasonRating(season, key, v)} />
            ))}
          </div>
        </>
      ) : (
        <div className="ti-cats">
          {CATS.map(([key, label]) => (
            <TickRating key={key} label={label} value={form.ratings[key]} onChange={(v) => tf.setCategory(key, v)} />
          ))}
        </div>
      )}
    </div>
  );
}
