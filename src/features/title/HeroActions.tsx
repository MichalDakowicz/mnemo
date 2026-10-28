import { Check, Plus, Trash2 } from 'lucide-react';

import { statusKeyOf } from '@/lib/titleStatus';
import type { MediaType } from '@/types/movie';

import { StatusMenu } from './StatusMenu';
import type { EpisodeTracker } from './useEpisodeTracker';
import type { useAddToLibrary } from './useAddToLibrary';
import type { TitleForm } from './useTitleForm';

type Props = {
  tmdbId: number;
  type: MediaType;
  owned: boolean;
  tf: TitleForm;
  tracker: EpisodeTracker;
  adder: ReturnType<typeof useAddToLibrary>;
  onRemove: () => void;
};

/** Primary action, status pill and remove: what changes with ownership and with film vs series. */
export function HeroActions({ tmdbId, type, owned, tf, tracker, adder, onRemove }: Props) {
  const form = tf.form;
  const busy = adder.pending === `${type}:${tmdbId}`;

  if (!owned || !form) {
    return (
      <div className="ti-actions">
        <button type="button" className="pill primary" disabled={busy} onClick={() => void adder.add(tmdbId, type)}>
          <Plus size={16} aria-hidden="true" />
          {busy ? 'Adding…' : 'Add to watchlist'}
        </button>
        {adder.error ? <span className="ti-save err" role="alert">{adder.error}</span> : null}
      </div>
    );
  }

  const isTv = form.type === 'tv';
  const watchAgain = () =>
    tf.commit((f) => ({ ...f, status: { ...f.status, timesWatched: (f.status.timesWatched || 1) + 1 } }));

  let primary: { label: string; run: () => void; disabled?: boolean };
  if (isTv) {
    primary = tracker.next
      ? { label: `Mark E${tracker.next} watched`, run: () => tf.toggleEpisode(tracker.season, tracker.next as number) }
      : { label: tracker.episodes.length ? 'Season complete' : 'Mark next episode', run: () => {}, disabled: true };
  } else {
    primary = form.status.watched
      ? { label: 'Log another watch', run: watchAgain }
      : { label: 'Mark watched', run: () => tf.setStatus('watched') };
  }

  return (
    <>
      <div className="ti-actions">
        <button type="button" className="pill primary" onClick={primary.run} disabled={primary.disabled}>
          <Check size={16} strokeWidth={2.2} aria-hidden="true" />
          {primary.label}
        </button>
        <StatusMenu value={statusKeyOf(form.status)} isTv={isTv} onPick={tf.setStatus} />
        <button type="button" className="text-button ti-small-btn" onClick={onRemove}>
          <Trash2 size={14} aria-hidden="true" />
          Remove
        </button>
      </div>
      <p className={`ti-save${tf.saveState === 'error' ? ' err' : ''}`} role="status" aria-live="polite">
        {tf.saveState === 'saving' ? 'Saving…' : null}
        {tf.saveState === 'saved' ? 'Saved' : null}
        {tf.saveState === 'error' ? (
          <>Could not save. <button type="button" className="text-button" onClick={tf.retrySave}>Retry</button></>
        ) : null}
      </p>
    </>
  );
}
