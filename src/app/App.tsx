import { Route, Routes } from 'react-router-dom';

import { AppShell } from '@/components/layout/AppShell';
import { DiscoverPage } from '@/pages/DiscoverPage';
import { GenrePage } from '@/pages/GenrePage';
import { FriendsPage } from '@/pages/FriendsPage';
import { LibraryPage } from '@/pages/LibraryPage';
import { PersonPage } from '@/pages/PersonPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { ShelfPage } from '@/pages/ShelfPage';
import { StatsPage } from '@/pages/StatsPage';
import { StudioPage } from '@/pages/StudioPage';
import { TitlePage } from '@/pages/TitlePage';

// Route shapes: title /title/<movie|tv>/<tmdbId>, person /person/<tmdbId>, friend shelf /u/<userId>.
export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<LibraryPage />} />
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="friends" element={<FriendsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="title/:type/:id" element={<TitlePage />} />
        <Route path="person/:id" element={<PersonPage />} />
        <Route path="genre/:id" element={<GenrePage />} />
        <Route path="studio/:id" element={<StudioPage />} />
        <Route path="u/:id" element={<ShelfPage />} />
        <Route path="*" element={<LibraryPage />} />
      </Route>
    </Routes>
  );
}
