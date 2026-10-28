import { Search } from 'lucide-react';
import type { RefObject } from 'react';

import type { MediaType } from '@/types/movie';

type Props = {
  inputRef: RefObject<HTMLInputElement | null>;
  query: string;
  onQuery: (q: string) => void;
  kind: MediaType;
  onKind: (k: MediaType) => void;
};

const KINDS: { id: MediaType; label: string }[] = [
  { id: 'movie', label: 'Films' },
  { id: 'tv', label: 'Shows' },
];

/** The big search pill plus the Films / Shows switch that drives the reel and the rows. */
export function SearchBar({ inputRef, query, onQuery, kind, onKind }: Props) {
  return (
    <div className="search-bar" id="search">
      <label className="search-field">
        <Search size={20} strokeWidth={2} aria-hidden="true" />
        <span className="sr">Search films, shows, people and genres</span>
        <input
          ref={inputRef}
          type="search"
          autoComplete="off"
          placeholder="Films, shows, people, genres"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
        <kbd aria-hidden="true">Ctrl K</kbd>
      </label>
      <div className="seg glass" role="group" aria-label="Type">
        {KINDS.map((k) => (
          <button key={k.id} type="button" aria-pressed={kind === k.id} onClick={() => onKind(k.id)}>
            {k.label}
          </button>
        ))}
      </div>
    </div>
  );
}
