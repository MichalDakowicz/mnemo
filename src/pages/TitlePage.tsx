import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

import '@/features/title/title.css';
import { TitleView } from '@/features/title/TitleView';
import type { MediaType } from '@/types/movie';

function useGoBack() {
  const navigate = useNavigate();
  return () => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/'));
}

// /title/<movie|tv>/<tmdbId>: composes the back button and the title view.
export function TitlePage() {
  const { type, id } = useParams();
  const goBack = useGoBack();
  const tmdbId = Number(id);
  const valid = (type === 'movie' || type === 'tv') && Number.isInteger(tmdbId) && tmdbId > 0;

  return (
    <>
      <button type="button" className="ti-back glass" onClick={goBack} aria-label="Back">
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      {valid ? (
        <TitleView key={`${type}:${tmdbId}`} type={type as MediaType} tmdbId={tmdbId} />
      ) : (
        <div className="ti-state">That is not a title Mnemo can open. <Link to="/">Back to library</Link></div>
      )}
    </>
  );
}
