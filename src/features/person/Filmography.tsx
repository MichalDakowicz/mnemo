import type { CreditFilter, CreditSort, LibraryEntry, PersonCredit } from '@/lib/personCredits';
import { yearOf } from '@/lib/titleFacts';

import { CreditCard } from './CreditCard';
import type { usePerson } from './usePerson';

type P = ReturnType<typeof usePerson>;

const FILTERS: [CreditFilter, string][] = [['all', 'All'], ['in', 'In my library'], ['out', 'Not in library']];
const SORTS: [CreditSort, string][] = [['new', 'Newest'], ['old', 'Oldest'], ['rating', 'Your rating']];

function toItem(c: PersonCredit) {
  return { tmdbId: c.tmdbId, type: c.type, title: c.title, coverUrl: c.coverUrl, role: c.role, meta: yearOf(c.releaseDate) };
}

export function Filmography({ p }: { p: P }) {
  const empty = p.list.length === 0;
  const lib = (c: PersonCredit): LibraryEntry | undefined => p.library[c.key];

  return (
    <section aria-labelledby="h-credits">
      <div className="pe-bar">
        <div className="lead">
          <h2 id="h-credits" style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: '-.035em' }}>Filmography</h2>
          <div className="grp" role="group" aria-label="Department">
            {p.departments.map((d) => (
              <button key={d.name} type="button" className="chip" aria-pressed={p.department === d.name} onClick={() => p.setDept(d.name)}>
                {d.name} <small>{d.count}</small>
              </button>
            ))}
          </div>
        </div>
        <div className="grp">
          <div className="grp" role="group" aria-label="Show">
            {FILTERS.map(([k, label]) => (
              <button key={k} type="button" className="chip" aria-pressed={p.filter === k} onClick={() => p.setFilter(k)}>{label}</button>
            ))}
          </div>
          <div className="grp sort" role="group" aria-label="Sort">
            {SORTS.map(([k, label]) => (
              <button key={k} type="button" className="chip" aria-pressed={p.sort === k} onClick={() => p.setSort(k)}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="pe-grid">
        {p.list.map((c) => (
          <CreditCard
            key={`${c.key}|${c.department}`}
            item={toItem(c)}
            entry={lib(c)}
            adding={p.adder.pending === c.key}
            onAdd={() => void p.adder.add(c.tmdbId, c.type)}
          />
        ))}
      </div>
      {empty ? (
        <p className="pe-empty">
          {p.filter === 'in'
            ? 'None of these are in your library yet.'
            : p.filter === 'out'
              ? 'You already have all of these.'
              : 'TMDB lists no credits for this person.'}
        </p>
      ) : null}
      {p.adder.error ? <p className="pe-empty" role="alert">{p.adder.error}</p> : null}
    </section>
  );
}
