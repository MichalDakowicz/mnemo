import type { StreakGrid } from '@/lib/streakGrid';

type Props = {
  title: string;
  note: string;
  goal: string;
  aria: string;
  unit: string;
  grid: StreakGrid;
};

function cellClass(c: StreakGrid['weeks'][number][number]): string | undefined {
  if (c.future) return 'future';
  if (c.goalMet) return 'met';
  return c.level ? `l${c.level}` : undefined;
}

function cellTitle(c: StreakGrid['weeks'][number][number], unit: string): string | undefined {
  if (c.future || c.count === 0) return undefined;
  const day = new Date(`${c.key}T00:00:00`).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${c.count} ${c.count === 1 ? unit : `${unit}s`} · ${day}`;
}

// 53 Monday-anchored weeks, one column each; a busy day in a week that met its goal is drawn green.
export function StreakCalendar({ title, note, goal, aria, unit, grid }: Props) {
  return (
    <div className="block">
      <div className="block-head">
        <h2>{title}</h2>
        <span>{note}</span>
      </div>
      <div className="cal" role="img" aria-label={aria}>
        {grid.weeks.flat().map((c) => (
          <span key={c.key} className={cellClass(c)} title={cellTitle(c, unit)} />
        ))}
      </div>
      <div className="cal-foot">
        <span className="mono">{grid.firstLabel}</span>
        <span>{goal}</span>
        <span className="mono">{grid.lastLabel}</span>
      </div>
    </div>
  );
}
