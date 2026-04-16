import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { COLORS, FONTS } from '../theme';

interface Props {
  text: string;
  style?: TextStyle;
  glitchIntensity?: number; // 0-1
  active?: boolean;
}

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:<>?/~`░▒▓█▄▀■□▪▫';

export function GlitchText({ text, style, glitchIntensity = 0.3, active = true }: Props) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (!active) {
      setDisplayText(text);
      return;
    }

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // Glitch frame
        const chars = text.split('');
        const numGlitches = Math.floor(chars.length * glitchIntensity * Math.random());
        for (let i = 0; i < numGlitches; i++) {
          const idx = Math.floor(Math.random() * chars.length);
          chars[idx] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }
        setDisplayText(chars.join(''));
      } else {
        setDisplayText(text);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [text, glitchIntensity, active]);

  return (
    <Text style={[styles.text, style]}>
      {displayText}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: FONTS.mono,
    color: COLORS.terminalGreen,
  },
});
