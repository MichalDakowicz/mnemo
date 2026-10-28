import { plural, statusLabel } from '@/lib/statsView';
import type { StatusSlice } from '@/lib/stats';

type Props = { rows: StatusSlice[]; total: number; mix: string };

export function StatusBlock({ rows, total, mix }: Props) {
  return (
    <section className="block" aria-label="Library by status">
      <div className="block-head">
        <h2>Library by status</h2>
        <span>{plural(total, 'title')}</span>
      </div>
      <div className="status-bar" aria-hidden="true">
        {rows.map((s) => (
          <span key={s.name} className={`st-${s.name === 'Completed' ? 'watched' : s.name.toLowerCase()}`} style={{ flex: `${s.count} 1 0` }} />
        ))}
      </div>
      <ul className="status-list">
        {rows.map((s) => (
          <li key={s.name}>
            <span className={`swatch st-${s.name === 'Completed' ? 'watched' : s.name.toLowerCase()}`} />
            <span>{statusLabel(s.name)}</span>
            <span>{s.count}</span>
          </li>
        ))}
      </ul>
      <p className="stats-mix">{mix}</p>
    </section>
  );
}
