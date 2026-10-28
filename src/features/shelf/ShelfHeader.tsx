import { useState } from 'react';

import { Avatar } from '@/components/ui/Avatar';
import type { ShelfStats } from '@/lib/shelfSummary';
import type { Profile } from '@/types/movie';

import type { Relation } from './useShelfPage';

type Props = {
  profile: Profile;
  stats: ShelfStats | null;
  relation: Relation;
  busy: boolean;
  onAdd: () => void;
  onAccept: () => void;
  onRemove: () => void;
};

export function ShelfHeader({ profile, stats, relation, busy, onAdd, onAccept, onRemove }: Props) {
  const [confirming, setConfirming] = useState(false);
  const name = profile.displayName || profile.username;
  return (
    <header className="shelf-head">
      <div className="shelf-id">
        <Avatar name={name} pfp={profile.pfp} size={72} />
        <div>
          <h1>{name}</h1>
          <p className="shelf-handle">@{profile.username}</p>
        </div>
      </div>
      {stats ? (
        <dl className="shelf-stats" style={{ margin: 0 }}>
          <div className="shelf-stat"><b>{stats.films}</b><span>Watched</span></div>
          <div className="shelf-stat"><b>{stats.thisYear}</b><span>This year</span></div>
          <div className="shelf-stat"><b>{stats.average != null ? stats.average.toFixed(1) : '—'}</b><span>Avg score</span></div>
        </dl>
      ) : null}
      <div className="shelf-actions">
        {relation === 'none' ? <button type="button" className="pill primary" disabled={busy} onClick={onAdd}>Add friend</button> : null}
        {relation === 'sent' ? <button type="button" className="pill" disabled>Request sent</button> : null}
        {relation === 'incoming' ? <button type="button" className="pill primary" disabled={busy} onClick={onAccept}>Accept request</button> : null}
        {relation === 'friend' && !confirming ? (
          <button type="button" className="pill" onClick={() => setConfirming(true)}>Friends</button>
        ) : null}
        {relation === 'friend' && confirming ? (
          <>
            <button type="button" className="pill" disabled={busy} onClick={onRemove}>Remove friend</button>
            <button type="button" className="text-button" onClick={() => setConfirming(false)}>Keep</button>
          </>
        ) : null}
      </div>
    </header>
  );
}
