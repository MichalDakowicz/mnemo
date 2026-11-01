import { useRouter } from 'expo-router';
import { Fragment, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { formatDate, formatRuntime, yearOf } from '@/lib/titleFacts';
import { colors } from '@/theme/colors';
import type { MediaType } from '@/types/movie';

import { NameLinks, personTo } from './Facts';
import { TitleLinks } from './TitleLinks';
import type { useTitle } from './useTitle';

type Display = ReturnType<typeof useTitle>['display'];
type Props = { type: MediaType; tmdbId: number; d: Display; date: string | null; children: ReactNode };

const META_SIZE = 13;

/** Title, byline and meta line. The actions and ratings follow it as children. */
export function TitleHead({ type, tmdbId, d, date, children }: Props) {
  const router = useRouter();
  const [showFull, setShowFull] = useState(false);
  const isTv = type === 'tv';

  const year = yearOf(date ?? d.releaseDate);
  const full = formatDate(date ?? d.releaseDate);
  const runtime = type === 'movie' ? formatRuntime(d.runtime) : '';

  // The web opens the year into the full date on hover: here a tap does it.
  const parts: ReactNode[] = [];
  if (year) {
    parts.push(
      <Text
        key="date"
        accessibilityRole="button"
        accessibilityLabel={full ?? year}
        onPress={() => setShowFull((s) => !s)}
        style={styles.meta}>
        {showFull && full ? full : year}
      </Text>,
    );
  }
  if (runtime) parts.push(runtime);
  if (d.genres.length > 0) {
    parts.push(
      <Fragment key="genres">
        {d.genres.map((g, i) => (
          <Fragment key={g.id ?? g.name}>
            {i > 0 ? ' · ' : ''}
            {g.id ? (
              <Text accessibilityRole="link" onPress={() => router.push(`/genre/${g.id}`)} style={styles.meta}>
                {g.name}
              </Text>
            ) : (
              g.name
            )}
          </Fragment>
        ))}
      </Fragment>,
    );
  }
  if (isTv && d.numberOfSeasons) {
    parts.push(`${d.numberOfSeasons} season${d.numberOfSeasons === 1 ? '' : 's'}${d.numberOfEpisodes ? ` · ${d.numberOfEpisodes} episodes` : ''}`);
  }
  parts.push(isTv ? 'Series' : 'Film');

  return (
    <View>
      <Text accessibilityRole="header" tracking={-0.045} style={styles.title}>{d.title}</Text>
      {d.tagline ? <Text style={styles.tagline}>{d.tagline}</Text> : null}
      <TitleLinks type={type} tmdbId={tmdbId} imdbId={d.imdbId} />

      {d.director.length > 0 ? (
        <Text style={styles.by}>
          {isTv ? 'Created by ' : 'Directed by '}
          <NameLinks items={d.director} to={personTo} />
        </Text>
      ) : null}
      <Text style={styles.metaLine}>
        {parts.map((p, i) => (
          <Fragment key={i}>
            {i > 0 ? ' · ' : ''}
            {p}
          </Fragment>
        ))}
      </Text>
      {d.overview ? <Text style={styles.overview}>{d.overview}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 38, lineHeight: 40, fontWeight: '700', color: colors.textBright },
  tagline: { marginTop: 10, fontSize: 14, fontStyle: 'italic', color: colors.dim },
  by: { marginTop: 16, fontSize: 14, color: colors.dim },
  metaLine: { marginTop: 10, fontSize: META_SIZE, lineHeight: 20, color: colors.dim },
  meta: { fontSize: META_SIZE, color: colors.dim },
  overview: { marginTop: 18, fontSize: 14.5, lineHeight: 23, color: colors.soft },
});
