import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function TerminalButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
  textStyle,
}: Props) {
  const variantStyles = VARIANT_STYLES[variant];
  const sizeStyles = SIZE_STYLES[size];

  const handlePress = () => {
    if (disabled) return;
    // Haptic feedback on native
    if (Platform.OS !== 'web') {
      try {
        const Haptics = require('expo-haptics');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles.container,
        sizeStyles.container,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          variantStyles.text,
          sizeStyles.text,
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {`[ ${title.toUpperCase()} ]`}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 2,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.3,
  },
  text: {
    fontFamily: FONTS.mono,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  disabledText: {
    color: COLORS.textDim,
  },
});

const VARIANT_STYLES = {
  primary: {
    container: {
      borderColor: COLORS.cyan,
      backgroundColor: 'rgba(0, 229, 255, 0.08)',
    } as ViewStyle,
    text: {
      color: COLORS.cyan,
    } as TextStyle,
  },
  secondary: {
    container: {
      borderColor: COLORS.terminalGreen,
      backgroundColor: 'rgba(0, 255, 65, 0.05)',
    } as ViewStyle,
    text: {
      color: COLORS.terminalGreen,
    } as TextStyle,
  },
  danger: {
    container: {
      borderColor: COLORS.red,
      backgroundColor: 'rgba(255, 23, 68, 0.08)',
    } as ViewStyle,
    text: {
      color: COLORS.red,
    } as TextStyle,
  },
  ghost: {
    container: {
      borderColor: COLORS.panelBorder,
      backgroundColor: 'transparent',
    } as ViewStyle,
    text: {
      color: COLORS.textSecondary,
    } as TextStyle,
  },
};

const SIZE_STYLES = {
  sm: {
    container: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.xs,
      minHeight: 32,
    } as ViewStyle,
    text: {
      fontSize: FONT_SIZES.xs,
    } as TextStyle,
  },
  md: {
    container: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.sm,
      minHeight: 44,
    } as ViewStyle,
    text: {
      fontSize: FONT_SIZES.sm,
    } as TextStyle,
  },
  lg: {
    container: {
      paddingHorizontal: SPACING.xl,
      paddingVertical: SPACING.md,
      minHeight: 52,
    } as ViewStyle,
    text: {
      fontSize: FONT_SIZES.lg,
    } as TextStyle,
  },
};
