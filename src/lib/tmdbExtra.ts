// TMDB reads the shared lib/tmdb.ts does not cover: title extras (backdrop, crew,
// seasons, networks...) and a person's full credits. Read-only, same token.
import { mapCombinedCredits, type PersonCredit } from './personCredits';
import type { CrewCredit } from './titleFacts';
import type { MediaType } from '@/types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
  Accept: 'application/json',
};
const img = (size: string, path: string | null | undefined) => (path ? `https://image.tmdb.org/t/p/${size}${path}` : null);

export type SeasonInfo = { number: number; name: string; episodeCount: number; airDate: string | null };

export type TitleExtras = {
  backdropUrl: string | null;
  imdbId: string | null;
  tmdbStatus: string | null;
  firstAirDate: string | null;
  nextAirDate: string | null;
  languages: string[];
  countries: string[];
  networks: string[];
  seasons: SeasonInfo[];
  episodeRuntimes: number[];
  crew: CrewCredit[];
};

async function get(path: string): Promise<any | null> {
  const res = await fetch(`${BASE_URL}/${path}`, { headers });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}

export async function fetchTitleExtras(tmdbId: number, type: MediaType): Promise<TitleExtras | null> {
  const data = await get(`${type}/${tmdbId}?append_to_response=credits,aggregate_credits,external_ids`);
  if (!data) return null;
  const crewRaw: any[] = (type === 'tv' ? data.aggregate_credits?.crew : data.credits?.crew) ?? [];
  const crew: CrewCredit[] = crewRaw.map((c) => ({
    id: c.id,
    name: c.name,
    department: c.department ?? '',
    jobs: c.jobs ? c.jobs.map((j: any) => j.job) : c.job ? [c.job] : [],
  }));
  return {
    backdropUrl: img('w1280', data.backdrop_path),
    imdbId: data.external_ids?.imdb_id ?? data.imdb_id ?? null,
    tmdbStatus: data.status ?? null,
    firstAirDate: data.first_air_date ?? null,
    nextAirDate: data.next_episode_to_air?.air_date ?? null,
    languages: (data.spoken_languages ?? []).map((l: any) => l.english_name || l.name).filter(Boolean),
    countries: (data.production_countries ?? []).map((c: any) => c.name).filter(Boolean),
    networks: (data.networks ?? []).map((n: any) => n.name).filter(Boolean),
    seasons: (data.seasons ?? [])
      .filter((s: any) => s.season_number > 0)
      .map((s: any) => ({ number: s.season_number, name: s.name, episodeCount: s.episode_count ?? 0, airDate: s.air_date ?? null })),
    episodeRuntimes: data.episode_run_time ?? [],
    crew,
  };
}

export type PersonProfile = {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  placeOfBirth: string | null;
  profileUrl: string | null;
  knownForDepartment: string | null;
  imdbId: string | null;
};

export async function fetchPersonProfile(personId: number): Promise<PersonProfile | null> {
  const d = await get(`person/${personId}?append_to_response=external_ids`);
  if (!d) return null;
  return {
    id: d.id,
    name: d.name,
    biography: d.biography || '',
    birthday: d.birthday || null,
    placeOfBirth: d.place_of_birth || null,
    profileUrl: img('w500', d.profile_path),
    knownForDepartment: d.known_for_department || null,
    imdbId: d.external_ids?.imdb_id ?? d.imdb_id ?? null,
  };
}

export async function fetchPersonCredits(personId: number): Promise<PersonCredit[]> {
  return mapCombinedCredits(await get(`person/${personId}/combined_credits`));
}
