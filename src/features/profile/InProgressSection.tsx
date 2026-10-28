import { Link } from 'react-router-dom';

import { Poster } from '@/components/media/Poster';
import { useNextEpisode } from '@/hooks/useNextEpisode';
import { watchedEpisodeCount } from '@/lib/episodes';
import { watchProgressPercent } from '@/lib/movieStatus';
import { episodeLabel } from '@/lib/profileFormat';
import { titleMeta } from '@/lib/statsSummary';
import type { Movie } from '@/types/movie';

function Row({ m }: { m: Movie }) {
  const next = episodeLabel(useNextEpisode(m));
  const total = m.numberOfEpisodes ?? 0;
  const body = (
    <>
      <span className="thumb">
        <Poster title={m.title} coverUrl={m.coverUrl} />
      </span>
      <span className="grow">
        <span className="row-title">{m.title}</span>
        <span className="sub">{[titleMeta(m), next ? `Next ${next}` : null].filter(Boolean).join(' · ')}</span>
        <span className="bar" aria-hidden="true">
          <span style={{ width: `${watchProgressPercent(m)}%` }} />
        </span>
      </span>
      {m.type === 'tv' && total > 0 ? <span className="ep">{watchedEpisodeCount(m)}/{total}</span> : null}
    </>
  );
  return m.tmdbId != null ? (
    <Link className="row" to={`/title/${m.type}/${m.tmdbId}`}>
      {body}
    </Link>
  ) : (
    <div className="row">{body}</div>
  );
}

export function InProgressSection({ titles }: { titles: Movie[] }) {
  return (
    <section aria-labelledby="h-prog">
      <div className="sect-head" style={{ marginBottom: 8 }}>
        <h2 id="h-prog">In progress</h2>
        {titles.length > 0 ? <span className="note">{titles.length} underway</span> : null}
      </div>
      {titles.length === 0 ? <p className="note">Nothing underway right now.</p> : titles.map((m) => <Row key={m.id} m={m} />)}
    </section>
  );
}
