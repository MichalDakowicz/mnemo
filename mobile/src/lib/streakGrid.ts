// The 53-week activity grid on Stats: one column per Monday-anchored week, one row
// per day. Pure so the component only paints what this returns.

import { dateKey, weekStart } from '@/lib/stats';
import { thresholdForWeek, type ThresholdStep } from '@/lib/streakThresholds';

export type GridUnit = 'movie' | 'episode';
export type GridCell = {
  key: string;
  count: number;
  /** 0 = nothing, 3 = a busy day. */
  level: 0 | 1 | 2 | 3;
  /** A busy day inside a week that met its goal - drawn in the "good" colour. */
  goalMet: boolean;
  future: boolean;
};

export const GRID_WEEKS = 53;

/** Films are rarer than episodes, so a "busy" day starts lower. */
export function dayLevel(count: number, unit: GridUnit): 0 | 1 | 2 | 3 {
  if (count <= 0) return 0;
  const [mid, high] = unit === 'movie' ? [2, 3] : [3, 5];
  if (count >= high) return 3;
  if (count >= mid) return 2;
  return 1;
}

export type StreakGrid = {
  weeks: GridCell[][];
  firstLabel: string;
  lastLabel: string;
};

function monthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function buildStreakGrid(
  daily: Record<string, number>,
  opts: { threshold: number; steps?: ThresholdStep[]; unit: GridUnit; now?: Date; weeks?: number },
): StreakGrid {
  const now = opts.now ?? new Date();
  const total = opts.weeks ?? GRID_WEEKS;
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const thisWeek = weekStart(now);
  const weeks: GridCell[][] = [];

  for (let w = total - 1; w >= 0; w--) {
    const start = new Date(thisWeek);
    start.setDate(start.getDate() - w * 7);
    const goal = thresholdForWeek(dateKey(start), opts.threshold, opts.steps ?? []);
    const days: GridCell[] = [];
    let sum = 0;
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(date.getDate() + d);
      const key = dateKey(date);
      const count = daily[key] || 0;
      sum += count;
      days.push({ key, count, level: dayLevel(count, opts.unit), goalMet: false, future: date > todayStart });
    }
    const met = sum >= goal;
    weeks.push(days.map((c) => ({ ...c, goalMet: met && c.level === 3 })));
  }

  const first = new Date(thisWeek);
  first.setDate(first.getDate() - (total - 1) * 7);
  return { weeks, firstLabel: monthLabel(first), lastLabel: monthLabel(now) };
}
