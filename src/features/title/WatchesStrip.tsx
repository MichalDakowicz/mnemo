import { ChevronDown, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

import type { EditForm } from '@/lib/editForm';
import { formDatedPasses } from '@/lib/editForm';
import { stepUndatedWatches } from '@/lib/watchCounts';

import { Collapse } from './Collapse';
import type { TitleForm } from './useTitleForm';

type Props = { form: EditForm; tf: TitleForm };

/** The count at the same size as the rest of the strip, with its minus and plus either side and no pill around it. */
function Counter({ value, label, onDec, onInc }: { value: number; label: string; onDec: () => void; onInc: () => void }) {
  return (
    <span className="ti-count" role="group" aria-label={label}>
      <button type="button" aria-label={`Decrease ${label}`} onClick={onDec}><Minus size={14} /></button>
      <strong className="ti-big">{value}</strong>
      <button type="button" aria-label={`Increase ${label}`} onClick={onInc}><Plus size={14} /></button>
    </span>
  );
}

/**
 * Radar's StatusPicker extras that the artboard has no place for, as a strip between the actions
 * and the ratings: how many times you watched it, watches you only remember (no date), and where
 * you stopped, which opens a drawer the way the rating does (docs/gaps/title.md).
 */
export function WatchesStrip({ form, tf }: Props) {
  const [open, setOpen] = useState(false);
  const s = form.status;
  const isTv = form.type === 'tv';
  const total = s.timesWatched || 0;
  const position = form.lastWatchedPosition.trim();

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
    <section className="ti-watches" aria-label="Your watches">
      <div className="ti-watch-cols">
        {s.watched ? (
          <div>
            <span className="ti-k">Watched</span>
            {isTv ? <strong className="ti-big">{total}×</strong> : <Counter value={total || 1} label="times watched" onDec={() => bumpTotal(-1)} onInc={() => bumpTotal(1)} />}
          </div>
        ) : null}
        <div title="No date. Counts towards your hours, never towards a streak">
          <span className="ti-k">Watched before (no date)</span>
          <Counter value={s.undatedWatches} label="undated watches" onDec={() => bumpUndated(-1)} onInc={() => bumpUndated(1)} />
        </div>
        {s.inProgress ? (
          <div className="grow">
            <button type="button" className="ti-rate-toggle ti-stop" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="stopped-at">
              <span className="ti-stop-head">
                <span className="ti-k">Stopped at</span>
                <ChevronDown size={14} className={`ti-chev${open ? ' open' : ''}`} aria-hidden="true" />
              </span>
              {position ? <strong className="ti-big mono">{position}</strong> : null}
            </button>
          </div>
        ) : null}
      </div>
      {s.inProgress ? (
        <Collapse open={open} id="stopped-at">
          <input
            className="ti-input"
            aria-label="Last watched position"
            value={form.lastWatchedPosition}
            onChange={(e) => tf.update({ lastWatchedPosition: e.target.value })}
            placeholder={isTv ? 'e.g. S02E05 at 23:15' : 'e.g. 45:30'}
          />
        </Collapse>
      ) : null}
    </section>
  );
}
