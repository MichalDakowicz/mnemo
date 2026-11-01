import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { msUntilNextDay } from '@/lib/dayRollover';
import { dateKey } from '@/lib/stats';

/** The local calendar day as `YYYY-MM-DD`, re-read at midnight and when the app returns to the foreground. */
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
    const sub = AppState.addEventListener('change', (s) => s === 'active' && sync());
    return () => {
      clearTimeout(timer);
      sub.remove();
    };
  }, []);

  return today;
}
