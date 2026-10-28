import { useEffect, useState } from 'react';

import { msUntilNextDay } from '@/lib/dayRollover';
import { dateKey } from '@/lib/stats';

/** The local calendar day as `YYYY-MM-DD`, re-read at midnight and when the tab returns to view. */
export function useToday(): string {
  const [today, setToday] = useState(() => dateKey(new Date()));

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(sync, msUntilNextDay(new Date()));
    };
    function sync() {
      setToday(dateKey(new Date()));
      arm();
    }
    arm();
    const onVisible = () => document.visibilityState === 'visible' && sync();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return today;
}
