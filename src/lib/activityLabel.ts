import type { ActivityEvent } from '@/types/movie';

/** The verb phrase for an activity row: "Finished", "Rated 4.5", ... (the title is rendered separately). */
export function activityVerb(event: Pick<ActivityEvent, 'type' | 'details'>): string {
  const { type, details } = event;
  switch (type) {
    case 'added':
      return 'Added';
    case 'completed':
      return 'Finished';
    case 'started_watching':
      return 'Started';
    case 'added_to_watchlist':
      return 'Added to watchlist';
    case 'rating_changed': {
      const rating = Number(details?.rating);
      return Number.isFinite(rating) && rating > 0 ? `Rated ${rating}` : 'Rated';
    }
    case 'status_changed': {
      const next = details?.newStatus;
      return typeof next === 'string' && next ? `Moved to ${next === 'Completed' ? 'Watched' : next}` : 'Changed status of';
    }
    case 'removed':
      return 'Removed';
    default:
      return 'Updated';
  }
}
