import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../src/theme';
import { usePlayerStore } from '../src/stores/playerStore';
import { useMarketStore } from '../src/stores/marketStore';
import { getCommodity } from '../src/engine/commodities';
import { totalInventorySize, unrealizedPnl } from '../src/engine/market';
import { CONSTANTS } from '../src/engine/types';
import { MeterBar } from '../src/components/MeterBar';
import { TerminalButton } from '../src/components/TerminalButton';

export default function InventoryScreen() {
  const positions = usePlayerStore((s) => s.positions);
  const prices = useMarketStore((s) => s.prices);
  const invSize = totalInventorySize(positions);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TerminalButton title="< BACK" onPress={() => router.back()} variant="ghost" size="sm" />
        <Text style={styles.headerTitle}>INVENTORY</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <MeterBar
            label="STORAGE CAPACITY"
            value={invSize / CONSTANTS.MAX_INVENTORY_SIZE}
            valueText={`${invSize} / ${CONSTANTS.MAX_INVENTORY_SIZE}`}
            color={invSize > 400 ? COLORS.amber : COLORS.cyan}
          />
        </View>

        {positions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{'>'} INVENTORY EMPTY</Text>
            <Text style={styles.emptyHint}>Trade on S1LKROAD 4.0 to acquire commodities.</Text>
          </View>
        ) : (
          positions.map((pos) => {
            const c = getCommodity(pos.commodityId);
            const price = prices[pos.commodityId] ?? 0;
            const pnl = unrealizedPnl(pos, price);
            const storageUsed = pos.quantity * c.size;

            return (
              <View key={pos.commodityId} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTicker}>{c.ticker}</Text>
                  <Text style={styles.itemName}>{c.name}</Text>
                </View>
                <Text style={styles.itemLore}>{c.lore}</Text>
                <View style={styles.itemStats}>
                  <Stat label="QTY" value={`${pos.quantity}`} />
                  <Stat label="AVG ENTRY" value={`${pos.averageEntry.toFixed(0)}`} />
                  <Stat label="CURRENT" value={`${price.toFixed(0)}`} />
                  <Stat label="P&L" value={`${pnl >= 0 ? '+' : ''}${pnl.toFixed(0)}`} color={pnl >= 0 ? COLORS.green : COLORS.red} />
                  <Stat label="STORAGE" value={`${storageUsed}`} />
                  <Stat label="RARITY" value={c.rarity.toUpperCase()} color={c.rarity === 'legendary' ? COLORS.amber : c.rarity === 'rare' ? COLORS.violet : COLORS.textSecondary} />
                </View>
                {pos.realizedPnl !== 0 && (
                  <Text style={[styles.realizedPnl, { color: pos.realizedPnl >= 0 ? COLORS.green : COLORS.red }]}>
                    Realized: {pos.realizedPnl >= 0 ? '+' : ''}{pos.realizedPnl.toFixed(0)} 0BOL
                  </Text>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, color ? { color } : null]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.panelBorder },
  headerTitle: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.md, color: COLORS.cyan, letterSpacing: 2 },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  section: { borderWidth: 1, borderColor: COLORS.panelBorder, borderRadius: 4, padding: SPACING.md, marginBottom: SPACING.md, backgroundColor: COLORS.darkPanel },
  emptyState: { alignItems: 'center', paddingVertical: SPACING.xxl },
  emptyText: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.lg, color: COLORS.textDim },
  emptyHint: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.textDim, marginTop: SPACING.sm },
  itemCard: { borderWidth: 1, borderColor: COLORS.panelBorder, borderRadius: 4, padding: SPACING.md, marginBottom: SPACING.md, backgroundColor: COLORS.darkPanel },
  itemHeader: { flexDirection: 'row', alignItems: 'baseline', gap: SPACING.sm, marginBottom: 4 },
  itemTicker: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.lg, color: COLORS.cyan, fontWeight: 'bold' },
  itemName: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  itemLore: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.textDim, fontStyle: 'italic', marginBottom: SPACING.sm },
  itemStats: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  stat: { minWidth: 70 },
  statLabel: { fontFamily: FONTS.mono, fontSize: 8, color: COLORS.textDim, letterSpacing: 1 },
  statValue: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.sm, color: COLORS.textPrimary },
  realizedPnl: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, marginTop: SPACING.sm },
});
