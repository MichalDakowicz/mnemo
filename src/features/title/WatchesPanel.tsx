import { Minus, Plus } from 'lucide-react';

import type { EditForm } from '@/lib/editForm';
import { formDatedPasses } from '@/lib/editForm';
import { stepUndatedWatches } from '@/lib/watchCounts';

import type { TitleForm } from './useTitleForm';

type Props = { form: EditForm; tf: TitleForm };

function Stepper({ value, label, onDec, onInc }: { value: number; label: string; onDec: () => void; onInc: () => void }) {
  return (
    <span className="ti-step" role="group" aria-label={label}>
      <button type="button" aria-label={`Decrease ${label}`} onClick={onDec}><Minus size={12} /></button>
      <span>{value}</span>
      <button type="button" aria-label={`Increase ${label}`} onClick={onInc}><Plus size={12} /></button>
    </span>
  );
}

/**
 * Radar's StatusPicker extras that the artboard has no place for: how many times you watched
 * it, watches you only remember (no date), and where you stopped. Minimal, built from the
 * same tokens (docs/gaps/title.md).
 */
export function WatchesPanel({ form, tf }: Props) {
  const s = form.status;
  const isTv = form.type === 'tv';
  const dated = formDatedPasses(form);
  const total = s.timesWatched || 0;

  const bumpTotal = (delta: number) =>
    tf.commit((f) => {
      const next = Math.max(1, (f.status.timesWatched || 0) + delta);
      const undated = delta < 0 ? f.status.undatedWatches + delta : f.status.undatedWatches;
      return { ...f, status: { ...f.status, timesWatched: next, undatedWatches: Math.max(0, Math.min(undated, next)) } };
    });
  const bumpUndated = (delta: 1 | -1) =>
    tf.commit((f) => {
      const step = stepUndatedWatches(f.status, delta, { datedPasses: formDatedPasses(f), derived: f.type === 'tv' });
      return { ...f, status: { ...f.status, watched: f.status.watched || step.undatedWatches > 0, ...step } };
    });

  return (
    <section className="panel" aria-label="Your watches">
      <div className="ti-panel-head"><h2>Your watches</h2></div>
      <div className="ti-watches">
        {s.watched ? (
          <div className="ti-watch-row">
            <div>
              <b>Times watched</b>
              <small>{isTv ? `${dated} dated from the episode tracker` : `${dated} dated`}</small>
            </div>
            {isTv ? <span className="mono">{total}×</span> : <Stepper value={total || 1} label="times watched" onDec={() => bumpTotal(-1)} onInc={() => bumpTotal(1)} />}
          </div>
        ) : null}
        <div className="ti-watch-row">
          <div>
            <b>Watched before, no date</b>
            <small>Counts towards your hours, never towards a streak</small>
          </div>
          <Stepper value={s.undatedWatches} label="undated watches" onDec={() => bumpUndated(-1)} onInc={() => bumpUndated(1)} />
        </div>
        {s.inProgress ? (
          <label>
            <span className="ti-rate-label">Last watched position</span>
            <input
              className="ti-input"
              value={form.lastWatchedPosition}
              onChange={(e) => tf.update({ lastWatchedPosition: e.target.value })}
              placeholder={isTv ? 'e.g. S02E05 at 23:15' : 'e.g. 45:30'}
            />
          </label>
        ) : null}
      </div>
    </section>
  );
}
