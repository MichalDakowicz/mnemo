import type { QuickStat } from './useStatsPage';

export function QuickStats({ items }: { items: QuickStat[] }) {
  return (
    <section className="quick" aria-label="Overview">
      {items.map((q) => (
        <div key={q.label}>
          <p className="quick-label">{q.label}</p>
          <p className="quick-value">{q.value}</p>
          {q.note ? <p className={q.good ? 'quick-note good' : 'quick-note'}>{q.note}</p> : null}
        </div>
      ))}
    </section>
  );
}
