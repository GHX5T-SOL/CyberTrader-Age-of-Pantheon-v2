import React, { useEffect, useState, useRef } from 'react';
import { Text, TextStyle } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../theme';

interface Props {
  text: string;
  style?: TextStyle;
  speed?: number; // ms per character
  onComplete?: () => void;
  showCursor?: boolean;
  instant?: boolean;
}

export function TerminalText({
  text,
  style,
  speed = 30,
  onComplete,
  showCursor = true,
  instant = false,
}: Props) {
  const [displayed, setDisplayed] = useState(instant ? text : '');
  const [cursorVisible, setCursorVisible] = useState(true);
  const indexRef = useRef(0);

  useEffect(() => {
    if (instant) {
      setDisplayed(text);
      onComplete?.();
      return;
    }

    indexRef.current = 0;
    setDisplayed('');

    const interval = setInterval(() => {
      indexRef.current++;
      if (indexRef.current > text.length) {
        clearInterval(interval);
        onComplete?.();
        return;
      }
      setDisplayed(text.slice(0, indexRef.current));
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, instant]);

  useEffect(() => {
    if (!showCursor) return;
    const blink = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);
    return () => clearInterval(blink);
  }, [showCursor]);

  return (
    <Text
      style={[
        {
          fontFamily: FONTS.mono,
          color: COLORS.terminalGreen,
          fontSize: FONT_SIZES.md,
        },
        style,
      ]}
    >
      {displayed}
      {showCursor && (
        <Text style={{ opacity: cursorVisible ? 1 : 0 }}>█</Text>
      )}
    </Text>
  );
}
