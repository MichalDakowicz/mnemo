import { Link } from 'react-router-dom';

import { Art } from '@/components/media/Art';
import { Avatar } from '@/components/ui/Avatar';
import { commonLabel, digestStat, type FriendDigest } from '@/lib/friendDigest';
import type { Profile } from '@/types/movie';

export function FriendCard({ profile, digest }: { profile: Profile; digest: FriendDigest | undefined }) {
  const name = profile.displayName || profile.username;
  return (
    <Link className="friend" to={`/u/${profile.id}`}>
      <span className="friend-top">
        <Avatar name={name} pfp={profile.pfp} size={48} />
        <span className="friend-id">
          <span className="friend-name">{name}</span>
          <span className="friend-handle">@{profile.username}</span>
        </span>
      </span>
      <span className="friend-minis">
        {digest?.minis.map((mini) => (
          <span className="mini" key={mini.title}>
            {mini.coverUrl ? <img src={mini.coverUrl} alt="" loading="lazy" /> : <Art title={mini.title} showTitle={false} />}
          </span>
        ))}
        {digest ? <span className="friend-common">{commonLabel(digest.common)}</span> : null}
      </span>
      <span className="friend-foot">
        <span>{digest ? digestStat(digest) : 'Nothing shared yet'}</span>
        <span>Open shelf →</span>
      </span>
    </Link>
  );
}
