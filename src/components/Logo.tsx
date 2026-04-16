import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line, G, Rect, Polygon } from 'react-native-svg';
import { COLORS } from '../theme';

interface Props {
  size?: number;
  color?: string;
}

/**
 * CyberTrader Logo: Fractured AI Eye with terminal cursor and circuit halo
 * A stylized eye shape split by a vertical crack, with circuit traces
 * emanating outward like a signal/halo. A blinking cursor sits at the pupil.
 */
export function Logo({ size = 120, color = COLORS.cyan }: Props) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.38; // eye radius

  return (
    <View style={[styles.container, { width: s, height: s }]}>
      <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        {/* Circuit halo - outer ring fragments */}
        <G opacity={0.6}>
          {/* Top arc fragments */}
          <Path
            d={`M ${cx - r * 0.9} ${cy - r * 1.1} A ${r * 1.2} ${r * 1.2} 0 0 1 ${cx - r * 0.3} ${cy - r * 1.25}`}
            stroke={color}
            strokeWidth={1.5}
            fill="none"
          />
          <Path
            d={`M ${cx + r * 0.3} ${cy - r * 1.25} A ${r * 1.2} ${r * 1.2} 0 0 1 ${cx + r * 0.9} ${cy - r * 1.1}`}
            stroke={color}
            strokeWidth={1.5}
            fill="none"
          />
          {/* Bottom arc fragments */}
          <Path
            d={`M ${cx - r * 0.9} ${cy + r * 1.1} A ${r * 1.2} ${r * 1.2} 0 0 0 ${cx - r * 0.3} ${cy + r * 1.25}`}
            stroke={color}
            strokeWidth={1.5}
            fill="none"
          />
          <Path
            d={`M ${cx + r * 0.3} ${cy + r * 1.25} A ${r * 1.2} ${r * 1.2} 0 0 0 ${cx + r * 0.9} ${cy + r * 1.1}`}
            stroke={color}
            strokeWidth={1.5}
            fill="none"
          />
          {/* Circuit nodes */}
          <Circle cx={cx - r * 0.3} cy={cy - r * 1.25} r={2} fill={color} />
          <Circle cx={cx + r * 0.3} cy={cy - r * 1.25} r={2} fill={color} />
          <Circle cx={cx - r * 0.3} cy={cy + r * 1.25} r={2} fill={color} />
          <Circle cx={cx + r * 0.3} cy={cy + r * 1.25} r={2} fill={color} />
        </G>

        {/* Eye outline - almond shape */}
        <Path
          d={`M ${cx - r * 1.2} ${cy}
              Q ${cx - r * 0.5} ${cy - r * 0.9} ${cx} ${cy - r * 0.85}
              Q ${cx + r * 0.5} ${cy - r * 0.9} ${cx + r * 1.2} ${cy}
              Q ${cx + r * 0.5} ${cy + r * 0.9} ${cx} ${cy + r * 0.85}
              Q ${cx - r * 0.5} ${cy + r * 0.9} ${cx - r * 1.2} ${cy} Z`}
          stroke={color}
          strokeWidth={2}
          fill="none"
        />

        {/* Inner iris ring */}
        <Circle
          cx={cx}
          cy={cy}
          r={r * 0.45}
          stroke={color}
          strokeWidth={1.5}
          fill="none"
          opacity={0.8}
        />

        {/* Fracture line - vertical crack through eye */}
        <Line
          x1={cx + r * 0.05}
          y1={cy - r * 0.85}
          x2={cx - r * 0.08}
          y2={cy - r * 0.2}
          stroke={color}
          strokeWidth={2}
          opacity={0.9}
        />
        <Line
          x1={cx - r * 0.08}
          y1={cy - r * 0.2}
          x2={cx + r * 0.12}
          y2={cy + r * 0.15}
          stroke={color}
          strokeWidth={2}
          opacity={0.9}
        />
        <Line
          x1={cx + r * 0.12}
          y1={cy + r * 0.15}
          x2={cx - r * 0.05}
          y2={cy + r * 0.85}
          stroke={color}
          strokeWidth={2}
          opacity={0.9}
        />

        {/* Terminal cursor at pupil center */}
        <Rect
          x={cx - r * 0.08}
          y={cy - r * 0.15}
          width={r * 0.16}
          height={r * 0.3}
          fill={color}
          opacity={0.9}
        />

        {/* Signal rays - pirate broadcast */}
        <G opacity={0.4}>
          <Line x1={cx - r * 1.35} y1={cy - r * 0.3} x2={cx - r * 1.55} y2={cy - r * 0.4} stroke={color} strokeWidth={1} />
          <Line x1={cx - r * 1.35} y1={cy + r * 0.3} x2={cx - r * 1.55} y2={cy + r * 0.4} stroke={color} strokeWidth={1} />
          <Line x1={cx + r * 1.35} y1={cy - r * 0.3} x2={cx + r * 1.55} y2={cy - r * 0.4} stroke={color} strokeWidth={1} />
          <Line x1={cx + r * 1.35} y1={cy + r * 0.3} x2={cx + r * 1.55} y2={cy + r * 0.4} stroke={color} strokeWidth={1} />
        </G>

        {/* Black flag triangle - pirate signal mark */}
        <Polygon
          points={`${cx},${cy - r * 1.5} ${cx - r * 0.15},${cy - r * 1.3} ${cx + r * 0.15},${cy - r * 1.3}`}
          fill={color}
          opacity={0.7}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
