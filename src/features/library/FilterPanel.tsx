import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

import { filterFacets, type Facet, type LibraryFacets } from '@/lib/libraryFacets';
import { ALL_SERVICES, OTHER_SERVICE_KEY } from '@/lib/services';
import { MY_SERVICES_KEY } from '@/lib/serviceFilter';
import { useLibraryPrefs } from '@/store/libraryPrefs';

import { usePopover } from './usePopover';

const SHOWN = 24;

type GroupProps = { title: string; facets: Facet[]; selected: string[]; onToggle: (v: string) => void; find: string };

function FacetGroup({ title, facets, selected, onToggle, find }: GroupProps) {
  // Selected values stay visible even when the find box would hide them.
  const visible = filterFacets(facets, find);
  const shown = [...facets.filter((f) => selected.includes(f.value) && !visible.includes(f)), ...visible].slice(0, SHOWN);
  if (shown.length === 0) return null;
  return (
    <fieldset className="lib-facet">
      <legend>{title}</legend>
      <div className="lib-chip-row">
        {shown.map((f) => (
          <button key={f.value} type="button" className="chip" aria-pressed={selected.includes(f.value)} onClick={() => onToggle(f.value)}>
            {f.value} <small>{f.count}</small>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

type Props = { facets: LibraryFacets; activeCount: number; hasOwnedServices: boolean };

export function FilterPanel({ facets, activeCount, hasOwnedServices }: Props) {
  const { open, setOpen, ref } = usePopover();
  const [find, setFind] = useState('');
  const p = useLibraryPrefs();
  const services: Facet[] = [
    ...(hasOwnedServices ? [{ value: MY_SERVICES_KEY, count: 0 }] : []),
    ...ALL_SERVICES.map((s) => ({ value: s as string, count: 0 })),
    { value: OTHER_SERVICE_KEY, count: 0 },
  ];
  return (
    <div className="lib-pop" ref={ref}>
      <button type="button" className="pill ghost" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(!open)}>
        <SlidersHorizontal size={16} aria-hidden="true" />Filters{activeCount > 0 ? <span className="lib-count">{activeCount}</span> : null}
      </button>
      {open ? (
        <div className="lib-filters glass" role="dialog" aria-label="Filters">
          <label className="search-small lib-find">
            <span className="sr">Find a genre, director or year</span>
            <input type="text" placeholder="Find a genre, director, year" value={find} onChange={(e) => setFind(e.target.value)} />
          </label>
          <fieldset className="lib-facet">
            <legend>Streaming service</legend>
            <div className="lib-chip-row">
              {services.map((s) => (
                <button key={s.value} type="button" className="chip" aria-pressed={p.selectedServices.includes(s.value)} onClick={() => p.toggleService(s.value)}>
                  {s.value === MY_SERVICES_KEY ? 'My services' : s.value}
                </button>
              ))}
            </div>
          </fieldset>
          <FacetGroup title="Genre" facets={facets.genres} selected={p.selectedGenres} onToggle={p.toggleGenre} find={find} />
          <FacetGroup title="Director" facets={facets.directors} selected={p.selectedDirectors} onToggle={p.toggleDirector} find={find} />
          <FacetGroup title="Release year" facets={facets.years} selected={p.selectedYears} onToggle={p.toggleYear} find={find} />
          <div className="lib-filters-foot">
            <button type="button" className="text-button" disabled={activeCount === 0} onClick={p.resetFilters}>Clear filters</button>
            <button type="button" className="pill primary" onClick={() => setOpen(false)}>Done</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
