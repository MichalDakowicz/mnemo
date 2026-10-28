import { Avatar } from '@/components/ui/Avatar';
import type { Profile } from '@/types/movie';

type Props = { profile: Profile; meta: string; busy: boolean; onAccept: () => void; onDecline: () => void };

export function RequestRow({ profile, meta, busy, onAccept, onDecline }: Props) {
  const name = profile.displayName || profile.username;
  return (
    <div className="req-row">
      <Avatar name={name} pfp={profile.pfp} size={44} />
      <span className="req-who">
        <span className="req-name">{name}</span>
        <span className="req-meta">@{profile.username}{meta ? ` · ${meta}` : ''}</span>
      </span>
      <span className="req-actions">
        <button type="button" className="pill primary" disabled={busy} onClick={onAccept}>Accept</button>
        <button type="button" className="pill" disabled={busy} onClick={onDecline}>Decline</button>
      </span>
    </div>
  );
}
