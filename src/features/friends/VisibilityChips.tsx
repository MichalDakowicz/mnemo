import { useUserSettings } from '@/hooks/useUserSettings';
import { VISIBILITY_OPTIONS, visibilityNote } from '@/lib/shelfVisibility';

/** Who can open your shelf: three chips over user_settings.friends_visibility. */
export function VisibilityChips({ showNote = true }: { showNote?: boolean }) {
  const { settings, updateSettings } = useUserSettings();
  const current = settings.friendsVisibility;
  return (
    <>
      <div className="chip-group" role="group" aria-label="Who can see your shelf">
        {VISIBILITY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className="chip"
            aria-pressed={current === option.value}
            onClick={() => void updateSettings({ friendsVisibility: option.value })}
          >
            {option.label}
          </button>
        ))}
      </div>
      {showNote ? <p className="vis-note">{visibilityNote(current)}</p> : null}
    </>
  );
}
