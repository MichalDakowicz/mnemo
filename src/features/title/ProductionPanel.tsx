import { formatMoney, pickCrew } from '@/lib/titleFacts';
import type { TitleExtras } from '@/lib/tmdbExtra';

import { FactGrid, NameLinks, personTo, studioTo } from './Facts';
import type { useTitle } from './useTitle';

type Display = ReturnType<typeof useTitle>['display'];
type Props = { type: 'movie' | 'tv'; display: Display; extras: TitleExtras | null };

const join = (xs: string[]) => xs.join(', ');

/** The artboard's Production panel, from TMDB. The rest of Details lives in the head and the streaming rail. */
export function ProductionPanel({ type, display: d, extras }: Props) {
  const isTv = type === 'tv';
  const crew = extras?.crew ?? [];

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

  if (!production.some(Boolean)) return null;
  return (
    <section className="panel" aria-labelledby="h-production">
      <div className="ti-panel-head"><h2 id="h-production">Production</h2></div>
      <FactGrid facts={production} />
    </section>
  );
}
