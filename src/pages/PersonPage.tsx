import { Link, useParams } from 'react-router-dom';

import '@/features/person/person.css';
import { PersonView } from '@/features/person/PersonView';

// /person/<tmdbId>: the person view; the back button lives in the dock (components/layout/BackButton).
export function PersonPage() {
  const { id } = useParams();
  const personId = Number(id);

  return (
    <>
      {Number.isInteger(personId) && personId > 0 ? (
        <PersonView key={personId} personId={personId} />
      ) : (
        <div className="pe-state">That is not a person Mnemo can open. <Link to="/">Back to library</Link></div>
      )}
    </>
  );
}
