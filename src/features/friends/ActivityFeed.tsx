import { FEED_FILTERS, filterCountLabel, type FeedFilter, type ReactionKind } from '@/lib/socialFeed';
import type { Profile } from '@/types/movie';

import { ActivityItem } from './ActivityItem';
import { ActivitySocialBar } from './ActivitySocialBar';
import type { SocialMap } from './useActivitySocial';
import type { FeedEvent } from './useFriendActivity';

type Props = {
  events: FeedEvent[];
  authors: Map<string, Profile>;
  filter: FeedFilter;
  onFilter: (filter: FeedFilter) => void;
  loading: boolean;
  error: boolean;
  hasFriends: boolean;
  pending: number;
  onLoadPending: () => void;
  social: SocialMap;
  socialAvailable: boolean;
  onReact: (activityId: string, kind: ReactionKind) => void;
  onComment: (activityId: string, body: string) => Promise<void>;
};

export function ActivityFeed(props: Props) {
  const { events, authors, filter, loading, error, hasFriends, pending, social } = props;
  let empty = 'Nothing here yet. When friends finish or rate something, it shows up here.';
  if (!hasFriends) empty = 'Add friends to see what they are watching.';
  else if (filter !== 'all') empty = 'No activity of this kind yet.';

  return (
    <section className="feed" aria-label="Activity">
      <div className="head">
        <h2>Activity</h2>
        <span className="meta">{events.length > 0 ? filterCountLabel(events.length) : 'Latest from your friends'}</span>
      </div>
      <div className="feed-filters" role="group" aria-label="Filter activity">
        {FEED_FILTERS.map((item) => (
          <button
            key={item.key}
            type="button"
            className="chip"
            aria-pressed={filter === item.key}
            onClick={() => props.onFilter(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {pending > 0 ? (
        <button type="button" className="pill primary new-pill" onClick={props.onLoadPending}>
          {pending === 1 ? '1 new update' : `${pending} new updates`}
        </button>
      ) : null}
      {error ? <p className="empty">Could not load activity. Try again in a moment.</p> : null}
      {!error && loading && hasFriends ? <p className="empty">Loading activity…</p> : null}
      {!error && !loading && events.length === 0 ? <p className="empty">{empty}</p> : null}
      <ol className="feed-list">
        {events.map((event) => (
          <ActivityItem key={event.id} event={event} author={authors.get(event.userId)}>
            {props.socialAvailable ? (
              <ActivitySocialBar
                social={social[event.id]}
                onReact={(kind) => props.onReact(event.id, kind)}
                onComment={(body) => props.onComment(event.id, body)}
              />
            ) : null}
          </ActivityItem>
        ))}
      </ol>
    </section>
  );
}
