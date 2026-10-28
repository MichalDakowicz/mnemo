import { Link } from 'react-router-dom';

import { useAuth } from '@/features/auth/AuthProvider';

import { useShelfLink } from './useShelfLink';
import { VisibilityChips } from './VisibilityChips';

/** "Your shelf": who may open it, and the link to share. */
export function ShelfPanel() {
  const { user } = useAuth();
  const { url, copied, copy } = useShelfLink(user?.id);
  return (
    <section className="panel shelf-panel" aria-label="Your shelf">
      <div className="head">
        <h2>Your shelf</h2>
        {user ? <Link className="text-button" to={`/u/${user.id}`}>Preview</Link> : null}
      </div>
      <p className="lead">Your library, ratings and stats as a read-only page. Choose who can open it.</p>
      <VisibilityChips />
      <div className="link-row">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
        </svg>
        <span className="link-url">{url.replace(/^https?:\/\//, '')}</span>
        <button type="button" className="pill" onClick={() => void copy()}>{copied ? 'Copied' : 'Copy link'}</button>
      </div>
    </section>
  );
}
