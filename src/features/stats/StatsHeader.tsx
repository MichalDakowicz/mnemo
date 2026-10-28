import type { PeriodKey, PeriodOption } from '@/lib/statsView';

type Props = {
  sub: string;
  options: PeriodOption[];
  period: PeriodKey;
  onPeriod: (key: PeriodKey) => void;
};

export function StatsHeader({ sub, options, period, onPeriod }: Props) {
  return (
    <div className="page-head" style={{ marginBottom: 36 }}>
      <div>
        <h1 className="page-title">Stats</h1>
        <p className="stats-sub">{sub}</p>
      </div>
      <div className="stats-periods" role="group" aria-label="Period">
        {options.map((o) => (
          <button key={o.key} type="button" className="chip" aria-pressed={period === o.key} onClick={() => onPeriod(o.key)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
