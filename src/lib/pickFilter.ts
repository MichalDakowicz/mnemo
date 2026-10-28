import type { Movie } from '@/types/movie';

/** Keeps the pickable titles whose name or director contains every word of `query` (case and accents ignored). */
export function filterPickables<T extends { movie: Pick<Movie, 'title' | 'director'> }>(items: T[], query: string): T[] {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return items;
  return items.filter(({ movie }) => {
    const text = fold(`${movie.title} ${movie.director.map((d) => d.name).join(' ')}`);
    return words.every((w) => text.includes(w));
  });
}

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
