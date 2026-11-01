// Month-grid maths for the Discover calendars (Monday-first, as in the artboard).

export type MonthCursor = { year: number; month: number }; // month is 0-11

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
export const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const pad = (n: number) => String(n).padStart(2, '0');

export function monthPrefix({ year, month }: MonthCursor): string {
  return `${year}-${pad(month + 1)}`;
}

export function dayKey(cursor: MonthCursor, day: number): string {
  return `${monthPrefix(cursor)}-${pad(day)}`;
}

/** The month `offset` months after `from`, rolling the year. */
export function shiftMonth(from: MonthCursor, offset: number): MonthCursor {
  const total = from.year * 12 + from.month + offset;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
}

/** Whole months from `a` to `b`. */
export function monthsBetween(a: MonthCursor, b: MonthCursor): number {
  return (b.year - a.year) * 12 + (b.month - a.month);
}

/** Day numbers for the month, null for the blanks that pad it to full Monday-first weeks. */
export function monthCells(cursor: MonthCursor): (number | null)[] {
  const first = new Date(Date.UTC(cursor.year, cursor.month, 1));
  const days = new Date(Date.UTC(cursor.year, cursor.month + 1, 0)).getUTCDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < (first.getUTCDay() + 6) % 7; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return cells;
}

/** "Wednesday, 28 October" from a YYYY-MM-DD key. */
export function longDayLabel(key: string): string {
  const d = new Date(`${key}T00:00:00Z`);
  return `${WEEKDAY_NAMES[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTH_NAMES[d.getUTCMonth()]}`;
}

/**
 * The day the list under the grid opens on: the picked day if it still has
 * titles in this month, else the first upcoming day with titles, else the first
 * day with any.
 */
export function defaultDay(picked: string | null, dayKeys: string[], prefix: string, today: string): string | null {
  const inMonth = dayKeys.filter((k) => k.startsWith(prefix)).sort();
  if (picked && inMonth.includes(picked)) return picked;
  return inMonth.find((k) => k >= today) ?? inMonth[0] ?? null;
}
