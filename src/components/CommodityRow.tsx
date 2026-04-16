import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../theme';
import { SparklineChart } from './SparklineChart';
import { Commodity } from '../engine/types';

interface Props {
  commodity: Commodity;
  price: number;
  priceHistory: number[];
  changePercent: number;
  ownedQty: number;
  isSelected: boolean;
  onPress: () => void;
}

export function CommodityRow({
  commodity,
  price,
  priceHistory,
  changePercent,
  ownedQty,
  isSelected,
  onPress,
}: Props) {
  const isUp = changePercent >= 0;
  const changeColor = isUp ? COLORS.green : COLORS.red;

  return (
    <Pressable
      style={[styles.container, isSelected && styles.selected]}
      onPress={onPress}
    >
      <View style={styles.left}>
        <Text style={styles.ticker}>{commodity.ticker}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {commodity.name}
        </Text>
      </View>

      <View style={styles.sparkContainer}>
        <SparklineChart data={priceHistory} width={50} height={20} />
      </View>

      <View style={styles.right}>
        <Text style={styles.price}>
          {price >= 1000
            ? `${(price / 1000).toFixed(1)}k`
            : price.toFixed(0)}
        </Text>
        <Text style={[styles.change, { color: changeColor }]}>
          {isUp ? '+' : ''}{changePercent.toFixed(1)}%
        </Text>
      </View>

      {ownedQty > 0 && (
        <View style={styles.ownedBadge}>
          <Text style={styles.ownedText}>{ownedQty}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.panelBorder,
    minHeight: 48,
  },
  selected: {
    backgroundColor: COLORS.cyanGlow,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.cyan,
  },
  left: {
    flex: 1,
    minWidth: 80,
  },
  ticker: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  name: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
  },
  sparkContainer: {
    marginHorizontal: SPACING.sm,
  },
  right: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  price: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
  },
  change: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
  },
  ownedBadge: {
    marginLeft: SPACING.sm,
    backgroundColor: COLORS.cyanDim,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  ownedText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.cyan,
  },
});
