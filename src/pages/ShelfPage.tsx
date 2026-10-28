import { Link, useParams } from 'react-router-dom';

import '@/features/friends/friends.css';
import '@/features/shelf/shelf.css';
import { ComparePanel } from '@/features/shelf/ComparePanel';
import { PosterRail, type RailItem } from '@/features/shelf/PosterRail';
import { ShelfHeader } from '@/features/shelf/ShelfHeader';
import { ShelfLibrary } from '@/features/shelf/ShelfLibrary';
import { useShelfPage } from '@/features/shelf/useShelfPage';
import { sharedCountLabel } from '@/lib/sharedWatchlist';
import type { Movie } from '@/types/movie';

const rail = (m: Movie): RailItem => ({ key: m.id, title: m.title, coverUrl: m.coverUrl, tmdbId: m.tmdbId, type: m.type });

export function ShelfPage() {
  const { id } = useParams();
  const shelf = useShelfPage(id);
  const { profile } = shelf;

  if (shelf.loading) return <p className="empty">Loading shelf…</p>;
  if (!profile) return <p className="empty">We could not find that person. <Link to="/friends" className="text-button">Back to friends</Link></p>;

  const header = (
    <ShelfHeader
      profile={profile}
      stats={shelf.canView ? shelf.stats : null}
      relation={shelf.relation}
      busy={shelf.busy}
      onAdd={() => void shelf.addFriend()}
      onAccept={() => void shelf.accept()}
      onRemove={() => void shelf.removeFriend()}
    />
  );

  if (shelf.canView === false) {
    return (
      <div className="shelf-page">
        {header}
        <div className="panel shelf-private">
          <h2>This shelf is private</h2>
          <p className="page-sub">{profile.displayName || profile.username} has not shared their library with you.</p>
        </div>
      </div>
    );
  }

  const shared: RailItem[] = shelf.shared.map((s) => ({
    key: s.key, title: s.title, coverUrl: s.coverUrl, tmdbId: s.tmdbId, type: s.type, caption: s.services.slice(0, 2).join(' · ') || undefined,
  }));

  return (
    <div className="shelf-page">
      {header}
      {shelf.notice ? <p className="notice" role="alert">{shelf.notice}</p> : null}
      {shelf.error ? <p className="notice" role="alert">Could not load this library.</p> : null}
      <PosterRail title="Favourites" items={profile.favorites.map((f) => ({ key: `${f.type}:${f.tmdbId}`, ...f }))} />
      <PosterRail title="Watching now" items={shelf.inProgress.map(rail)} />
      <PosterRail title="Recently finished" items={shelf.recent.map(rail)} />
      {shelf.comparison ? <ComparePanel comparison={shelf.comparison} headline={shelf.headline} subtitle={shelf.subtitle} /> : null}
      {shared.length > 0 || shelf.comparison ? <PosterRail title="Watch together" meta={sharedCountLabel(shared.length)} items={shared} /> : null}
      {shelf.theirs.length === 0 ? <p className="empty">Nothing on this shelf yet.</p> : <section className="shelf-section"><ShelfLibrary movies={shelf.theirs} /></section>}
      {shelf.theirFriends.length > 0 ? (
        <section className="shelf-section" aria-label="Friends">
          <div className="head"><h2>Friends</h2><span className="meta">{shelf.theirFriends.length}</span></div>
          <div className="chip-group">
            {shelf.theirFriends.map((f) => (
              <Link key={f.id} className="chip" to={`/u/${f.id}`}>{f.displayName || f.username}</Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
