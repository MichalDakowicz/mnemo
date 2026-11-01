/** Hosted web app (Firebase project log-mnemo): where a shared shelf link opens. */
export const WEB_ORIGIN = 'https://log-mnemo.web.app';

/** Absolute link to someone's public shelf: a real URL a friend can open in any browser. */
export function publicShelfUrl(userId: string): string {
  return `${WEB_ORIGIN}/u/${userId}`;
}
