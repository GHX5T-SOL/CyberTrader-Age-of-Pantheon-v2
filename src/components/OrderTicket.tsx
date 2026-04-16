import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../theme';
import { TerminalButton } from './TerminalButton';
import { Commodity, CONSTANTS } from '../engine/types';

interface Props {
  commodity: Commodity;
  currentPrice: number;
  playerBalance: number;
  ownedQty: number;
  currentInventorySize: number;
  onExecute: (side: 'buy' | 'sell', quantity: number) => void;
}

export function OrderTicket({
  commodity,
  currentPrice,
  playerBalance,
  ownedQty,
  currentInventorySize,
  onExecute,
}: Props) {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState(1);

  const fee = CONSTANTS.TRADE_FEE_PERCENT;
  const maxBuyQty = Math.min(
    Math.floor(playerBalance / (currentPrice * (1 + fee))),
    Math.floor((CONSTANTS.MAX_INVENTORY_SIZE - currentInventorySize) / commodity.size)
  );
  const maxSellQty = ownedQty;
  const maxQty = side === 'buy' ? Math.max(0, maxBuyQty) : maxSellQty;

  const totalCost = quantity * currentPrice;
  const feeAmount = totalCost * fee;
  const total = side === 'buy' ? totalCost + feeAmount : totalCost - feeAmount;
  const inventoryImpact = quantity * commodity.size;

  const adjustQty = (delta: number) => {
    setQuantity((q) => Math.max(1, Math.min(maxQty, q + delta)));
  };

  const setPercent = (pct: number) => {
    setQuantity(Math.max(1, Math.floor(maxQty * pct)));
  };

  return (
    <View style={styles.container}>
      {/* Side toggle */}
      <View style={styles.sideToggle}>
        <Pressable
          style={[styles.sideBtn, side === 'buy' && styles.sideBuyActive]}
          onPress={() => { setSide('buy'); setQuantity(1); }}
        >
          <Text style={[styles.sideText, side === 'buy' && styles.sideBuyText]}>BUY</Text>
        </Pressable>
        <Pressable
          style={[styles.sideBtn, side === 'sell' && styles.sideSellActive]}
          onPress={() => { setSide('sell'); setQuantity(1); }}
        >
          <Text style={[styles.sideText, side === 'sell' && styles.sideSellText]}>SELL</Text>
        </Pressable>
      </View>

      {/* Commodity info */}
      <Text style={styles.commodityLabel}>
        {commodity.ticker} @ {currentPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} 0BOL
      </Text>

      {/* Quantity controls */}
      <View style={styles.qtyRow}>
        <Pressable style={styles.qtyBtn} onPress={() => adjustQty(-10)}>
          <Text style={styles.qtyBtnText}>-10</Text>
        </Pressable>
        <Pressable style={styles.qtyBtn} onPress={() => adjustQty(-1)}>
          <Text style={styles.qtyBtnText}>-1</Text>
        </Pressable>
        <View style={styles.qtyDisplay}>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <Text style={styles.qtyMax}>/ {maxQty}</Text>
        </View>
        <Pressable style={styles.qtyBtn} onPress={() => adjustQty(1)}>
          <Text style={styles.qtyBtnText}>+1</Text>
        </Pressable>
        <Pressable style={styles.qtyBtn} onPress={() => adjustQty(10)}>
          <Text style={styles.qtyBtnText}>+10</Text>
        </Pressable>
      </View>

      {/* Percentage shortcuts */}
      <View style={styles.percentRow}>
        {[0.25, 0.5, 0.75, 1].map((pct) => (
          <Pressable key={pct} style={styles.percentBtn} onPress={() => setPercent(pct)}>
            <Text style={styles.percentText}>{pct * 100}%</Text>
          </Pressable>
        ))}
      </View>

      {/* Order summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} 0BOL</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Fee ({(fee * 100).toFixed(0)}%)</Text>
          <Text style={styles.summaryValue}>{feeAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} 0BOL</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={[styles.summaryValue, { color: side === 'buy' ? COLORS.red : COLORS.green }]}>
            {side === 'buy' ? '-' : '+'}{total.toLocaleString(undefined, { maximumFractionDigits: 0 })} 0BOL
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Storage</Text>
          <Text style={styles.summaryValue}>
            {side === 'buy' ? '+' : '-'}{inventoryImpact} / {CONSTANTS.MAX_INVENTORY_SIZE - currentInventorySize} free
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Heat Risk</Text>
          <Text style={[styles.summaryValue, { color: COLORS.amber }]}>
            +{(quantity * commodity.heatRisk * (side === 'buy' ? 2 : 1.5)).toFixed(1)}
          </Text>
        </View>
      </View>

      {/* Execute button */}
      <TerminalButton
        title={`${side === 'buy' ? 'BUY' : 'SELL'} ${quantity} ${commodity.ticker}`}
        onPress={() => onExecute(side, quantity)}
        variant={side === 'buy' ? 'primary' : 'danger'}
        size="lg"
        disabled={quantity <= 0 || quantity > maxQty}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
    borderRadius: 4,
    backgroundColor: COLORS.darkPanel,
  },
  sideToggle: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  sideBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
  },
  sideBuyActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderColor: COLORS.cyan,
  },
  sideSellActive: {
    backgroundColor: 'rgba(255, 23, 68, 0.1)',
    borderColor: COLORS.red,
  },
  sideText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.textDim,
    letterSpacing: 2,
  },
  sideBuyText: {
    color: COLORS.cyan,
  },
  sideSellText: {
    color: COLORS.red,
  },
  commodityLabel: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  qtyBtn: {
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
    borderRadius: 2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    minWidth: 40,
    alignItems: 'center',
  },
  qtyBtnText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  qtyDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    minWidth: 70,
    justifyContent: 'center',
  },
  qtyValue: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xl,
    color: COLORS.textPrimary,
  },
  qtyMax: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
    marginLeft: 4,
  },
  percentRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  percentBtn: {
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
    borderRadius: 2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  percentText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
  },
  summary: {
    marginBottom: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.panelBorder,
    paddingTop: SPACING.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
});
