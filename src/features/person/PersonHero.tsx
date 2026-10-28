import { ArrowUpRight } from 'lucide-react';
import { useState, type CSSProperties } from 'react';

import { hueFromTitle } from '@/lib/hue';
import type { libraryStats } from '@/lib/personCredits';
import { formatDate } from '@/lib/titleFacts';
import type { PersonProfile } from '@/lib/tmdbExtra';

type Props = {
  profile: PersonProfile;
  kicker: string;
  stats: ReturnType<typeof libraryStats>;
};

const SPOTS = ['39% 35%', '50% 33%', '61% 35%', '38% 50%', '62% 50%', '39% 65%', '50% 67%', '61% 65%'];

function Src({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="pe-src" href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <ArrowUpRight size={11} aria-hidden="true" />
    </a>
  );
}

export function PersonHero({ profile: p, kicker, stats }: Props) {
  const [open, setOpen] = useState(false);
  const hue = hueFromTitle(p.name);
  const glow = SPOTS.map((s, i) => `radial-gradient(circle 300px at ${s}, hsl(${(hue + i * 12) % 360} 55% ${i < 3 ? 52 : 38}%), transparent)`).join(', ');
  const born = formatDate(p.birthday);
  const longBio = p.biography.length > 280;
  const cells = [
    { label: 'In your library', value: String(stats.inLibrary), suffix: ` of ${stats.total}` },
    { label: 'Watched', value: String(stats.watched), suffix: '' },
    { label: 'Your average', value: stats.average ? stats.average.toFixed(1) : '—', suffix: stats.average ? ' /5' : '' },
  ];

  return (
    <section className="pe-hero" aria-label={p.name}>
      <div className="pe-glow" aria-hidden="true" style={{ background: glow }} />
      <div className={p.profileUrl ? 'pe-portrait' : 'pe-portrait art'} style={{ '--h': hue } as CSSProperties}>
        {p.profileUrl ? (
          <img src={p.profileUrl} alt={p.name} />
        ) : (
          <svg viewBox="0 0 100 110" fill="#ffffff" aria-hidden="true">
            <circle cx="50" cy="34" r="22" />
            <path d="M6 110c2-30 20-46 44-46s42 16 44 46z" />
          </svg>
        )}
      </div>
      <div className="pe-info">
        {kicker ? <p className="pe-kicker">{kicker}</p> : null}
        <h1 className="pe-name">{p.name}</h1>
        <p className="pe-srcs">
          <Src href={`https://www.themoviedb.org/person/${p.id}`}><strong>TMDB</strong></Src>
          {p.imdbId ? <Src href={`https://www.imdb.com/name/${p.imdbId}`}><strong>IMDb</strong></Src> : null}
        </p>
        {born || p.placeOfBirth ? (
          <p className="pe-born">
            {born ? <span>Born {born}</span> : null}
            {born && p.placeOfBirth ? <span aria-hidden="true">·</span> : null}
            {p.placeOfBirth ? <span>{p.placeOfBirth}</span> : null}
          </p>
        ) : null}
        {p.biography ? (
          <>
            <p className={`pe-bio${open ? ' open' : ''}`}>{p.biography}</p>
            {longBio ? (
              <button type="button" className="text-button pe-more" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
                {open ? 'Show less' : 'Read more'}
              </button>
            ) : null}
          </>
        ) : null}
        <div className="pe-stats">
          {cells.map((c) => (
            <div key={c.label}>
              <p>{c.label}</p>
              <strong>{c.value}</strong>
              <small>{c.suffix}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
