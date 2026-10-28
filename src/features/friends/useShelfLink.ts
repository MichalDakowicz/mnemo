import { useCallback, useEffect, useRef, useState } from 'react';

import { publicShelfUrl } from '@/lib/shelfLink';

/** Copy-to-clipboard for the shelf link, with a short "Copied" flag. */
export function useShelfLink(userId: string | undefined) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const url = userId ? publicShelfUrl(userId) : '';

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  }, [url]);

  return { url, copied, copy };
}
