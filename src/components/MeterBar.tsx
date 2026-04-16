import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../theme';

interface Props {
  label: string;
  value: number;    // 0-1 progress
  valueText: string; // formatted display text
  color: string;
  style?: ViewStyle;
  showWarning?: boolean;
}

export function MeterBar({ label, value, valueText, color, style, showWarning }: Props) {
  const clampedValue = Math.max(0, Math.min(1, value));

  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color }]}>
          {showWarning && '⚠ '}{valueText}
        </Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedValue * 100}%`,
              backgroundColor: color,
            },
          ]}
        />
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((pos) => (
          <View
            key={pos}
            style={[styles.gridLine, { left: `${pos * 100}%` }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  label: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
  },
  track: {
    height: 8,
    backgroundColor: COLORS.darkPanel,
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 1,
    opacity: 0.9,
  },
  gridLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});
