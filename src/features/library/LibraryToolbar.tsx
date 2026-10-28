import { LayoutGrid, List, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { LibraryFacets } from '@/lib/libraryFacets';
import type { SortBy, SortDir, ViewMode } from '@/store/libraryPrefs';
import type { Movie } from '@/types/movie';

import { FilterPanel } from './FilterPanel';
import { RandomPick } from './RandomPick';
import { SortMenu } from './SortMenu';

type Props = {
  query: string;
  onQuery: (q: string) => void;
  facets: LibraryFacets;
  activeFilterCount: number;
  hasOwnedServices: boolean;
  sortBy: SortBy;
  sortDir: SortDir;
  onSortBy: (s: SortBy) => void;
  onToggleDir: () => void;
  viewMode: ViewMode;
  onViewMode: (v: ViewMode) => void;
  pickPool: Movie[];
};

/** Add and search on the left; everything that shapes or picks from the list on the right. */
export function LibraryToolbar(p: Props) {
  const grid = p.viewMode === 'grid';
  const ViewIcon = grid ? LayoutGrid : List;
  return (
    <div className="lib-toolbar">
      <div className="lib-tb-group">
        <Link className="icon-button add-button" to="/discover?focus=search" aria-label="Add a title" title="Add a title"><Plus size={18} /></Link>
        <label className="search-small">
          <Search size={16} aria-hidden="true" />
          <span className="sr">Search your library</span>
          <input type="text" placeholder="Title, director, genre, year" value={p.query} onChange={(e) => p.onQuery(e.target.value)} />
        </label>
      </div>
      <div className="lib-tb-group lib-tb-right">
        <FilterPanel facets={p.facets} activeCount={p.activeFilterCount} hasOwnedServices={p.hasOwnedServices} />
        <SortMenu sortBy={p.sortBy} sortDir={p.sortDir} onSortBy={p.onSortBy} onToggleDir={p.onToggleDir} />
        <button
          type="button"
          className="icon-button"
          aria-label={grid ? 'Grid view, switch to list' : 'List view, switch to grid'}
          title={grid ? 'Switch to list view' : 'Switch to grid view'}
          onClick={() => p.onViewMode(grid ? 'list' : 'grid')}
        >
          <ViewIcon size={18} />
        </button>
        <RandomPick pool={p.pickPool} />
      </div>
    </div>
  );
}
