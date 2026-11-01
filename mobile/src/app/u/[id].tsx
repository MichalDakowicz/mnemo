import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Panel } from '@/components/ui/Panel';
import { Chip } from '@/components/ui/Chip';
import { SectionHead } from '@/components/ui/SectionHead';
import { Text } from '@/components/ui/Text';
import { ComparePanel } from '@/features/shelf/ComparePanel';
import { PosterRail, type RailItem } from '@/features/shelf/PosterRail';
import { ShelfHeader } from '@/features/shelf/ShelfHeader';
import { ShelfLibrary } from '@/features/shelf/ShelfLibrary';
import { useShelfPage } from '@/features/shelf/useShelfPage';
import { sharedCountLabel } from '@/lib/sharedWatchlist';
import { colors } from '@/theme/colors';
import type { Movie } from '@/types/movie';

const rail = (m: Movie): RailItem => ({ key: m.id, title: m.title, coverUrl: m.coverUrl, tmdbId: m.tmdbId, type: m.type });

export default function ShelfScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const shelf = useShelfPage(id);
  const { profile } = shelf;

  if (shelf.loading) {
    return <Screen><EmptyState body="Loading shelf…" /></Screen>;
  }
  if (!profile) {
    return (
      <Screen>
        <EmptyState body="We could not find that person." />
        <Pressable accessibilityRole="link" onPress={() => router.replace('/friends')} style={styles.back}>
          <Text style={styles.backText}>Back to friends</Text>
        </Pressable>
      </Screen>
    );
  }

  const header = (
    <ShelfHeader
      profile={profile}
      stats={shelf.canView ? shelf.stats : null}
      relation={shelf.relation}
      busy={shelf.busy}
      onAdd={() => void shelf.addFriend()}
      onAccept={() => void shelf.accept()}
      onRemove={() => void shelf.removeFriend()}
    />
  );

  if (shelf.canView === false) {
    return (
      <Screen>
        {header}
        <Panel style={styles.private}>
          <Text tracking={-0.035} style={styles.privateTitle}>This shelf is private</Text>
          <Text style={styles.privateBody}>{profile.displayName || profile.username} has not shared their library with you.</Text>
        </Panel>
      </Screen>
    );
  }

  const shared: RailItem[] = shelf.shared.map((s) => ({
    key: s.key, title: s.title, coverUrl: s.coverUrl, tmdbId: s.tmdbId, type: s.type, caption: s.services.slice(0, 2).join(' · ') || undefined,
  }));

  return (
    <Screen>
      {header}
      {shelf.notice ? <Text accessibilityRole="alert" style={styles.notice}>{shelf.notice}</Text> : null}
      {shelf.error ? <Text accessibilityRole="alert" style={styles.notice}>Could not load this library.</Text> : null}
      <PosterRail title="Favourites" items={profile.favorites.map((f) => ({ key: `${f.type}:${f.tmdbId}`, ...f }))} />
      <PosterRail title="Watching now" items={shelf.inProgress.map(rail)} />
      <PosterRail title="Recently finished" items={shelf.recent.map(rail)} />
      {shelf.comparison ? <ComparePanel comparison={shelf.comparison} headline={shelf.headline} subtitle={shelf.subtitle} /> : null}
      {shared.length > 0 || shelf.comparison ? <PosterRail title="Watch together" meta={sharedCountLabel(shared.length)} items={shared} /> : null}
      {shelf.theirs.length === 0 ? <EmptyState body="Nothing on this shelf yet." /> : <View style={styles.section}><ShelfLibrary movies={shelf.theirs} /></View>}
      {shelf.theirFriends.length > 0 ? (
        <View style={styles.section} accessibilityLabel="Friends">
          <SectionHead title="Friends" meta={String(shelf.theirFriends.length)} />
          <View style={styles.chips}>
            {shelf.theirFriends.map((f) => (
              <Chip key={f.id} label={f.displayName || f.username} onPress={() => router.push(`/u/${f.id}`)} />
            ))}
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 32 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  back: { alignSelf: 'center' },
  backText: { fontSize: 13, color: colors.muted },
  private: { marginTop: 24, alignItems: 'center', paddingVertical: 28 },
  privateTitle: { fontSize: 20, fontWeight: '600', textAlign: 'center' },
  privateBody: { fontSize: 13, color: colors.dim, textAlign: 'center' },
  notice: {
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.warn + '66',
    color: colors.warn,
    fontSize: 13,
  },
});
