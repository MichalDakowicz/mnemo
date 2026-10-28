import { Link } from 'react-router-dom';

import { Avatar } from '@/components/ui/Avatar';

import type { FriendTake } from './useTitleFriends';

export function FriendsPanel({ takes }: { takes: FriendTake[] }) {
  if (takes.length === 0) return null;
  return (
    <section className="panel" aria-label="Friends who have this">
      <div className="ti-panel-head tight">
        <h2>Friends</h2>
        <Link className="text-button" to="/friends">See all</Link>
      </div>
      <div className="ti-friends">
        {takes.map(({ profile, meta, rating }) => (
          <Link key={profile.id} className="ti-friend" to={`/u/${profile.id}`}>
            <Avatar name={profile.displayName || profile.username} pfp={profile.pfp} size={34} />
            <span className="t">
              <b>{profile.displayName || profile.username}</b>
              <span>{meta}</span>
            </span>
            <span className="v">{rating > 0 ? `★ ${rating.toFixed(1)}` : '—'}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
