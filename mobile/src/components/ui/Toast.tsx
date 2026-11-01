import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DOCK_CLEARANCE } from '@/theme/layout';

import { Glass } from './Glass';
import { Text } from './Text';

type ToastApi = { show: (message: string) => void };
const ToastContext = createContext<ToastApi>({ show: () => {} });

/** `const toast = useToast(); toast.show('Added to watchlist')`: a glass pill above the dock for ~2.6s. */
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const insets = useSafeAreaInsets();

  const show = useCallback((next: string) => {
    clearTimeout(timer.current);
    setMessage(next);
    timer.current = setTimeout(() => setMessage(null), 2600);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {message ? (
        <View pointerEvents="none" style={[styles.wrap, { bottom: insets.bottom + DOCK_CLEARANCE - 8 }]}>
          <Animated.View entering={FadeInDown.duration(300)} exiting={FadeOutDown.duration(200)}>
            <Glass style={styles.toast}>
              <Text accessibilityRole="alert" style={{ fontSize: 13 }}>{message}</Text>
            </Glass>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16, alignItems: 'center', zIndex: 90 },
  toast: { paddingHorizontal: 18, paddingVertical: 11 },
});
