import { barPercent } from '@/lib/statsSummary';
import type { GenreSlice } from '@/lib/stats';

export function GenresBlock({ genres }: { genres: GenreSlice[] }) {
  const top = genres.slice(0, 6);
  const max = top[0]?.count ?? 0;
  return (
    <section className="block tall" aria-label="Favourite genres">
      <div className="block-head">
        <h2>Favourite genres</h2>
        <span>By titles watched</span>
      </div>
      {top.length === 0 ? (
        <p className="stats-mix">No genres on these titles yet.</p>
      ) : (
        <ul className="bars">
          {top.map((g) => (
            <li key={g.name}>
              <span>{g.name}</span>
              <span className="track">
                <span style={{ width: `${barPercent(g.count, max, 4)}%` }} />
              </span>
              <span>{g.count}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
