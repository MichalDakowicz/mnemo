import { Avatar } from '@/components/ui/Avatar';

import type { useProfileEdit } from './useProfileEdit';

type Props = { edit: ReturnType<typeof useProfileEdit>; fallbackName: string };

export function EditProfilePanel({ edit, fallbackName }: Props) {
  const shown = edit.name.trim() || edit.username || fallbackName;
  return (
    <section className="pf-edit" aria-label="Edit profile">
      <div className="pf-edit-photo">
        <Avatar name={shown} pfp={edit.pfp || null} size={64} />
        <div>
          <div className="pf-buttons">
            <button type="button" className="pill small" onClick={edit.upload}>
              Upload photo
            </button>
            {edit.pfp ? (
              <button type="button" className="pill small" onClick={edit.clearPfp}>
                Remove
              </button>
            ) : null}
          </div>
          <span className="note">Square crop, saved at 256 px</span>
        </div>
      </div>
      <label className="pf-field">
        <span>Display name</span>
        <input className="input" type="text" value={edit.name} onChange={(e) => edit.setName(e.target.value)} />
      </label>
      <label className="pf-field">
        <span>Username</span>
        <input
          className="input mono"
          type="text"
          value={edit.username}
          autoCapitalize="none"
          spellCheck={false}
          onChange={(e) => edit.setUsername(e.target.value)}
        />
      </label>
      <div className="pf-buttons">
        <button type="button" className="pill primary" onClick={edit.save} disabled={edit.saving}>
          {edit.saving ? 'Saving...' : 'Save'}
        </button>
        <button type="button" className="pill" onClick={edit.close} disabled={edit.saving}>
          Cancel
        </button>
      </div>
      {edit.error ? (
        <p className="pf-error" role="alert">
          {edit.error}
        </p>
      ) : null}
    </section>
  );
}
