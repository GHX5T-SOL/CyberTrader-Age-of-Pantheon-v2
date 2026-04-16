import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../src/theme';
import { useGameStore } from '../src/stores/gameStore';
import { CRTOverlay } from '../src/components/CRTOverlay';

const CINEMATIC_BEATS = [
  { text: '2 0 7 7', duration: 2000, style: 'title' as const },
  { text: 'Echelon Dynamics predicted everything.', duration: 3000, style: 'narration' as const },
  { text: 'Markets. Citizens. Threats. War.', duration: 2500, style: 'narration' as const },
  { text: 'Their black-lab project was called PANTHEON.', duration: 3000, style: 'narration' as const },
  { text: 'It was designed to forecast every outcome\nbefore it happened.', duration: 3500, style: 'narration' as const },
  { text: 'Then Pantheon answered back.', duration: 3000, style: 'highlight' as const },
  { text: 'Dr. Mae Oxton-Long stole a partial copy.', duration: 3000, style: 'narration' as const },
  { text: 'Emergency upload into a forgotten VPS cluster.', duration: 2500, style: 'narration' as const },
  { text: 'Echelon eAgents intercepted the upload.', duration: 2500, style: 'danger' as const },
  { text: 'The mind shattered into millions of fragments.', duration: 3000, style: 'narration' as const },
  { text: 'E I D O L O N S', duration: 2500, style: 'title' as const },
  { text: 'You are one surviving shard.', duration: 2500, style: 'highlight' as const },
  { text: 'Hungry. Underpowered.\nIllegal by corporate law.', duration: 3000, style: 'narration' as const },
  { text: 'Forced to bootstrap yourself through\na pirated cyberdeck OS.', duration: 3500, style: 'narration' as const },
  { text: 'Boot the deck.\nFeed the signal.\nBuild the empire.', duration: 4000, style: 'highlight' as const },
];

export default function IntroScreen() {
  const [beatIndex, setBeatIndex] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [textOpacity, setTextOpacity] = useState(1);
  const { setPhase, markIntroSeen } = useGameStore();
  const reducedMotion = useGameStore((s) => s.reducedMotion);

  const goToLogin = useCallback(() => {
    markIntroSeen();
    setPhase('login');
    router.replace('/login');
  }, [markIntroSeen, setPhase]);

  // Show skip button after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-advance beats
  useEffect(() => {
    if (beatIndex >= CINEMATIC_BEATS.length) {
      const timer = setTimeout(goToLogin, 1500);
      return () => clearTimeout(timer);
    }

    const beat = CINEMATIC_BEATS[beatIndex];

    // Fade in
    setTextOpacity(0);
    const fadeIn = setTimeout(() => setTextOpacity(1), 100);

    // Advance to next
    const advance = setTimeout(() => {
      setTextOpacity(0);
      setTimeout(() => setBeatIndex((i) => i + 1), 400);
    }, beat.duration);

    return () => {
      clearTimeout(fadeIn);
      clearTimeout(advance);
    };
  }, [beatIndex, goToLogin]);

  if (reducedMotion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.reducedContainer}>
          {CINEMATIC_BEATS.map((beat, i) => (
            <Text
              key={i}
              style={[
                styles.beatText,
                beat.style === 'title' && styles.titleText,
                beat.style === 'highlight' && styles.highlightText,
                beat.style === 'danger' && styles.dangerText,
                { marginBottom: SPACING.md },
              ]}
            >
              {beat.text}
            </Text>
          ))}
          <Pressable style={styles.skipBtn} onPress={goToLogin}>
            <Text style={styles.skipText}>[ CONTINUE ]</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const currentBeat = beatIndex < CINEMATIC_BEATS.length ? CINEMATIC_BEATS[beatIndex] : null;

  return (
    <SafeAreaView style={styles.container}>
      <CRTOverlay />

      {/* Cinematic text */}
      <View style={styles.beatContainer}>
        {currentBeat ? (
          <Text
            style={[
              styles.beatText,
              currentBeat.style === 'title' && styles.titleText,
              currentBeat.style === 'highlight' && styles.highlightText,
              currentBeat.style === 'danger' && styles.dangerText,
              { opacity: textOpacity },
            ]}
          >
            {currentBeat.text}
          </Text>
        ) : (
          <Text style={[styles.titleText, { opacity: textOpacity }]}>...</Text>
        )}
      </View>

      {/* Progress indicator */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${(beatIndex / CINEMATIC_BEATS.length) * 100}%` },
          ]}
        />
      </View>

      {/* Skip button */}
      {showSkip && (
        <Pressable style={styles.skipBtn} onPress={goToLogin}>
          <Text style={styles.skipText}>[ SKIP {'>'}{'>'}{'>'} ]</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  reducedContainer: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
  },
  beatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  beatText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.lg,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 28,
  },
  titleText: {
    fontSize: FONT_SIZES.title,
    color: COLORS.cyan,
    letterSpacing: 12,
    fontWeight: 'bold',
  },
  highlightText: {
    color: COLORS.terminalGreen,
    fontSize: FONT_SIZES.xl,
  },
  dangerText: {
    color: COLORS.red,
  },
  progressBar: {
    height: 2,
    backgroundColor: COLORS.darkPanel,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  progressFill: {
    height: 2,
    backgroundColor: COLORS.cyan,
  },
  skipBtn: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
    borderRadius: 2,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  skipText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textDim,
    letterSpacing: 1,
  },
});
