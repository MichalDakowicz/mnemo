import { View } from 'react-native';

import { Screen } from '@/components/layout/Screen';

import { EditProfilePanel } from './EditProfilePanel';
import { FavouritesSection } from './FavouritesSection';
import { InProgressSection } from './InProgressSection';
import { ProfileHeader } from './ProfileHeader';
import { RandomPickSection } from './RandomPickSection';
import { RankedYearsSection } from './RankedYearsSection';
import { RatingsSection } from './RatingsSection';
import { RecentSection } from './RecentSection';
import { useProfilePage } from './useProfilePage';

/** The signed-in user's own profile. Phone order: hero, favourites, ranked years, recent, then the side column. */
export function ProfileScreen() {
  const p = useProfilePage();
  return (
    <Screen contentStyle={{ gap: 32 }} keyboardShouldPersistTaps="handled">
      <ProfileHeader
        profile={p.profile}
        name={p.name}
        handle={p.handle}
        stats={p.stats}
        copied={p.copied}
        onEdit={p.edit.toggle}
        onShare={() => void p.share()}
      />
      <EditProfilePanel edit={p.edit} fallbackName={p.name} />
      <View style={{ gap: 32 }}>
        <FavouritesSection favs={p.favs} />
        <RankedYearsSection ranked={p.ranked} />
        <RecentSection recent={p.recent} />
        <RandomPickSection pick={p.pick} />
        <RatingsSection rated={p.ratings.rated} average={p.ratings.average} curve={p.ratings.curve} />
        <InProgressSection titles={p.inProgress} />
      </View>
    </Screen>
  );
}
