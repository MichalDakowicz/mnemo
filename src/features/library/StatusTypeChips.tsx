import { STATUS_FILTERS } from '@/lib/statusFilter';
import type { StatusFilter, TypeFilter } from '@/store/libraryPrefs';

const STATUS_LABEL: Record<StatusFilter, string> = { all: 'All', watchlist: 'Watchlist', watching: 'Watching', completed: 'Watched', rewatch: 'Rewatch' };
const TYPES: [TypeFilter, string][] = [['all', 'All'], ['movie', 'Films'], ['tv', 'Shows']];

type Props = {
  status: StatusFilter;
  type: TypeFilter;
  counts: Record<StatusFilter, number>;
  onStatus: (s: StatusFilter) => void;
  onType: (t: TypeFilter) => void;
};

export function StatusTypeChips({ status, type, counts, onStatus, onType }: Props) {
  return (
    <div className="lib-chips">
      <div className="lib-chip-row" role="group" aria-label="Status">
        {STATUS_FILTERS.map((s) => (
          <button key={s} type="button" className="chip" aria-pressed={status === s} onClick={() => onStatus(s)}>
            {STATUS_LABEL[s]} <small>{counts[s]}</small>
          </button>
        ))}
      </div>
      <div className="lib-chip-row" role="group" aria-label="Type">
        {TYPES.map(([v, label]) => (
          <button key={v} type="button" className="chip" aria-pressed={type === v} onClick={() => onType(v)}>{label}</button>
        ))}
      </div>
    </div>
  );
}
