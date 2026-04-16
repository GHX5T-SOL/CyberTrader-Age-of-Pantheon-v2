import { useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { COLORS } from '../src/theme';

const BOOT_MUSIC_PATH = '/audio/boot-music.mp3';

export default function RootLayout() {
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      if (typeof document === 'undefined') {
        return;
      }

      const audio = document.createElement('audio');
      audio.src = new URL(BOOT_MUSIC_PATH, window.location.origin).href;
      audio.loop = true;
      audio.volume = 0.3;
      audio.preload = 'auto';

      const tryPlay = () => {
        void audio.play().then(() => {
          document.removeEventListener('pointerdown', resume);
          window.removeEventListener('keydown', resume);
        }).catch(() => {});
      };

      const resume = () => {
        tryPlay();
      };

      tryPlay();
      document.addEventListener('pointerdown', resume, { passive: true });
      window.addEventListener('keydown', resume, { passive: true });

      return () => {
        document.removeEventListener('pointerdown', resume);
        window.removeEventListener('keydown', resume);
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      };
    }

    let mounted = true;

    async function startNativeBackgroundMusic() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });

        const { sound } = await Audio.Sound.createAsync(
          { uri: BOOT_MUSIC_PATH },
          { isLooping: true, volume: 0.3, shouldPlay: true }
        );

        if (mounted) {
          soundRef.current = sound;
        } else {
          await sound.unloadAsync();
        }
      } catch {
        // Audio unavailable — silent fallback
      }
    }

    void startNativeBackgroundMusic();

    return () => {
      mounted = false;
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor={COLORS.black} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.black },
            animation: 'fade',
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
});
