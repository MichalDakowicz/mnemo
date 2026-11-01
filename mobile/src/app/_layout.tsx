import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Dock } from '@/components/layout/Dock';
import { Grain } from '@/components/layout/Grain';
import { ToastProvider } from '@/components/ui/Toast';
import { AuthGate } from '@/features/auth/AuthGate';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { MoviesSync } from '@/features/movies/MoviesSync';
import { queryClient } from '@/lib/queryClient';
import { hydrateSeasonStore } from '@/lib/seasonStore';
import { colors } from '@/theme/colors';
import { fontAssets } from '@/theme/fonts';

void SplashScreen.preventAutoHideAsync();

// Route shapes: title /title/<movie|tv>/<tmdbId>, person /person/<tmdbId>, friend shelf /u/<userId>.
export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontAssets);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    void hydrateSeasonStore().finally(() => setHydrated(true));
  }, []);
  const ready = fontsLoaded && hydrated;
  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);
  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.ground }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AuthGate>
              <ToastProvider>
                <MoviesSync />
                <StatusBar style="light" />
                <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ground }, animation: 'slide_from_right' }}>
                  <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
                </Stack>
                <Dock />
                <Grain />
              </ToastProvider>
            </AuthGate>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
