import { useCallback, useEffect, useRef, useState } from 'react';

import * as Clipboard from 'expo-clipboard';

import { publicShelfUrl } from '@/lib/shelfLink';

/** Copy-to-clipboard for the shelf link, with a short "Copied" flag. */
export function useShelfLink(userId: string | undefined) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const url = userId ? publicShelfUrl(userId) : '';

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(async () => {
    if (!url) return;
    try {
      await Clipboard.setStringAsync(url);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }, [url]);

  return { url, copied, copy };
}
