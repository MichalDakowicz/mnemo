import { useState } from 'react';

import { CastPanel } from './CastPanel';
import { Collapse } from './Collapse';
import { ConfirmDialog } from './ConfirmDialog';
import { EpisodesPanel } from './EpisodesPanel';
import { FriendsPanel } from './FriendsPanel';
import { HeroActions } from './HeroActions';
import { NotesPanel } from './NotesPanel';
import { ProductionPanel } from './ProductionPanel';
import { RatingsStrip } from './RatingsStrip';
import { ReviewPanel } from './ReviewPanel';
import { SimilarRow } from './SimilarRow';
import { StreamingRail } from './StreamingRail';
import { TitleBackdrop } from './TitleBackdrop';
import { TitleHead } from './TitleHead';
import { useAddToLibrary } from './useAddToLibrary';
import { useEpisodeTracker } from './useEpisodeTracker';
import { useTitle } from './useTitle';
import { useTitleForm } from './useTitleForm';
import { useTitleFriends } from './useTitleFriends';
import { WatchesStrip } from './WatchesStrip';
import type { MediaType } from '@/types/movie';

type Props = { type: MediaType; tmdbId: number };

/** One TMDB title, owned or not: catalogue facts for everyone, your tracking once it is in the library. */
export function TitleView({ type, tmdbId }: Props) {
  const t = useTitle(type, tmdbId);
  const tf = useTitleForm(t.owned);
  const adder = useAddToLibrary();
  const { takes } = useTitleFriends(type, tmdbId);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const form = tf.form;
  const d = t.display;
  const seasonCount = form?.numberOfSeasons || d.numberOfSeasons || t.extras?.seasons.length || 1;
  const tracker = useEpisodeTracker(type === 'tv' ? tmdbId : null, seasonCount, form);

  if (t.loading) return <p className="ti-state" role="status">Loading…</p>;
  if (t.error) {
    return (
      <div className="ti-state" role="alert">
        Could not load this title.
        <div><button type="button" className="pill" onClick={t.refetch}>Try again</button></div>
      </div>
    );
  }

  const owned = !!t.owned && !!form;

  return (
    <div className="ti-body">
      {/* The backdrop comes with the extras; showing the poster first and swapping it made the art jump. */}
      <TitleBackdrop title={d.title} url={t.extras?.backdropUrl ?? d.coverUrl} pending={t.extrasLoading} />
      <StreamingRail availability={d.availability} logos={d.availabilityLogos} />
      <TitleHead type={type} tmdbId={tmdbId} d={d} date={type === 'tv' ? (t.extras?.firstAirDate ?? d.releaseDate) : d.releaseDate}>
        <HeroActions tmdbId={tmdbId} type={type} owned={owned} tf={tf} tracker={tracker} adder={adder} onRemove={() => setConfirmRemove(true)} />
        {owned && form ? <WatchesStrip form={form} tf={tf} /> : null}
        <RatingsStrip
          voteAverage={d.voteAverage}
          voteCount={d.voteCount}
          mine={owned && form ? form.overallRating : null}
          open={reviewOpen && owned}
          onToggle={() => setReviewOpen((o) => !o)}
          friends={takes}
          controls="review"
        />
        {owned && form ? (
          <Collapse open={reviewOpen}>
            <ReviewPanel id="review" form={form} title={d.title} tf={tf} />
          </Collapse>
        ) : null}
      </TitleHead>

      <div className="ti-grid">
        {type === 'tv' ? <EpisodesPanel tracker={tracker} seasonCount={seasonCount} seasons={t.extras?.seasons ?? []} tf={owned ? tf : null} /> : null}
        <CastPanel cast={d.cast} />
        <ProductionPanel type={type} display={d} extras={t.extras} />
        {owned && form ? (
          <div className={`ti-last${takes.length === 0 ? ' single' : ''}`}>
            <NotesPanel value={form.notes} onChange={(notes) => tf.update({ notes })} />
            <FriendsPanel takes={takes} />
          </div>
        ) : (
          <FriendsPanel takes={takes} />
        )}
        <SimilarRow type={type} items={t.similar} owned={t.ownedIds} />
      </div>

      <ConfirmDialog
        open={confirmRemove}
        title="Remove from library"
        description={`Remove "${d.title}"? Your rating, notes and watch history for it will be lost.`}
        confirmLabel="Remove"
        destructive
        onCancel={() => setConfirmRemove(false)}
        onConfirm={() => {
          setConfirmRemove(false);
          void tf.remove();
        }}
      />
    </div>
  );
}
