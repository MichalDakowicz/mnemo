import { Tabs } from 'expo-router';

import { colors } from '@/theme/colors';

// The five dock destinations. The dock itself is drawn once in the root layout, so the tab bar is empty.
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={() => null}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.ground } }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="discover" />
      <Tabs.Screen name="stats" />
      <Tabs.Screen name="friends" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
