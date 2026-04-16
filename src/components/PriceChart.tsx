import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Polyline, Line, Rect, Circle, G } from 'react-native-svg';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../theme';
import { PricePoint, MarketNews } from '../engine/types';

interface Props {
  priceHistory: PricePoint[];
  activeNews: MarketNews[];
  commodityId: string;
  ticker: string;
}

export function PriceChart({ priceHistory, activeNews, commodityId, ticker }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = Math.min(screenWidth - SPACING.lg * 2, 500);
  const chartHeight = 180;
  const padding = { top: 20, right: 50, bottom: 25, left: 10 };
  const plotW = chartWidth - padding.left - padding.right;
  const plotH = chartHeight - padding.top - padding.bottom;

  if (priceHistory.length < 2) {
    return (
      <View style={[styles.container, { width: chartWidth, height: chartHeight }]}>
        <Text style={styles.waitingText}>Awaiting market data...</Text>
      </View>
    );
  }

  const prices = priceHistory.map((p) => p.price);
  const min = Math.min(...prices) * 0.98;
  const max = Math.max(...prices) * 1.02;
  const range = max - min || 1;

  const currentPrice = prices[prices.length - 1];
  const startPrice = prices[0];
  const isUp = currentPrice >= startPrice;
  const lineColor = isUp ? COLORS.green : COLORS.red;
  const changePercent = ((currentPrice - startPrice) / startPrice * 100).toFixed(2);

  // Build polyline points
  const points = priceHistory
    .map((p, i) => {
      const x = padding.left + (i / (priceHistory.length - 1)) * plotW;
      const y = padding.top + plotH - ((p.price - min) / range) * plotH;
      return `${x},${y}`;
    })
    .join(' ');

  // Event markers on chart
  const newsMarkers = activeNews
    .filter((n) => n.affectedTickers.includes(commodityId))
    .map((n) => {
      const tickIndex = priceHistory.findIndex((p) => p.tick >= n.createdAtTick);
      if (tickIndex < 0) return null;
      const x = padding.left + (tickIndex / (priceHistory.length - 1)) * plotW;
      const y = padding.top + 8;
      return { x, y, direction: n.direction, id: n.id };
    })
    .filter(Boolean);

  // Price gridlines
  const gridLines = 4;
  const gridPrices = Array.from({ length: gridLines }, (_, i) => {
    return min + (range * (i + 1)) / (gridLines + 1);
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.ticker}>{ticker}</Text>
        <Text style={[styles.price, { color: lineColor }]}>
          {currentPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} 0BOL
        </Text>
        <Text style={[styles.change, { color: lineColor }]}>
          {isUp ? '▲' : '▼'} {changePercent}%
        </Text>
      </View>

      {/* Chart */}
      <Svg width={chartWidth} height={chartHeight}>
        {/* Grid lines */}
        {gridPrices.map((price, i) => {
          const y = padding.top + plotH - ((price - min) / range) * plotH;
          return (
            <G key={i}>
              <Line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke={COLORS.panelBorder}
                strokeWidth={0.5}
                strokeDasharray="4,4"
              />
            </G>
          );
        })}

        {/* Price line */}
        <Polyline
          points={points}
          fill="none"
          stroke={lineColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Current price dot */}
        <Circle
          cx={padding.left + plotW}
          cy={padding.top + plotH - ((currentPrice - min) / range) * plotH}
          r={4}
          fill={lineColor}
        />

        {/* Current price label */}
        <Rect
          x={chartWidth - padding.right + 4}
          y={padding.top + plotH - ((currentPrice - min) / range) * plotH - 8}
          width={45}
          height={16}
          rx={2}
          fill={lineColor}
          opacity={0.2}
        />

        {/* News event markers */}
        {newsMarkers.map((m) =>
          m ? (
            <G key={m.id}>
              <Circle
                cx={m.x}
                cy={m.y}
                r={5}
                fill={m.direction === 'up' ? COLORS.green : m.direction === 'down' ? COLORS.red : COLORS.amber}
                opacity={0.7}
              />
              <Line
                x1={m.x}
                y1={m.y + 5}
                x2={m.x}
                y2={chartHeight - padding.bottom}
                stroke={COLORS.panelBorder}
                strokeWidth={0.5}
                strokeDasharray="2,2"
              />
            </G>
          ) : null
        )}
      </Svg>

      {/* Price labels */}
      <View style={[styles.priceLabels, { right: 0, top: padding.top }]}>
        {gridPrices.map((price, i) => {
          const y = plotH - ((price - min) / range) * plotH - 6;
          return (
            <Text
              key={i}
              style={[styles.gridLabel, { position: 'absolute', top: y, right: 2 }]}
            >
              {price >= 1000 ? `${(price / 1000).toFixed(1)}k` : price.toFixed(0)}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  ticker: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.lg,
    color: COLORS.cyan,
    fontWeight: 'bold',
  },
  price: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
  },
  change: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
  },
  waitingText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textDim,
    textAlign: 'center',
    marginTop: 60,
  },
  priceLabels: {
    position: 'absolute',
    width: 45,
  },
  gridLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: COLORS.textDim,
    textAlign: 'right',
  },
});
