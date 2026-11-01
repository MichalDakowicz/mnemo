/** A 0-5 score as "4.5" (one decimal, trailing zero dropped); a dash when there is none. */
export function formatScore(score: number | null | undefined): string {
  if (score == null || !Number.isFinite(score) || score <= 0) return '-';
  return String(Math.round(score * 10) / 10);
}

/** "S2 E5" from a [season, episode] pair. */
export function episodeLabel(next: [number, number] | null): string | null {
  return next ? `S${next[0]} E${next[1]}` : null;
}
