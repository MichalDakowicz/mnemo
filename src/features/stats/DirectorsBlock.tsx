import { Link } from 'react-router-dom';

import { Avatar } from '@/components/ui/Avatar';
import { plural } from '@/lib/statsView';
import type { DirectorSlice } from '@/lib/stats';

type Props = { directors: DirectorSlice[]; averages: Map<string, number> };

export function DirectorsBlock({ directors, averages }: Props) {
  return (
    <section className="block" aria-label="Most watched directors">
      <div className="block-head">
        <h2>Most watched directors</h2>
      </div>
      {directors.length === 0 ? (
        <p className="stats-mix">No directors on these titles yet.</p>
      ) : (
        <ol className="people">
          {directors.map((d, i) => {
            const avg = averages.get(d.name);
            return (
              <li key={d.name}>
                <span className="rank-n">{i + 1}</span>
                <Avatar name={d.name} size={34} />
                {d.id != null ? <Link to={`/person/${d.id}`}>{d.name}</Link> : <span className="nm">{d.name}</span>}
                <span className="meta">
                  {plural(d.count, 'title')}
                  {avg ? ` · avg ★ ${avg.toFixed(1)}` : ''}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
