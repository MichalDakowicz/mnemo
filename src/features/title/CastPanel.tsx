import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

import { hueFromTitle } from '@/lib/hue';
import type { CastMember } from '@/types/movie';

const Silhouette = () => (
  <svg viewBox="0 0 100 110" fill="#ffffff" aria-hidden="true">
    <circle cx="50" cy="34" r="22" />
    <path d="M6 110c2-30 20-46 44-46s42 16 44 46z" />
  </svg>
);

function Person({ p }: { p: CastMember }) {
  const body = (
    <>
      <span className={p.profileUrl ? 'ti-photo' : 'ti-photo art'} style={{ '--h': hueFromTitle(p.name) } as CSSProperties}>
        {p.profileUrl ? <img src={p.profileUrl} alt="" loading="lazy" /> : <Silhouette />}
      </span>
      <span className="n">{p.name}</span>
      {p.character ? <span className="r">{p.character}</span> : null}
    </>
  );
  return p.id ? (
    <Link className="ti-person" to={`/person/${p.id}`}>{body}</Link>
  ) : (
    <div className="ti-person">{body}</div>
  );
}

export function CastPanel({ cast }: { cast: CastMember[] }) {
  if (cast.length === 0) return null;
  return (
    <section className="panel" aria-labelledby="h-cast">
      <div className="ti-panel-head"><h2 id="h-cast">Cast</h2></div>
      <div className="ti-cast">
        {cast.map((p, i) => <Person key={`${p.id ?? p.name}-${i}`} p={p} />)}
      </div>
    </section>
  );
}
