import { Link } from 'react-router-dom';
import { Pencil, Settings, Share2 } from 'lucide-react';

import { Art } from '@/components/media/Art';
import { Avatar } from '@/components/ui/Avatar';
import { formatScore } from '@/lib/profileFormat';
import type { ShelfStats } from '@/lib/shelfSummary';
import type { Profile } from '@/types/movie';

type Props = {
  profile: Profile | null;
  name: string;
  handle: string;
  stats: ShelfStats;
  editOpen: boolean;
  copied: boolean;
  onEdit: () => void;
  onShare: () => void;
};

export function ProfileHeader({ profile, name, handle, stats, editOpen, copied, onEdit, onShare }: Props) {
  const backdrop = profile?.favorites[0]?.coverUrl ?? null;
  const figures = [
    { value: String(stats.films), label: 'films' },
    { value: String(stats.thisYear), label: 'this year' },
    { value: formatScore(stats.average), label: 'avg' },
  ];
  return (
    <header className="pf-hero">
      <div className="pf-backdrop" aria-hidden="true">
        {backdrop ? <img src={backdrop} alt="" /> : <Art title={name} showTitle={false} />}
      </div>
      <div className="pf-fade" aria-hidden="true" />
      <div className="pf-who">
        <span className="pf-avatar">
          <Avatar name={name} pfp={profile?.pfp} size={112} />
        </span>
        <div style={{ minWidth: 0, paddingBottom: 6 }}>
          <h1 className="pf-name">{name}</h1>
          <p className="pf-handle">{handle}</p>
        </div>
      </div>
      <div className="pf-figures">
        {figures.map((f) => (
          <div key={f.label}>
            <b>{f.value}</b>
            <span>{f.label}</span>
          </div>
        ))}
      </div>
      <div className="pf-actions">
        <button type="button" className="pill primary" onClick={onEdit} aria-expanded={editOpen}>
          <Pencil size={15} strokeWidth={2} aria-hidden="true" />
          Edit profile
        </button>
        <button type="button" className="pill" onClick={onShare}>
          <Share2 size={15} strokeWidth={1.8} aria-hidden="true" />
          {copied ? 'Link copied' : 'Share shelf'}
        </button>
        <Link className="pill" to="/settings">
          <Settings size={15} strokeWidth={1.8} aria-hidden="true" />
          Settings
        </Link>
      </div>
    </header>
  );
}
