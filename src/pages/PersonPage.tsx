import { ChevronLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import '@/features/person/person.css';
import { PersonView } from '@/features/person/PersonView';

// /person/<tmdbId>: back button plus the person view.
export function PersonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const personId = Number(id);
  const back = () => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/'));

  return (
    <>
      <button type="button" className="pe-back glass" onClick={back} aria-label="Back">
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      {Number.isInteger(personId) && personId > 0 ? (
        <PersonView key={personId} personId={personId} />
      ) : (
        <div className="pe-state">That is not a person Mnemo can open. <Link to="/">Back to library</Link></div>
      )}
    </>
  );
}
