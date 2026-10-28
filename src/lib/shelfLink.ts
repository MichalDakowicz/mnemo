/** Absolute link to someone's public shelf: a real URL a friend can open in any browser. */
export function publicShelfUrl(userId: string): string {
  return `${window.location.origin}/u/${userId}`;
}
