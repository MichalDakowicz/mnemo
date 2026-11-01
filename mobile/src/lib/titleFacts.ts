// Pure helpers for the title page's facts panels (Details / Production).
import type { NamedRef } from '@/types/movie';

export type CrewCredit = { id: number; name: string; jobs: string[]; department: string };

/** People credited with any of `jobs`, in the order TMDB lists them, de-duplicated. */
export function pickCrew(crew: CrewCredit[], jobs: string[]): NamedRef[] {
  const wanted = new Set(jobs.map((j) => j.toLowerCase()));
  const seen = new Set<number>();
  const out: NamedRef[] = [];
  for (const c of crew) {
    if (seen.has(c.id) || !c.jobs.some((j) => wanted.has(j.toLowerCase()))) continue;
    seen.add(c.id);
    out.push({ id: c.id, name: c.name });
  }
  return out;
}

/** "14 Sep 2025" from an ISO date; null for anything unparseable. */
export function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  if (Number.isNaN(d.getTime())) return null;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/** 128 -> "2h 8m", 46 -> "46m", 0 -> null. */
export function formatRuntime(minutes: number | null | undefined): string | null {
  if (!minutes || minutes <= 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** 165_000_000 -> "$165M", 2_500_000 -> "$2.5M", 0 -> null. */
export function formatMoney(amount: number | null | undefined): string | null {
  if (!amount || amount <= 0) return null;
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  return `$${Math.round(amount / 1000)}K`;
}

/** The first `n` names joined, and what is left over ("3 more" past two). */
export function splitNames(names: string[], n = 2): { head: string; tail: string } {
  const head = names.slice(0, n).join(', ');
  const rest = names.slice(n);
  const tail = rest.length === 0 ? '' : rest.length <= 2 ? rest.join(', ') : `${rest.length} more`;
  return { head, tail };
}

/** Years only: "2025". */
export function yearOf(iso: string | null | undefined): string {
  return iso ? iso.slice(0, 4) : '';
}
