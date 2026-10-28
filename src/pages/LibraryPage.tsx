import { ComingSoon } from '@/features/library/ComingSoon';
import { ContinueWatching } from '@/features/library/ContinueWatching';
import { LibraryGrid } from '@/features/library/LibraryGrid';
import { LibraryToolbar } from '@/features/library/LibraryToolbar';
import { RecentlyAdded } from '@/features/library/RecentlyAdded';
import { StatusTypeChips } from '@/features/library/StatusTypeChips';
import { useLibrary } from '@/features/library/useLibrary';
import '@/features/library/library.css';

export function LibraryPage() {
  const lib = useLibrary();
  const { prefs } = lib;
  const filtering = lib.searchQuery.trim() !== '' || prefs.statusFilter !== 'all' || prefs.typeFilter !== 'all' || lib.activeFilterCount > 0;

  let body;
  if (lib.loading) body = <div className="lib-state" role="status"><p>Loading your library…</p></div>;
  else if (lib.error) body = <div className="lib-state" role="alert"><h3>Could not load your library</h3><p>Check your connection and reload.</p></div>;
  else if (lib.movies.length === 0)
    body = <div className="lib-state"><h3>Your library is empty</h3><p>Add a title from Discover to start tracking.</p></div>;
  else if (lib.mainMovies.length === 0)
    body = (
      <div className="lib-state">
        <h3>Nothing here</h3>
        <p>{filtering ? 'No title in your library matches these filters.' : 'Everything is already shown above.'}</p>
      </div>
    );
  else body = <LibraryGrid movies={lib.mainMovies} viewMode={prefs.viewMode} gridSize={prefs.gridSize} onQuickStatus={lib.quickStatus} />;

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Library</h1>
          <p className="page-sub">{lib.loading ? ' ' : lib.summary}</p>
        </div>
      </div>
      {lib.actionError ? <div className="lib-banner" role="alert">{lib.actionError}</div> : null}
      <ContinueWatching movies={lib.continueWatching} />
      <ComingSoon movies={lib.comingSoon} collapsed={prefs.comingSoonCollapsed} onToggle={prefs.toggleComingSoonCollapsed} />
      <RecentlyAdded movies={lib.recentlyAdded} onQuickStatus={lib.quickStatus} />
      <section aria-label="All titles">
        <div className="lib-main-head">
          <LibraryToolbar
            query={lib.searchQuery}
            onQuery={lib.setSearchQuery}
            facets={lib.facets}
            activeFilterCount={lib.activeFilterCount}
            hasOwnedServices={lib.ownedServices.length > 0}
            sortBy={prefs.sortBy}
            sortDir={prefs.sortDir}
            onSortBy={prefs.setSortBy}
            onToggleDir={prefs.toggleSortDir}
            viewMode={prefs.viewMode}
            onViewMode={prefs.setViewMode}
            pickPool={lib.pickPool}
          />
        </div>
        <StatusTypeChips status={prefs.statusFilter} type={prefs.typeFilter} counts={lib.counts} onStatus={prefs.setStatusFilter} onType={prefs.setTypeFilter} />
        {body}
      </section>
    </>
  );
}
