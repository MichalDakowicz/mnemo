import { FlatList, View } from 'react-native';

import { usePosterGrid } from '@/components/media/PosterGrid';
import { Screen, useScreenPadding } from '@/components/layout/Screen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pill } from '@/components/ui/Pill';
import type { PersonCredit } from '@/lib/personCredits';
import { yearOf } from '@/lib/titleFacts';
import { colors } from '@/theme/colors';

import { CreditCard } from './CreditCard';
import { FilmographyBar, FilmographyFoot } from './Filmography';
import { KnownForRow } from './KnownForRow';
import { PersonHero } from './PersonHero';
import { usePerson } from './usePerson';

export function PersonView({ personId }: { personId: number }) {
  const p = usePerson(personId);
  const pad = useScreenPadding();
  const { columns, cardWidth, gap } = usePosterGrid('normal');

  if (p.loading) return <Screen><EmptyState body="Loading…" /></Screen>;
  if (p.error || !p.profile) {
    return (
      <Screen>
        <EmptyState tone="warn" body="Could not load this person." />
        <View style={{ alignItems: "center" }}>
          <Pill label="Try again" onPress={p.refetch} />
        </View>
      </Screen>
    );
  }

  const kicker = p.departments
    .slice(0, 3)
    .map((d) => d.name)
    .join(' · ');
  const profile = p.profile;
  const toItem = (c: PersonCredit) => ({
    tmdbId: c.tmdbId,
    type: c.type,
    title: c.title,
    coverUrl: c.coverUrl,
    role: c.role,
    meta: yearOf(c.releaseDate),
  });

  return (
    <FlatList
      key={columns}
      style={{ flex: 1, backgroundColor: colors.ground }}
      contentContainerStyle={pad}
      showsVerticalScrollIndicator={false}
      data={p.list}
      numColumns={columns}
      columnWrapperStyle={columns > 1 ? { gap } : undefined}
      keyExtractor={(c) => `${c.key}|${c.department}`}
      initialNumToRender={16}
      windowSize={7}
      ListHeaderComponent={
        <>
          <PersonHero profile={profile} kicker={kicker || (profile.knownForDepartment ?? '')} stats={p.stats} />
          <KnownForRow items={p.known} library={p.library} />
          <FilmographyBar p={p} />
        </>
      }
      ListFooterComponent={<FilmographyFoot p={p} />}
      renderItem={({ item: c }) => (
        <View style={{ marginBottom: 18 }}>
        <CreditCard
          width={cardWidth}
          item={toItem(c)}
          entry={p.library[c.key]}
          adding={p.adder.pending === c.key}
          onAdd={() => void p.adder.add(c.tmdbId, c.type)}
        />
        </View>
      )}
    />
  );
}
