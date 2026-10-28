import { X } from 'lucide-react';

import { Poster } from '@/components/media/Poster';
import { MAX_FAVORITES } from '@/lib/favorites';
import { formatScore } from '@/lib/profileFormat';
import { personalScore } from '@/lib/personalScore';
import { titleMeta } from '@/lib/statsSummary';
import { TitleCard } from '@/features/stats/TitleCard';

import type { useFavoritesEditor } from './useFavoritesEditor';

type Props = { favs: ReturnType<typeof useFavoritesEditor> };

export function FavouritesSection({ favs }: Props) {
  const slots = Array.from({ length: MAX_FAVORITES }, (_, i) => favs.favorites[i] ?? null);
  return (
    <section aria-labelledby="h-fav">
      <div className="sect-head">
        <h2 id="h-fav">Favourites</h2>
        <button type="button" className="pill small" onClick={favs.toggleEditing} aria-pressed={favs.editing}>
          {favs.editing ? 'Done' : 'Edit favourites'}
        </button>
      </div>
      <div className="favs">
        {slots.map((item, i) => {
          if (!item) {
            return (
              <div className="fav" key={`empty-${i}`}>
                <button type="button" className="slot" onClick={favs.startEditing}>
                  <span className="plus" aria-hidden="true">+</span>
                  Pin a title
                  <span className="rank">{i + 1}</span>
                </button>
              </div>
            );
          }
          const entry = favs.libraryEntry(item);
          const score = entry ? personalScore(entry.ratings) : null;
          const meta = entry ? `${titleMeta(entry)}${score ? ` · ★ ${formatScore(score)}` : ''}` : item.type === 'tv' ? 'Series' : 'Film';
          return (
            <div className="fav" key={`${item.type}:${item.tmdbId}`}>
              <TitleCard
                title={item.title}
                coverUrl={item.coverUrl}
                meta={meta}
                to={`/title/${item.type}/${item.tmdbId}`}
                badge={<span className="rank">{i + 1}</span>}
              />
              {favs.editing ? (
                <button type="button" className="unpin" onClick={() => favs.unpin(item)} disabled={favs.saving} aria-label={`Unpin ${item.title}`}>
                  <X size={12} strokeWidth={2.6} aria-hidden="true" />
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
      {favs.favorites.length === 0 ? <p className="note" style={{ margin: '14px 0 0' }}>Pin up to 4 titles you have watched to the top of your profile.</p> : null}
      {favs.error ? <p className="pf-error" role="alert" style={{ marginTop: 12 }}>{favs.error}</p> : null}
      {favs.editing ? (
        <div className="picker">
          <div className="sect-head">
            <span>From what you have watched</span>
            <span className="note">{favs.full ? 'All four slots are full' : `${favs.favorites.length} of ${MAX_FAVORITES} pinned`}</span>
          </div>
          {favs.pickables.length === 0 ? (
            <p className="note">Finished titles with a TMDB page show up here to pin.</p>
          ) : (
            <div className="picks">
              {favs.pickables.map(({ movie, item, on }) => (
                <button
                  key={movie.id}
                  type="button"
                  className="pickable"
                  aria-pressed={on}
                  aria-label={`${on ? 'Unpin' : 'Pin'} ${movie.title}`}
                  disabled={favs.saving || (!on && favs.full)}
                  onClick={() => favs.pin(item)}
                >
                  <Poster title={movie.title} coverUrl={movie.coverUrl} />
                  <span className="cap">{movie.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
