import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../src/theme';
import { useGameStore } from '../src/stores/gameStore';

export default function Index() {
  const phase = useGameStore((s) => s.phase);

  useEffect(() => {
    // Route based on game phase
    const timer = setTimeout(() => {
      switch (phase) {
        case 'intro':
          router.replace('/intro');
          break;
        case 'login':
          router.replace('/login');
          break;
        case 'boot':
          router.replace('/boot');
          break;
        case 'playing':
          router.replace('/cyberdeck');
          break;
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [phase]);

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
});
