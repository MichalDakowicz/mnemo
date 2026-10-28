import type { EditForm } from '@/lib/editForm';
import { formatDate, formatMoney, formatRuntime, pickCrew, splitNames } from '@/lib/titleFacts';
import { shortDay } from '@/lib/titleStatus';
import type { TitleExtras } from '@/lib/tmdbExtra';
import type { Movie } from '@/types/movie';

import { FactGrid, NameLinks, personTo, studioTo } from './Facts';
import type { useTitle } from './useTitle';

type Display = ReturnType<typeof useTitle>['display'];
type Props = { type: 'movie' | 'tv'; display: Display; extras: TitleExtras | null; owned: Movie | null; form: EditForm | null };

const join = (xs: string[]) => xs.join(', ');

/** "Details" and "Production" panels of the artboard, from TMDB plus your own row. */
export function DetailsPanels({ type, display: d, extras, owned, form }: Props) {
  const isTv = type === 'tv';
  const crew = extras?.crew ?? [];
  const creators = d.director;
  const stars = d.cast.slice(0, 4).map((c) => c.name);
  const starSplit = splitNames(stars, 2);
  const seasons = d.numberOfSeasons;
  const eps = d.numberOfEpisodes;
  const runtime = formatRuntime(d.runtime);

  const details = [
    creators.length > 0 && {
      label: isTv ? 'Created by' : 'Directed by',
      value: <NameLinks items={creators} to={personTo} />,
    },
    stars.length > 0 && { label: 'Starring', value: starSplit.head, sub: starSplit.tail },
    isTv && extras?.networks.length ? { label: 'Network', value: join(extras.networks) } : false,
    d.tmdbStatus && {
      label: 'Status',
      value: d.tmdbStatus,
      sub: isTv && extras?.nextAirDate ? `Next episode ${formatDate(extras.nextAirDate)}` : undefined,
    },
    {
      label: isTv ? 'First aired' : 'Released',
      value: formatDate(isTv ? (extras?.firstAirDate ?? d.releaseDate) : d.releaseDate) ?? '',
    },
    isTv
      ? !!eps && { label: 'Episodes', value: `${eps} in ${seasons ?? '?'} season${seasons === 1 ? '' : 's'}`, sub: runtime ? `${runtime} each` : undefined }
      : !!runtime && { label: 'Runtime', value: runtime },
    extras?.languages.length ? { label: 'Language', value: join(extras.languages), sub: join(extras.countries) } : false,
    d.availability.length > 0 && { label: 'Streaming (US)', value: join(d.availability) },
    owned && {
      label: 'In your library',
      value: `Added ${formatDate(owned.addedAt) ?? ''}`,
      sub: form?.completedAt ? `Finished ${shortDay(form.completedAt)}` : undefined,
    },
  ];

  const writers = pickCrew(crew, ['Writer', 'Screenplay', 'Story', 'Creator']);
  const directors = pickCrew(crew, ['Director']);
  const producers = pickCrew(crew, ['Executive Producer']);
  const music = pickCrew(crew, ['Original Music Composer', 'Music', 'Composer']);
  const camera = pickCrew(crew, ['Director of Photography']);
  const people = (label: string, list: { id?: number; name: string }[], n = 2) =>
    list.length > 0 && {
      label,
      value: <NameLinks items={list.slice(0, n)} to={personTo} />,
      sub: list.length > n ? `${list.length - n} more` : undefined,
    };
  const production = [
    d.productionCompanies.length > 0 && {
      label: 'Production companies',
      value: <NameLinks items={d.productionCompanies.slice(0, 2)} to={studioTo} />,
      sub: d.productionCompanies.length > 2 ? `${d.productionCompanies.length - 2} more` : undefined,
    },
    people('Executive producers', producers),
    people('Writers', writers),
    !isTv && people('Directors', directors),
    people('Music', music, 1),
    people('Cinematography', camera, 1),
    !isTv && !!formatMoney(d.budget) && { label: 'Budget', value: formatMoney(d.budget), sub: formatMoney(d.revenue) ? `${formatMoney(d.revenue)} box office` : undefined },
    extras?.countries.length ? { label: 'Made in', value: join(extras.countries) } : false,
  ];

  return (
    <>
      <section className="panel" aria-label="Details">
        <div className="ti-panel-head"><h2>Details</h2></div>
        <FactGrid facts={details} />
      </section>
      {production.some(Boolean) ? (
        <section className="panel" aria-labelledby="h-production">
          <div className="ti-panel-head"><h2 id="h-production">Production</h2></div>
          <FactGrid facts={production} />
        </section>
      ) : null}
    </>
  );
}
