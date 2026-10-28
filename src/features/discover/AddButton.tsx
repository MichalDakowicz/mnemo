import { Check, Plus } from 'lucide-react';

type Props = { added: boolean; pending: boolean; title: string; onToggle: () => void };

/** The round + / check on a card corner: adds to the watchlist, or removes from the library. */
export function AddButton({ added, pending, title, onToggle }: Props) {
  return (
    <button
      type="button"
      className="add"
      aria-pressed={added}
      disabled={pending}
      aria-label={`${added ? 'Remove from library' : 'Add to watchlist'}: ${title}`}
      onClick={onToggle}
    >
      {added ? <Check size={14} strokeWidth={3} aria-hidden="true" /> : <Plus size={14} strokeWidth={2.6} aria-hidden="true" />}
    </button>
  );
}
