import { BarChart3, ChevronLeft, Compass, Library, UserRound, Users } from 'lucide-react-native';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glass } from '@/components/ui/Glass';
import { colors } from '@/theme/colors';
import { DOCK_GAP, DOCK_HEIGHT } from '@/theme/layout';

type Item = { href: string; label: string; Icon: typeof Library; match: (path: string) => boolean };

// The web dock's destinations minus Search (Discover has its own search field), icons only. The labels survive as accessibility labels.
const ITEMS: Item[] = [
  { href: '/', label: 'Library', Icon: Library, match: (p) => p === '/' || p === '' },
  { href: '/discover', label: 'Discover', Icon: Compass, match: (p) => p === '/discover' },
  { href: '/stats', label: 'Stats', Icon: BarChart3, match: (p) => p === '/stats' },
  { href: '/friends', label: 'Friends', Icon: Users, match: (p) => p === '/friends' },
  { href: '/profile', label: 'Profile', Icon: UserRound, match: (p) => p === '/profile' },
];

/** Pages you arrive at from another page rather than from the dock: they get the back button. */
const DETAIL_PAGE = /^\/(title|person|genre|studio|u|settings)(\/|$)/;

/**
 * Floating pill dock at the bottom: the only navigation, no header bar, no logo, no text.
 * On detail pages a round back button slides in to its left (the web dock does the same).
 */
export function Dock() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const detail = DETAIL_PAGE.test(pathname);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: insets.bottom + DOCK_GAP }]}>
      {detail ? (
        <Animated.View entering={ZoomIn.duration(300)} exiting={ZoomOut.duration(200)}>
          <Glass style={styles.back}>
            <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={goBack} style={styles.backPress}>
              <ChevronLeft size={22} color={colors.nav} />
            </Pressable>
          </Glass>
        </Animated.View>
      ) : null}
      <Glass style={styles.dock}>
        {ITEMS.map(({ href, label, Icon, match }) => {
          const active = !detail && match(pathname);
          return (
            <Pressable
              key={label}
              accessibilityRole="tab"
              accessibilityLabel={label}
              accessibilityState={{ selected: active }}
              // navigate() pops any detail screens and keeps each tab's state, instead of stacking duplicates.
              onPress={() => router.navigate(href as never)}
              style={({ pressed }) => [styles.item, active && { backgroundColor: colors.active }, pressed && !active && { backgroundColor: colors.hover }]}>
              <Icon size={20} strokeWidth={1.8} color={active ? colors.textBright : colors.nav} />
            </Pressable>
          );
        })}
      </Glass>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, zIndex: 80 },
  dock: { flexDirection: 'row', alignItems: 'center', gap: 2, padding: 4 },
  item: { width: 46, height: DOCK_HEIGHT - 16, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  back: { width: DOCK_HEIGHT - 4, height: DOCK_HEIGHT - 4 },
  backPress: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
