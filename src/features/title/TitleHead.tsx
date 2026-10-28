import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { formatDate, formatRuntime, yearOf } from '@/lib/titleFacts';
import type { MediaType } from '@/types/movie';

import { NameLinks, personTo } from './Facts';
import type { useTitle } from './useTitle';

type Display = ReturnType<typeof useTitle>['display'];

function Src({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="ti-src" href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <ArrowUpRight size={11} aria-hidden="true" />
    </a>
  );
}

/** Title, source links, byline and meta line. The actions and ratings follow it as children. */
export function TitleHead({ type, tmdbId, d, date, children }: { type: MediaType; tmdbId: number; d: Display; date: string | null; children: React.ReactNode }) {
  const isTv = type === 'tv';
  const meta: React.ReactNode[] = [];
  const year = yearOf(date ?? d.releaseDate);
  const full = formatDate(date ?? d.releaseDate);
  // The year opens into the full date on hover or focus: "2022" becomes "13 Sep 2022".
  if (year) {
    const lead = full && full.endsWith(year) ? full.slice(0, -year.length) : '';
    meta.push(
      <span key="date" className="ti-date" tabIndex={0}>
        <span className="lead" aria-hidden="true">{lead}</span>
        {year}
        {lead ? <span className="sr">{full}</span> : null}
      </span>,
    );
  }
  const runtime = type === 'movie' ? formatRuntime(d.runtime) : '';
  if (runtime) meta.push(runtime);
  if (d.genres.length > 0) {
    meta.push(
      <span key="g">
        {d.genres.map((g, i) => (
          <span key={g.id ?? g.name}>
            {i > 0 ? ' · ' : ''}
            {g.id ? <Link to={`/genre/${g.id}`}>{g.name}</Link> : g.name}
          </span>
        ))}
      </span>,
    );
  }
  if (isTv && d.numberOfSeasons) {
    meta.push(`${d.numberOfSeasons} season${d.numberOfSeasons === 1 ? '' : 's'}${d.numberOfEpisodes ? ` · ${d.numberOfEpisodes} episodes` : ''}`);
  }
  meta.push(isTv ? 'Series' : 'Film');

  return (
    <div className="ti-head">
      <h1>{d.title}</h1>
      {d.tagline ? <p className="ti-tagline">{d.tagline}</p> : null}
      <p className="ti-srcs">
        <Src href={`https://www.themoviedb.org/${type}/${tmdbId}`}>Matched on <strong>TMDB</strong></Src>
        {d.imdbId ? <Src href={`https://www.imdb.com/title/${d.imdbId}`}>On <strong>IMDb</strong></Src> : null}
      </p>
      {d.director.length > 0 ? (
        <p className="ti-by">{isTv ? 'Created by' : 'Directed by'} <NameLinks items={d.director} to={personTo} /></p>
      ) : null}
      <p className="ti-meta">
        {meta.map((m, i) => (
          <span key={i}>{i > 0 ? <span aria-hidden="true">· </span> : null}{m}</span>
        ))}
      </p>
      {d.overview ? <p className="ti-overview">{d.overview}</p> : null}
      {children}
    </div>
  );
}
