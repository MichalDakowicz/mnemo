import { EditProfilePanel } from '@/features/profile/EditProfilePanel';
import { FavouritesSection } from '@/features/profile/FavouritesSection';
import { InProgressSection } from '@/features/profile/InProgressSection';
import { ProfileHeader } from '@/features/profile/ProfileHeader';
import { RandomPickSection } from '@/features/profile/RandomPickSection';
import { RankedYearsSection } from '@/features/profile/RankedYearsSection';
import { RatingsSection } from '@/features/profile/RatingsSection';
import { RecentSection } from '@/features/profile/RecentSection';
import { useProfilePage } from '@/features/profile/useProfilePage';
import '@/features/stats/titleCard.css';
import '@/features/profile/profile.css';

export function ProfilePage() {
  const p = useProfilePage();
  return (
    <div className="profile-page">
      <ProfileHeader
        profile={p.profile}
        name={p.name}
        handle={p.handle}
        stats={p.stats}
        editOpen={p.edit.open}
        copied={p.copied}
        onEdit={p.edit.toggle}
        onShare={p.share}
      />
      {p.edit.open ? <EditProfilePanel edit={p.edit} fallbackName={p.name} /> : null}
      <div className="pf-body">
        <div className="pf-main">
          <FavouritesSection favs={p.favs} />
          <RankedYearsSection ranked={p.ranked} />
          <RecentSection recent={p.recent} />
        </div>
        <aside className="pf-side">
          <RandomPickSection pick={p.pick} />
          <RatingsSection rated={p.ratings.rated} average={p.ratings.average} curve={p.ratings.curve} />
          <InProgressSection titles={p.inProgress} />
        </aside>
      </div>
    </div>
  );
}
