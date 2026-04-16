import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../src/theme';
import { usePlayerStore } from '../src/stores/playerStore';
import { useMarketStore } from '../src/stores/marketStore';
import { useTutorialStore } from '../src/stores/tutorialStore';
import { COMMODITIES, getCommodity } from '../src/engine/commodities';
import { totalInventorySize, unrealizedPnl as calcUnrealizedPnl } from '../src/engine/market';
import { calculateCurrentHeat } from '../src/engine/heat';
import { XP_REWARDS } from '../src/engine/rank';
import { PriceChart } from '../src/components/PriceChart';
import { CommodityRow } from '../src/components/CommodityRow';
import { OrderTicket } from '../src/components/OrderTicket';
import { NewsCard } from '../src/components/NewsCard';
import { TutorialOverlay } from '../src/components/TutorialOverlay';

export default function SilkroadScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const [showPositions, setShowPositions] = useState(false);

  const currency = usePlayerStore((s) => s.currency);
  const positions = usePlayerStore((s) => s.positions);
  const resources = usePlayerStore((s) => s.resources);
  const executeTradeOrder = usePlayerStore((s) => s.executeTradeOrder);
  const addNotification = usePlayerStore((s) => s.addNotification);
  const addXp = usePlayerStore((s) => s.addXp);
  const totalTradeCount = usePlayerStore((s) => s.totalTradeCount);

  const prices = useMarketStore((s) => s.prices);
  const priceHistory = useMarketStore((s) => s.priceHistory);
  const activeNews = useMarketStore((s) => s.activeNews);
  const tick = useMarketStore((s) => s.tick);
  const selectedCommodityId = useMarketStore((s) => s.selectedCommodityId);
  const selectCommodity = useMarketStore((s) => s.selectCommodity);

  const tutorialActive = useTutorialStore((s) => s.isActive);
  const advanceIfAction = useTutorialStore((s) => s.advanceIfAction);
  const tutorialComplete = useTutorialStore((s) => s.isComplete);
  const completeTutorial = useTutorialStore((s) => s.completeTutorial);

  const selectedCommodity = getCommodity(selectedCommodityId);
  const currentPrice = prices[selectedCommodityId] ?? selectedCommodity.basePrice;
  const heat = calculateCurrentHeat(resources.heat, resources.heatLastUpdate);
  const invSize = totalInventorySize(positions);
  const ownedQty = positions.find((p) => p.commodityId === selectedCommodityId)?.quantity ?? 0;

  // Total unrealized PnL
  const totalUnrealized = positions.reduce((sum, p) => {
    const price = prices[p.commodityId] ?? 0;
    return sum + calcUnrealizedPnl(p, price);
  }, 0);

  const handleExecute = useCallback((side: 'buy' | 'sell', quantity: number) => {
    const result = executeTradeOrder(selectedCommodityId, side, quantity, currentPrice);

    if (result.success) {
      addNotification({
        type: 'trade',
        title: `${side.toUpperCase()} ${selectedCommodity.ticker}`,
        body: result.message,
      });

      // Tutorial advancement
      if (side === 'buy') {
        advanceIfAction('execute-buy');
      } else {
        advanceIfAction('execute-sell');
      }

      // First trade XP bonus
      if (totalTradeCount === 0) {
        addXp(XP_REWARDS.FIRST_TRADE);
      }

      // Complete tutorial after first sell
      if (side === 'sell' && !tutorialComplete) {
        addXp(XP_REWARDS.TUTORIAL_COMPLETE);
        completeTutorial();
        addNotification({
          type: 'system',
          title: 'Tutorial Complete',
          body: `+${XP_REWARDS.TUTORIAL_COMPLETE} XP earned! Keep trading to rank up.`,
        });
      }
    } else {
      addNotification({
        type: 'system',
        title: 'Trade Failed',
        body: result.message,
      });
    }
  }, [selectedCommodityId, currentPrice, executeTradeOrder, addNotification, advanceIfAction, totalTradeCount, addXp, tutorialComplete, completeTutorial, selectedCommodity.ticker]);

  const handleSelectCommodity = useCallback((id: string) => {
    selectCommodity(id);
    advanceIfAction('select-commodity');
  }, [selectCommodity, advanceIfAction]);

  // Mobile layout
  const renderMobileLayout = () => (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      {/* Chart */}
      <View style={styles.chartSection}>
        <PriceChart
          priceHistory={priceHistory[selectedCommodityId] ?? []}
          activeNews={activeNews}
          commodityId={selectedCommodityId}
          ticker={selectedCommodity.ticker}
        />
      </View>

      {/* Market list */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MARKET</Text>
        {COMMODITIES.map((c) => {
          const history = priceHistory[c.id] ?? [];
          const historyPrices = history.map((h) => h.price);
          const price = prices[c.id] ?? c.basePrice;
          const prevPrice = history.length >= 2 ? history[history.length - 2].price : price;
          const change = prevPrice > 0 ? ((price - prevPrice) / prevPrice) * 100 : 0;
          const owned = positions.find((p) => p.commodityId === c.id)?.quantity ?? 0;

          return (
            <CommodityRow
              key={c.id}
              commodity={c}
              price={price}
              priceHistory={historyPrices.slice(-15)}
              changePercent={change}
              ownedQty={owned}
              isSelected={c.id === selectedCommodityId}
              onPress={() => handleSelectCommodity(c.id)}
            />
          );
        })}
      </View>

      {/* Order ticket */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ORDER TICKET</Text>
        <OrderTicket
          commodity={selectedCommodity}
          currentPrice={currentPrice}
          playerBalance={currency.zeroBol}
          ownedQty={ownedQty}
          currentInventorySize={invSize}
          onExecute={handleExecute}
        />
      </View>

      {/* Positions */}
      {positions.length > 0 && (
        <View style={styles.section}>
          <Pressable
            style={styles.sectionHeader}
            onPress={() => setShowPositions(!showPositions)}
          >
            <Text style={styles.sectionTitle}>
              POSITIONS ({positions.length})
            </Text>
            <Text style={styles.toggleText}>
              {showPositions ? '▼' : '▶'}
            </Text>
          </Pressable>
          {showPositions && positions.map((pos) => {
            const c = getCommodity(pos.commodityId);
            const price = prices[pos.commodityId] ?? 0;
            const pnl = calcUnrealizedPnl(pos, price);
            const pnlPct = pos.averageEntry > 0 ? (pnl / (pos.averageEntry * pos.quantity)) * 100 : 0;

            return (
              <Pressable
                key={pos.commodityId}
                style={styles.positionRow}
                onPress={() => handleSelectCommodity(pos.commodityId)}
              >
                <View style={styles.posLeft}>
                  <Text style={styles.posTicker}>{c.ticker}</Text>
                  <Text style={styles.posQty}>×{pos.quantity}</Text>
                </View>
                <View style={styles.posCenter}>
                  <Text style={styles.posEntry}>Entry: {pos.averageEntry.toFixed(0)}</Text>
                  <Text style={styles.posCurrent}>Now: {price.toFixed(0)}</Text>
                </View>
                <View style={styles.posRight}>
                  <Text style={[styles.posPnl, { color: pnl >= 0 ? COLORS.green : COLORS.red }]}>
                    {pnl >= 0 ? '+' : ''}{pnl.toFixed(0)}
                  </Text>
                  <Text style={[styles.posPnlPct, { color: pnl >= 0 ? COLORS.green : COLORS.red }]}>
                    {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}%
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* News feed */}
      {activeNews.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NEWS FEED</Text>
          {activeNews.map((n) => (
            <NewsCard key={n.id} news={n} currentTick={tick} />
          ))}
        </View>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top strip */}
      <View style={styles.topStrip}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'<'} DECK</Text>
        </Pressable>
        <Text style={styles.stripTitle}>S1LKROAD 4.0</Text>
        <View style={styles.stripRight}>
          <Text style={styles.stripTick}>T:{tick}</Text>
          <Text style={styles.stripBalance}>
            {currency.zeroBol.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>HEAT</Text>
          <Text style={[styles.statValue, { color: heat > 50 ? COLORS.red : COLORS.textSecondary }]}>
            {Math.round(heat)}%
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>POSITIONS</Text>
          <Text style={styles.statValue}>{positions.length}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>UNRLZD P&L</Text>
          <Text style={[styles.statValue, { color: totalUnrealized >= 0 ? COLORS.green : COLORS.red }]}>
            {totalUnrealized >= 0 ? '+' : ''}{Math.round(totalUnrealized).toLocaleString()}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>INV</Text>
          <Text style={styles.statValue}>{invSize}/500</Text>
        </View>
      </View>

      {renderMobileLayout()}

      {tutorialActive && <TutorialOverlay />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  topStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.panelBorder,
  },
  backBtn: {
    paddingVertical: SPACING.xs,
    paddingRight: SPACING.md,
    minWidth: 60,
    minHeight: 44,
    justifyContent: 'center',
  },
  backText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.cyan,
  },
  stripTitle: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.amber,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  stripRight: {
    alignItems: 'flex-end',
  },
  stripTick: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.textDim,
  },
  stripBalance: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.green,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.panelBorder,
    backgroundColor: COLORS.darkPanel,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: COLORS.textDim,
    letterSpacing: 1,
  },
  statValue: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  chartSection: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.panelBorder,
  },
  section: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.panelBorder,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  toggleText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
  },
  positionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.panelBorder,
  },
  posLeft: {
    flex: 1,
  },
  posTicker: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  posQty: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
  },
  posCenter: {
    flex: 1,
    alignItems: 'center',
  },
  posEntry: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
  },
  posCurrent: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  posRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  posPnl: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
  },
  posPnlPct: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
  },
});
