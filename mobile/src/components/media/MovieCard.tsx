import { Bookmark, Check, Play, RotateCcw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ActionSheet } from '@/components/ui/ActionSheet';
import { Text } from '@/components/ui/Text';
import { cardMeta, cardStatus, cardSubtitleLine, kindTag, STATUS_LABEL, userRating } from '@/lib/cardInfo';
import { watchProgressPercent } from '@/lib/movieStatus';
import { QUICK_STATUS_LABEL, quickStatusOptions, type QuickStatus } from '@/lib/quickStatus';
import { colors } from '@/theme/colors';
import type { Movie } from '@/types/movie';

import { PosterCover } from './Poster';

type Props = {
  movie: Movie;
  /** 'poster' = grid tile (give it `width`), 'row' = list line. */
  variant?: 'poster' | 'row';
  width?: number;
  /** Long-press opens a status sheet when given. */
  onQuickStatus?: (movie: Movie, target: QuickStatus) => void;
  highlighted?: boolean;
};

/** /title/<movie|tv>/<tmdbId>, or null for a manually added title that has no TMDB id. */
export function titleHref(movie: Pick<Movie, 'type' | 'tmdbId'>): string | null {
  return movie.tmdbId ? `/title/${movie.type === 'tv' ? 'tv' : 'movie'}/${movie.tmdbId}` : null;
}

function StatusBadge({ movie, size }: { movie: Movie; size: number }) {
  const status = cardStatus(movie);
  const icon = size * 0.52;
  const glyph =
    status === 'completed' ? <Check size={icon} strokeWidth={3} color={colors.good} />
    : status === 'watching' ? <Play size={icon} strokeWidth={2.6} color={colors.text} fill={colors.text} />
    : status === 'rewatch' ? <RotateCcw size={icon} strokeWidth={2.4} color={colors.text} />
    : <Bookmark size={icon} strokeWidth={2.6} color={colors.text} />;
  return (
    <View accessibilityLabel={STATUS_LABEL[status]} style={[styles.badge, { width: size, height: size, borderRadius: size / 2 }]}>
      {glyph}
    </View>
  );
}

/** Matro card: 2:3 cover, status badge, progress hairline, title and meta below. Smaller type for small posters. */
export function MovieCard({ movie, variant = 'poster', width, onQuickStatus, highlighted }: Props) {
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const href = titleHref(movie);
  const status = cardStatus(movie);
  const pct = status === 'watching' ? watchProgressPercent(movie) : 0;
  const compact = (width ?? 100) < 90;
  const open = href ? () => router.push(href) : undefined;
  const longPress = onQuickStatus ? () => setMenu(true) : undefined;

  const sheet = onQuickStatus ? (
    <ActionSheet
      open={menu}
      onClose={() => setMenu(false)}
      title={movie.title}
      options={quickStatusOptions(movie).map((opt) => ({ key: opt, label: QUICK_STATUS_LABEL[opt], onPress: () => onQuickStatus(movie, opt) }))}
    />
  ) : null;

  if (variant === 'row') {
    const rating = userRating(movie);
    return (
      <Pressable accessibilityRole="button" accessibilityLabel={movie.title} onPress={open} onLongPress={longPress} style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.wash }]}>
        <View style={{ width: 40 }}>
          <PosterCover title={movie.title} coverUrl={movie.coverUrl}>
            {pct > 0 ? <ProgressBar pct={pct} /> : null}
          </PosterCover>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '600' }}>{movie.title}</Text>
          <Text numberOfLines={1} style={styles.meta}>{cardSubtitleLine(movie) || ' '}</Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 2 }}>
          {rating ? <Text mono style={{ fontSize: 12 }}>★ {Number.isInteger(rating) ? rating : rating.toFixed(1)}</Text> : null}
          <Text style={{ fontSize: 11, color: colors.dim }}>{STATUS_LABEL[status]}</Text>
        </View>
        {sheet}
      </Pressable>
    );
  }

  return (
    <View style={[{ width: width ?? '100%' }, highlighted && styles.highlight]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={movie.title}
        onPress={open}
        onLongPress={longPress}
        style={({ pressed }) => [pressed && { transform: [{ scale: 0.97 }] }]}>
        <PosterCover title={movie.title} coverUrl={movie.coverUrl} style={styles.cardCover}>
          <Text style={[styles.kind, compact && { fontSize: 7, top: 5, left: 5, paddingHorizontal: 4, paddingVertical: 2 }]}>{kindTag(movie)}</Text>
          <View style={[styles.badgePos, compact && { top: 4, right: 4 }]}><StatusBadge movie={movie} size={compact ? 16 : 20} /></View>
          {pct > 0 ? <ProgressBar pct={pct} /> : null}
        </PosterCover>
        <Text numberOfLines={1} style={[styles.title, compact && { fontSize: 11.5, marginTop: 7 }]}>{movie.title}</Text>
        <Text numberOfLines={1} style={[styles.meta, compact && { fontSize: 10.5 }]}>{cardMeta(movie)}</Text>
      </Pressable>
      {sheet}
    </View>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <View accessibilityLabel={`${pct}% watched`} style={styles.progress}>
      <View style={{ width: `${pct}%`, height: '100%', backgroundColor: colors.primary }} />
    </View>
  );
}

const styles = StyleSheet.create({
  cardCover: { boxShadow: '0 10px 22px #0007, 0 0 0 1px #ffffff0d' },
  kind: { position: 'absolute', top: 8, left: 8, fontSize: 8, fontWeight: '600', letterSpacing: 0.7, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, backgroundColor: '#0006', color: '#fff', overflow: 'hidden' },
  badgePos: { position: 'absolute', top: 6, right: 6 },
  badge: { backgroundColor: '#0a0a0b99', alignItems: 'center', justifyContent: 'center' },
  progress: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, backgroundColor: '#ffffff38' },
  title: { marginTop: 9, fontSize: 12.5, fontWeight: '600' },
  meta: { marginTop: 2, fontSize: 11, color: colors.dim },
  highlight: { borderRadius: 8, boxShadow: `0 0 0 2px ${colors.primary}` },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 7, paddingHorizontal: 10, borderRadius: 12 },
});
