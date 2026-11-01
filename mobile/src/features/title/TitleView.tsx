import { useCallback, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { useScreenPadding } from '@/components/layout/Screen';
import { PAGE_GUTTER } from '@/theme/layout';
import { colors } from '@/theme/colors';
import type { MediaType } from '@/types/movie';

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
import { ScrollIntoViewContext } from './ScrollIntoView';
import { SimilarRow } from './SimilarRow';
import { StreamingRail } from './StreamingRail';
import { TitleBackdrop, HERO_HEIGHT } from './TitleBackdrop';
import { TitleHead } from './TitleHead';
import { TitleState } from './TitleState';
import { useAddToLibrary } from './useAddToLibrary';
import { useEpisodeTracker } from './useEpisodeTracker';
import { useTitle } from './useTitle';
import { useTitleForm } from './useTitleForm';
import { useTitleFriends } from './useTitleFriends';
import { WatchesStrip } from './WatchesStrip';

type Props = { type: MediaType; tmdbId: number };

// Where the title starts below the status bar, so it sits over the lower half of the art.
const HEAD_TOP = HERO_HEIGHT - 190;

/** One TMDB title, owned or not: catalogue facts for everyone, your tracking once it is in the library. */
export function TitleView({ type, tmdbId }: Props) {
  const t = useTitle(type, tmdbId);
  const tf = useTitleForm(t.owned);
  const adder = useAddToLibrary();
  const { takes } = useTitleFriends(type, tmdbId);
  const pad = useScreenPadding();
  const scroll = useRef<ScrollView>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const form = tf.form;
  const d = t.display;
  const seasonCount = form?.numberOfSeasons || d.numberOfSeasons || t.extras?.seasons.length || 1;
  const tracker = useEpisodeTracker(type === 'tv' ? tmdbId : null, seasonCount, form);

  // Brings a focused input clear of the keyboard once the avoiding view has made room.
  const scrollIntoView = useCallback((node: View | null) => {
    const sv = scroll.current;
    const inner = sv?.getInnerViewNode();
    if (!node || !sv || !inner) return;
    setTimeout(() => {
      node.measureLayout(inner as never, (_x, y) => sv.scrollTo({ y: Math.max(0, y - 96), animated: true }), () => {});
    }, 280);
  }, []);

  if (t.loading) return <TitleState kind="loading" />;
  if (t.error) return <TitleState kind="error" onRetry={t.refetch} />;

  const owned = !!t.owned && !!form;

  return (
    <ScrollIntoViewContext.Provider value={scrollIntoView}>
      <KeyboardAvoidingView behavior="padding" enabled={Platform.OS !== 'web'} style={styles.flex}>
        <ScrollView
          ref={scroll}
          style={styles.page}
          contentContainerStyle={{ paddingBottom: pad.paddingBottom }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag">
          {/* The backdrop comes with the extras; showing the poster first and swapping it made the art jump. */}
          <TitleBackdrop title={d.title} url={t.extras?.backdropUrl ?? d.coverUrl} pending={t.extrasLoading} />
          <View style={[styles.body, { paddingTop: pad.paddingTop + HEAD_TOP }]}>
            <TitleHead type={type} tmdbId={tmdbId} d={d} date={type === 'tv' ? (t.extras?.firstAirDate ?? d.releaseDate) : d.releaseDate}>
              <StreamingRail availability={d.availability} logos={d.availabilityLogos} />
              <HeroActions tmdbId={tmdbId} type={type} owned={owned} tf={tf} tracker={tracker} adder={adder} onRemove={() => setConfirmRemove(true)} />
              {owned && form ? <WatchesStrip form={form} tf={tf} /> : null}
              <RatingsStrip
                voteAverage={d.voteAverage}
                voteCount={d.voteCount}
                mine={owned && form ? form.overallRating : null}
                open={reviewOpen && owned}
                onToggle={() => setReviewOpen((o) => !o)}
                friends={takes}
              />
              {owned && form ? (
                <Collapse open={reviewOpen}>
                  <ReviewPanel form={form} title={d.title} tf={tf} />
                </Collapse>
              ) : null}
            </TitleHead>

            <View style={styles.sections}>
              {type === 'tv' ? <EpisodesPanel tracker={tracker} seasonCount={seasonCount} seasons={t.extras?.seasons ?? []} tf={owned ? tf : null} /> : null}
              <CastPanel cast={d.cast} />
              <ProductionPanel type={type} display={d} extras={t.extras} />
              {owned && form ? <NotesPanel value={form.notes} onChange={(notes) => tf.update({ notes })} /> : null}
              <FriendsPanel takes={takes} />
              <SimilarRow type={type} items={t.similar} owned={t.ownedIds} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
    </ScrollIntoViewContext.Provider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.ground },
  page: { flex: 1, backgroundColor: colors.ground },
  body: { paddingHorizontal: PAGE_GUTTER },
  sections: { marginTop: 32, gap: 32 },
});
