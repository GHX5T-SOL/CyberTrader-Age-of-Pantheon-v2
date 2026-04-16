import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../theme';
import { useTutorialStore } from '../stores/tutorialStore';

export function TutorialOverlay() {
  const { getCurrentStep, nextStep, skipTutorial, isActive, currentStepIndex, steps } =
    useTutorialStore();

  const step = getCurrentStep();
  if (!isActive || !step) return null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.label}>
            TUTORIAL [{currentStepIndex + 1}/{steps.length}]
          </Text>
          <Pressable onPress={skipTutorial}>
            <Text style={styles.skipText}>[ SKIP ]</Text>
          </Pressable>
        </View>

        <Text style={styles.message}>{step.message}</Text>

        <View style={styles.actions}>
          {!step.action && (
            <Pressable style={styles.nextBtn} onPress={nextStep}>
              <Text style={styles.nextText}>[ CONTINUE ]</Text>
            </Pressable>
          )}
          {step.action && (
            <Text style={styles.actionHint}>
              {'>'} Complete the action above to continue
            </Text>
          )}
        </View>

        {/* Progress dots */}
        <View style={styles.dots}>
          {steps.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentStepIndex && styles.dotActive,
                i < currentStepIndex && styles.dotComplete,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
    zIndex: 100,
  },
  card: {
    backgroundColor: 'rgba(10, 18, 10, 0.95)',
    borderWidth: 1,
    borderColor: COLORS.cyan,
    borderRadius: 6,
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  label: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.cyan,
    letterSpacing: 1,
  },
  skipText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
  },
  message: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  actions: {
    marginBottom: SPACING.sm,
  },
  nextBtn: {
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: COLORS.cyan,
    borderRadius: 2,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  nextText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.cyan,
    letterSpacing: 1,
  },
  actionHint: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.amber,
    fontStyle: 'italic',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.panelBorder,
  },
  dotActive: {
    backgroundColor: COLORS.cyan,
  },
  dotComplete: {
    backgroundColor: COLORS.cyanDim,
  },
});
