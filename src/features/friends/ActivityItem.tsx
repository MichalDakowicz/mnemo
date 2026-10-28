import { Link } from 'react-router-dom';

import { Avatar } from '@/components/ui/Avatar';
import { formatScore, relativeTime } from '@/lib/socialFeed';
import type { Profile } from '@/types/movie';

import type { FeedEvent } from './useFriendActivity';

type Props = { event: FeedEvent; author: Profile | undefined; children?: React.ReactNode };

/** One row of the activity list: avatar, "who verb title", score, age. Social controls hang below as children. */
export function ActivityItem({ event, author, children }: Props) {
  const name = author?.displayName || author?.username || 'Someone';
  const href = event.tmdbId != null && event.mediaType ? `/title/${event.mediaType}/${event.tmdbId}` : null;
  return (
    <li className="feed-item">
      <div className="feed-row">
        <Avatar name={name} pfp={author?.pfp} size={30} />
        <span className="feed-text">
          <Link to={`/u/${event.userId}`}><strong>{name}</strong></Link> {event.verb}{' '}
          {href ? (
            <Link className="feed-title" to={href}>{event.movieTitle}</Link>
          ) : (
            <strong>{event.movieTitle}</strong>
          )}
        </span>
        <span className="feed-rating">{event.rating != null ? `★ ${formatScore(event.rating)}` : ''}</span>
        <time className="feed-when" dateTime={event.createdAt}>{relativeTime(event.createdAt)}</time>
      </div>
      {children}
    </li>
  );
}
