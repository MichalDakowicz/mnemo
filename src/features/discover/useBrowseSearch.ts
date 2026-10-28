import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useSearchBrowse } from '@/hooks/useTmdb';
import type { BrowseSearchResult } from '@/lib/tmdb';

export type ResultFilter = 'all' | 'movie' | 'tv' | 'person' | 'genre';

export const RESULT_FILTERS: { id: ResultFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'movie', label: 'Films' },
  { id: 'tv', label: 'Shows' },
  { id: 'person', label: 'People' },
  { id: 'genre', label: 'Genres' },
];

const DEBOUNCE_MS = 450;

/** Keep results of one type; 'all' keeps everything. */
export function filterResults(results: BrowseSearchResult[], filter: ResultFilter): BrowseSearchResult[] {
  return filter === 'all' ? results : results.filter((r) => r.resultType === filter);
}

/**
 * Debounced universal search (films, shows, people, genres) with a result-type filter.
 * Also owns focusing the input: `/discover?focus=search` (the dock's Search item) and Ctrl/Cmd+K.
 */
export function useBrowseSearch() {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [filter, setFilter] = useState<ResultFilter>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const [params, setParams] = useSearchParams();
  const wantsFocus = params.get('focus') === 'search';

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!wantsFocus) return;
    inputRef.current?.focus();
    inputRef.current?.scrollIntoView({ block: 'center', behavior: 'auto' });
    // Drop the param so a later dock click focuses again.
    setParams((p) => {
      const next = new URLSearchParams(p);
      next.delete('focus');
      return next;
    }, { replace: true });
  }, [wantsFocus, setParams]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const search = useSearchBrowse(debounced);
  const active = query.trim().length > 0;
  // Between typing and the debounce firing the old results are stale; show loading instead.
  const settling = active && debounced !== query.trim();

  return {
    inputRef,
    query,
    setQuery,
    active,
    loading: active && (settling || search.isFetching),
    error: search.isError,
    all: search.data ?? [],
    results: filterResults(search.data ?? [], filter),
    filter,
    setFilter,
    clear: () => setQuery(''),
  };
}
