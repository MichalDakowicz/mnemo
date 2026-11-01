import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import type { TextInput } from 'react-native';

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
 * Also owns focusing the input: `/discover?focus=search&q=<text>` (the Library search bar's + button).
 * `onFocusRequest` lets the page scroll the field into view first.
 */
export function useBrowseSearch(onFocusRequest?: () => void) {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [filter, setFilter] = useState<ResultFilter>('all');
  const inputRef = useRef<TextInput>(null);
  const router = useRouter();
  const { focus, q } = useLocalSearchParams<{ focus?: string; q?: string }>();
  const wantsFocus = focus === 'search';
  const latestRequest = useRef(onFocusRequest);
  useEffect(() => {
    latestRequest.current = onFocusRequest;
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!wantsFocus) return;
    latestRequest.current?.();
    // Let the scroll start before the keyboard opens, so the field is not covered.
    setTimeout(() => {
      // The Library bar hands over whatever was typed there, or nothing: start from a clean field either way.
      setQuery(typeof q === 'string' ? q.trim() : '');
      inputRef.current?.focus();
    }, 120);
    // Drop the param so a later dock press focuses again.
    router.setParams({ focus: undefined, q: undefined });
  }, [wantsFocus, q, router]);

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
