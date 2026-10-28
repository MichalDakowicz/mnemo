import { Link } from 'react-router-dom';

import { Avatar } from '@/components/ui/Avatar';
import type { Profile } from '@/types/movie';

type Props = {
  term: string;
  results: Profile[];
  loading: boolean;
  friendIds: Set<string>;
  sentIds: Set<string>;
  onAdd: (id: string) => void;
  onClose: () => void;
};

export function FindResults({ term, results, loading, friendIds, sentIds, onAdd, onClose }: Props) {
  return (
    <section className="section" aria-label="Search results">
      <div className="head">
        <h2>Results for “{term}”</h2>
        <button type="button" className="text-button" onClick={onClose}>Clear</button>
      </div>
      {loading && results.length === 0 ? <p className="empty">Searching…</p> : null}
      {!loading && results.length === 0 ? <p className="empty">Nobody with that username.</p> : null}
      <div className="find-list">
        {results.map((profile) => {
          const name = profile.displayName || profile.username;
          const isFriend = friendIds.has(profile.id);
          const sent = sentIds.has(profile.id);
          return (
            <div className="req-row" key={profile.id}>
              <Avatar name={name} pfp={profile.pfp} size={44} />
              <Link className="req-who" to={`/u/${profile.id}`}>
                <span className="req-name">{name}</span>
                <span className="req-meta">@{profile.username}</span>
              </Link>
              {isFriend ? (
                <span className="req-meta">Friends</span>
              ) : (
                <button type="button" className="pill primary" disabled={sent} onClick={() => onAdd(profile.id)}>
                  {sent ? 'Request sent' : 'Add friend'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
