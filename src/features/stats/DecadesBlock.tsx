import { decadeHeight } from '@/lib/statsView';
import type { DecadeSlice } from '@/lib/stats';

export function DecadesBlock({ decades }: { decades: DecadeSlice[] }) {
  const max = Math.max(0, ...decades.map((d) => d.count));
  return (
    <section className="block stretch" aria-label="Release eras">
      <div className="block-head">
        <h2>Release eras</h2>
        <span>By decade</span>
      </div>
      {decades.length === 0 ? (
        <p className="stats-mix">No release dates on these titles yet.</p>
      ) : (
        <ul className="decades">
          {decades.map((d, i) => (
            <li key={d.decade}>
              <span className="n">{d.count}</span>
              <span className={i === decades.length - 1 ? 'bar now' : 'bar'} style={{ height: `${decadeHeight(d.count, max)}%` }} />
              <span>{d.decade}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
