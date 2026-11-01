type Named = { id: string; username: string; displayName: string | null };

/** Newest activity first; friends with none follow, alphabetical. */
export function sortFriendsByActivity<T extends Named>(friends: T[], latest: Map<string, string>): T[] {
  const stamp = (id: string) => {
    const parsed = Date.parse(latest.get(id) ?? '');
    return Number.isNaN(parsed) ? 0 : parsed;
  };
  const name = (f: T) => f.displayName || f.username;
  return [...friends].sort((a, b) => stamp(b.id) - stamp(a.id) || name(a).localeCompare(name(b)));
}

/** Latest activity timestamp per user, from rows already ordered or not. */
export function latestByUser(rows: { userId: string; createdAt: string }[]): Map<string, string> {
  const out = new Map<string, string>();
  for (const row of rows) {
    const prev = out.get(row.userId);
    if (!prev || Date.parse(row.createdAt) > Date.parse(prev)) out.set(row.userId, row.createdAt);
  }
  return out;
}
