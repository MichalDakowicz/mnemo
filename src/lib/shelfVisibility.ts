import type { FriendsVisibility } from '@/lib/userSettings';

// Who can open a shelf. The values are user_settings.friends_visibility as the
// database stores them; the design's "Only me" is 'noone'.
export const VISIBILITY_OPTIONS: { value: FriendsVisibility; label: string }[] = [
  { value: 'public', label: 'Anyone with the link' },
  { value: 'friends', label: 'Friends' },
  { value: 'noone', label: 'Only me' },
];

// Notes are always private. Activity follows the same rule as the shelf
// (activity_visible_read uses can_view), so "Only me" hides activity too.
export function visibilityNote(value: FriendsVisibility): string {
  switch (value) {
    case 'public':
      return 'Anyone with the link sees your library and stats. Notes stay private.';
    case 'noone':
      return 'Nobody else sees your shelf or your activity.';
    default:
      return 'Friends see your library, stats and activity. Notes stay private.';
  }
}
