import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, Roboto_800ExtraBold } from '@expo-google-fonts/roboto';
import { VesperLibre_900Black } from '@expo-google-fonts/vesper-libre';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SignupProvider } from '@/state/signup';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Roboto_800ExtraBold,
    VesperLibre_900Black,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <SignupProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </SignupProvider>
    </SafeAreaProvider>
  );
}
