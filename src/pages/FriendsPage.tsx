import '@/features/friends/friends.css';

import { ActivityFeed } from '@/features/friends/ActivityFeed';
import { FindResults } from '@/features/friends/FindResults';
import { FriendCard } from '@/features/friends/FriendCard';
import { RequestRow } from '@/features/friends/RequestRow';
import { ShelfPanel } from '@/features/friends/ShelfPanel';
import { useFriendsPage } from '@/features/friends/useFriendsPage';

export function FriendsPage() {
  const page = useFriendsPage();
  const { friends, requests, feed } = page;
  const sub = page.loading
    ? 'Loading…'
    : `${friends.length} ${friends.length === 1 ? 'friend' : 'friends'} · ${requests.length} waiting`;

  return (
    <div className="friends-page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Friends</h1>
          <p className="page-sub">{sub}</p>
        </div>
        <label className="search-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M20 20l-4-4" />
          </svg>
          <span className="sr">Find people by username</span>
          <input type="text" placeholder="Find people by username" value={page.term} onChange={(e) => page.setTerm(e.target.value)} />
        </label>
      </div>

      {page.notice ? <p className="notice" role="alert">{page.notice}</p> : null}
      {page.loadError ? <p className="notice" role="alert">Could not load your friends: {page.loadError}</p> : null}

      {page.searching ? (
        <FindResults
          term={page.searchTerm}
          results={page.results}
          loading={page.searchLoading}
          friendIds={page.friendIdSet}
          sentIds={page.sentIds}
          onAdd={(id) => void page.sendRequest(id)}
          onClose={() => page.setTerm('')}
        />
      ) : null}

      {requests.length > 0 ? (
        <section className="section req" aria-label="Friend requests">
          <div className="head"><h2>Requests</h2><span className="meta">{requests.length} waiting</span></div>
          <div className="req-list">
            {requests.map((r) => (
              <RequestRow
                key={r.profile.id}
                profile={r.profile}
                meta={r.meta}
                busy={page.busyId === r.profile.id}
                onAccept={() => void page.acceptRequest(r.profile.id)}
                onDecline={() => void page.declineRequest(r.profile.id)}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="section" aria-label="Your friends">
        <div className="head"><h2>Your friends</h2><span className="meta">Sorted by recent activity</span></div>
        {!page.loading && friends.length === 0 ? (
          <p className="empty">No friends yet. Find people by username above.</p>
        ) : (
          <div className="friend-grid">
            {friends.map((friend) => (
              <FriendCard key={friend.id} profile={friend} digest={page.digests.get(friend.id)} />
            ))}
          </div>
        )}
      </section>

      <div className="split">
        <ActivityFeed
          events={feed.events}
          authors={feed.authors}
          filter={feed.filter}
          onFilter={feed.setFilter}
          loading={feed.loading}
          error={feed.error}
          hasFriends={friends.length > 0}
          pending={feed.pending}
          onLoadPending={feed.loadPending}
          social={feed.social}
          socialAvailable={feed.socialAvailable}
          onReact={feed.react}
          onComment={feed.comment}
        />
        <ShelfPanel />
      </div>
    </div>
  );
}
