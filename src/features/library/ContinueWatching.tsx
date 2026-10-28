import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';

import { Art } from '@/components/media/Art';
import { titleHref } from '@/components/media/MovieCard';
import { useNextEpisode } from '@/hooks/useNextEpisode';
import { watchedEpisodeCount } from '@/lib/episodes';
import { hueFromTitle } from '@/lib/hue';
import { watchProgressPercent } from '@/lib/movieStatus';
import type { Movie } from '@/types/movie';

function CwCard({ movie }: { movie: Movie }) {
  const href = titleHref(movie);
  const next = useNextEpisode(movie);
  const pct = watchProgressPercent(movie);
  const done = watchedEpisodeCount(movie);
  const meta = movie.type === 'tv' && movie.numberOfEpisodes ? `${done} / ${movie.numberOfEpisodes}` : '';
  const nextLine = next ? `Next · season ${next[0]}, episode ${next[1]}` : movie.type === 'tv' ? 'In progress' : 'Watching';
  const inner = (
    <>
      {movie.coverUrl ? <img className="cw-img" src={movie.coverUrl} alt="" loading="lazy" /> : <Art title={movie.title} showTitle={false} />}
      {next ? <span className="cw-code">S{next[0]} · E{next[1]}</span> : null}
      <span className="cw-go" aria-hidden="true"><Check size={18} strokeWidth={2.4} color="#fff" /></span>
      <span className="cw-body">
        <span className="cw-title">{movie.title}</span>
        <span className="cw-next">{nextLine}</span>
        <span className="cw-bar">
          <span className="cw-track"><span style={{ width: `${pct}%` }} /></span>
          {meta ? <span className="cw-meta mono">{meta}</span> : null}
        </span>
      </span>
    </>
  );
  const style = { '--h': hueFromTitle(movie.title) } as CSSProperties;
  return href ? <Link className="cw" to={href} style={style}>{inner}</Link> : <div className="cw" style={style}>{inner}</div>;
}

export function ContinueWatching({ movies }: { movies: Movie[] }) {
  if (movies.length === 0) return null;
  return (
    <section className="lib-section" aria-labelledby="lib-cw">
      <div className="lib-head"><h2 id="lib-cw">Continue watching</h2><span>{movies.length} in progress</span></div>
      <div className="cw-grid">{movies.map((m) => <CwCard key={m.id} movie={m} />)}</div>
    </section>
  );
}
