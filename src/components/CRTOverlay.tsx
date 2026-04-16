import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

/** CRT scanline overlay that sits on top of the entire screen */
export function CRTOverlay() {
  return (
    <View style={styles.container} pointerEvents="none">
      {/* Scanlines */}
      {Array.from({ length: 80 }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.scanline,
            { top: i * 10 },
          ]}
        />
      ))}
      {/* Vignette corners */}
      <View style={styles.vignette} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    overflow: 'hidden',
  },
  scanline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.scanline,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 40,
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: 0,
  },
});
