import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

/** The current time as state; re-read when the app returns to the foreground. */
export function useNow(): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => s === 'active' && setNow(Date.now()));
    return () => sub.remove();
  }, []);
  return now;
}
