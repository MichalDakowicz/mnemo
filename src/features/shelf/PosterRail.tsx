import { Poster } from '@/components/media/Poster';

export type RailItem = { key: string; title: string; coverUrl: string | null; tmdbId: number | null; type: 'movie' | 'tv'; caption?: string };

/** Poster link: opens the title page when TMDB knows it, otherwise a static cover. */
export function PosterLink({ item }: { item: RailItem }) {
  const to = item.tmdbId != null ? `/title/${item.type}/${item.tmdbId}` : undefined;
  return (
    <div>
      <Poster title={item.title} coverUrl={item.coverUrl} to={to} />
      <span className="poster-cap">
        {item.title}
        {item.caption ? <small>{item.caption}</small> : null}
      </span>
    </div>
  );
}

type Props = { title: string; meta?: string; items: RailItem[]; grid?: boolean };

export function PosterRail({ title, meta, items, grid = false }: Props) {
  if (items.length === 0) return null;
  return (
    <section className="shelf-section" aria-label={title}>
      <div className="head"><h2>{title}</h2>{meta ? <span className="meta">{meta}</span> : null}</div>
      <div className={grid ? 'poster-grid' : 'poster-rail'}>
        {items.map((item) => <PosterLink key={item.key} item={item} />)}
      </div>
    </section>
  );
}
