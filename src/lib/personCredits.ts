// Pure shaping of a person's TMDB credits for the person page.
export type PersonCredit = {
  key: string; // `${type}:${tmdbId}`
  tmdbId: number;
  type: 'movie' | 'tv';
  title: string;
  releaseDate: string | null;
  coverUrl: string | null;
  role: string;
  department: string;
  popularity: number;
};

export type LibraryEntry = { status: 'watched' | 'watching' | 'watchlist'; rating: number };
export type CreditFilter = 'all' | 'in' | 'out';
export type CreditSort = 'new' | 'old' | 'rating';

const IMG = 'https://image.tmdb.org/t/p/w500';
// Talk, News, Reality: a person's "Self" appearances bury the real filmography.
const NOISE_GENRES = new Set([10767, 10763, 10764]);

type Raw = Record<string, any>;

/** TMDB `combined_credits` -> one entry per (title, department), roles merged. */
export function mapCombinedCredits(raw: { cast?: Raw[]; crew?: Raw[] } | null): PersonCredit[] {
  const out = new Map<string, PersonCredit>();
  const add = (item: Raw, department: string, role: string) => {
    if (item.media_type !== 'movie' && item.media_type !== 'tv') return;
    const key = `${item.media_type}:${item.id}`;
    const slot = `${key}|${department}`;
    const existing = out.get(slot);
    if (existing) {
      if (role && !existing.role.split(' · ').includes(role)) existing.role += existing.role ? ` · ${role}` : role;
      return;
    }
    out.set(slot, {
      key,
      tmdbId: item.id,
      type: item.media_type,
      title: item.title || item.name || '',
      releaseDate: item.release_date || item.first_air_date || null,
      coverUrl: item.poster_path ? `${IMG}${item.poster_path}` : null,
      role,
      department,
      popularity: item.popularity || 0,
    });
  };

  for (const c of raw?.cast ?? []) {
    const self = !c.character || /^(self|himself|herself)\b/i.test(c.character);
    const noisy = (c.genre_ids ?? []).some((g: number) => NOISE_GENRES.has(g));
    if (self && noisy) continue;
    add(c, 'Acting', c.character ? `as ${c.character}` : '');
  }
  for (const c of raw?.crew ?? []) add(c, c.department || 'Crew', c.job || '');
  return [...out.values()].filter((c) => c.title);
}

/** Departments present; the person's known department first, then by size. */
export function departmentsOf(credits: PersonCredit[], known?: string | null): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const c of credits) counts.set(c.department, (counts.get(c.department) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => (b.name === known ? 1 : 0) - (a.name === known ? 1 : 0) || b.count - a.count);
}

/** Most popular distinct titles for the "Known for" row. */
export function knownFor(credits: PersonCredit[], n = 6): PersonCredit[] {
  const best = new Map<string, PersonCredit>();
  for (const c of credits) {
    const cur = best.get(c.key);
    if (!cur || c.popularity > cur.popularity) best.set(c.key, c);
  }
  return [...best.values()].sort((a, b) => b.popularity - a.popularity).slice(0, n);
}

export function filterSortCredits(
  credits: PersonCredit[],
  opts: { department: string | null; filter: CreditFilter; sort: CreditSort },
  library: Record<string, LibraryEntry>,
): PersonCredit[] {
  let list = credits.filter((c) => !opts.department || c.department === opts.department);
  if (opts.filter === 'in') list = list.filter((c) => library[c.key]);
  if (opts.filter === 'out') list = list.filter((c) => !library[c.key]);
  const date = (c: PersonCredit) => c.releaseDate ?? '';
  const rated = (c: PersonCredit) => library[c.key]?.rating ?? 0;
  const sorted = [...list];
  // Undated (announced) titles sit last either way: there is nothing to place them by.
  const undatedLast = (a: PersonCredit, b: PersonCredit) => (date(a) === '' ? 1 : 0) - (date(b) === '' ? 1 : 0);
  if (opts.sort === 'new') sorted.sort((a, b) => undatedLast(a, b) || date(b).localeCompare(date(a)));
  if (opts.sort === 'old') sorted.sort((a, b) => undatedLast(a, b) || date(a).localeCompare(date(b)));
  if (opts.sort === 'rating') sorted.sort((a, b) => rated(b) - rated(a) || date(b).localeCompare(date(a)));
  return sorted;
}

/** The three numbers under the bio: in library of all, watched, your average. */
export function libraryStats(credits: PersonCredit[], library: Record<string, LibraryEntry>) {
  const keys = [...new Set(credits.map((c) => c.key))];
  const inLib = keys.filter((k) => library[k]);
  const rated = inLib.filter((k) => library[k].rating > 0);
  return {
    total: keys.length,
    inLibrary: inLib.length,
    watched: inLib.filter((k) => library[k].status === 'watched').length,
    average: rated.length ? rated.reduce((a, k) => a + library[k].rating, 0) / rated.length : null,
  };
}
