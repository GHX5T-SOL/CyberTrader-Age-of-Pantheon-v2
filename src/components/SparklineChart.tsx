import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { COLORS } from '../theme';

interface Props {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  style?: ViewStyle;
}

export function SparklineChart({
  data,
  width = 60,
  height = 24,
  color,
  style,
}: Props) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Determine color from trend
  const isUp = data[data.length - 1] >= data[0];
  const lineColor = color ?? (isUp ? COLORS.green : COLORS.red);

  const padding = 2;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;

  const points = data
    .map((val, i) => {
      const x = padding + (i / (data.length - 1)) * chartW;
      const y = padding + chartH - ((val - min) / range) * chartH;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={[{ width, height }, style]}>
      <Svg width={width} height={height}>
        <Polyline
          points={points}
          fill="none"
          stroke={lineColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}
