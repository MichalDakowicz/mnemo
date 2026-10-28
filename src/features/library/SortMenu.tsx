import { ArrowDown, ArrowUp, ChevronDown } from 'lucide-react';

import type { SortBy, SortDir } from '@/store/libraryPrefs';

import { usePopover } from './usePopover';

const OPTIONS: [SortBy, string][] = [
  ['dateAdded', 'Recently added'],
  ['title', 'Title'],
  ['releaseDate', 'Release date'],
  ['rating', 'Your rating'],
  ['director', 'Director'],
  ['runtime', 'Runtime'],
];

type Props = { sortBy: SortBy; sortDir: SortDir; onSortBy: (s: SortBy) => void; onToggleDir: () => void };

export function SortMenu({ sortBy, sortDir, onSortBy, onToggleDir }: Props) {
  const { open, setOpen, ref } = usePopover();
  const label = OPTIONS.find(([v]) => v === sortBy)?.[1] ?? 'Sort';
  const Dir = sortDir === 'asc' ? ArrowUp : ArrowDown;
  return (
    <div className="lib-pop" ref={ref}>
      <button type="button" className="pill ghost" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>
<ChevronDown size={14} aria-hidden="true" />{label}
      </button>
      <button type="button" className="icon-button" aria-label={sortDir === 'asc' ? 'Ascending, switch to descending' : 'Descending, switch to ascending'} onClick={onToggleDir}>
        <Dir size={16} />
      </button>
      {open ? (
        <div className="lib-menu glass" role="menu">
          {OPTIONS.map(([v, text]) => (
            <button key={v} type="button" role="menuitemradio" aria-checked={v === sortBy} onClick={() => { onSortBy(v); setOpen(false); }}>{text}</button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
