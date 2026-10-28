import { Link, useParams } from 'react-router-dom';

import '@/features/title/title.css';
import { TitleView } from '@/features/title/TitleView';
import type { MediaType } from '@/types/movie';

// /title/<movie|tv>/<tmdbId>: the back button lives in the dock (components/layout/BackButton).
export function TitlePage() {
  const { type, id } = useParams();
  const tmdbId = Number(id);
  const valid = (type === 'movie' || type === 'tv') && Number.isInteger(tmdbId) && tmdbId > 0;

  return (
    <>
      {valid ? (
        <TitleView key={`${type}:${tmdbId}`} type={type as MediaType} tmdbId={tmdbId} />
      ) : (
        <div className="ti-state">That is not a title Mnemo can open. <Link to="/">Back to library</Link></div>
      )}
    </>
  );
}
