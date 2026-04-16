import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, useWindowDimensions,
} from 'react-native';
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
import { SparklineChart } from '../src/components/SparklineChart';
import { NewsCard } from '../src/components/NewsCard';
import { TutorialOverlay } from '../src/components/TutorialOverlay';
import { CONSTANTS } from '../src/engine/types';

export default function SilkroadScreen() {
  const { width } = useWindowDimensions();
  const [quantity, setQuantity] = useState(1);

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
  const currentPosition = positions.find((p) => p.commodityId === selectedCommodityId);

  // Price change
  const history = priceHistory[selectedCommodityId] ?? [];
  const prevPrice = history.length >= 2 ? history[history.length - 2].price : currentPrice;
  const priceChange = prevPrice > 0 ? ((currentPrice - prevPrice) / prevPrice) * 100 : 0;
  const isUp = priceChange >= 0;

  // Total unrealized PnL
  const totalUnrealized = positions.reduce((sum, p) => {
    const price = prices[p.commodityId] ?? 0;
    return sum + calcUnrealizedPnl(p, price);
  }, 0);

  // Selected position PnL
  const selectedPnl = currentPosition ? calcUnrealizedPnl(currentPosition, currentPrice) : 0;

  // Max quantities
  const fee = CONSTANTS.TRADE_FEE_PERCENT;
  const maxBuyQty = Math.max(0, Math.min(
    Math.floor(currency.zeroBol / (currentPrice * (1 + fee))),
    Math.floor((CONSTANTS.MAX_INVENTORY_SIZE - invSize) / selectedCommodity.size)
  ));
  const maxSellQty = ownedQty;

  const adjustQty = (delta: number) => {
    setQuantity((q) => Math.max(1, q + delta));
  };

  const handleExecute = useCallback((side: 'buy' | 'sell') => {
    const result = executeTradeOrder(selectedCommodityId, side, quantity, currentPrice);

    if (result.success) {
      addNotification({
        type: 'trade',
        title: `${side.toUpperCase()} ${selectedCommodity.ticker}`,
        body: result.message,
      });

      if (side === 'buy') advanceIfAction('execute-buy');
      else advanceIfAction('execute-sell');

      if (totalTradeCount === 0) addXp(XP_REWARDS.FIRST_TRADE);

      if (side === 'sell' && !tutorialComplete) {
        addXp(XP_REWARDS.TUTORIAL_COMPLETE);
        completeTutorial();
        addNotification({
          type: 'system',
          title: 'Tutorial Complete',
          body: `+${XP_REWARDS.TUTORIAL_COMPLETE} XP earned!`,
        });
      }

      setQuantity(1);
    } else {
      addNotification({ type: 'system', title: 'Trade Failed', body: result.message });
    }
  }, [selectedCommodityId, currentPrice, quantity, executeTradeOrder, addNotification, advanceIfAction, totalTradeCount, addXp, tutorialComplete, completeTutorial, selectedCommodity.ticker]);

  const handleSelectCommodity = useCallback((id: string) => {
    selectCommodity(id);
    advanceIfAction('select-commodity');
    setQuantity(1);
  }, [selectCommodity, advanceIfAction]);

  const totalCost = quantity * currentPrice;
  const feeAmount = totalCost * fee;

  return (
    <SafeAreaView style={styles.container}>
      {/* === TOP BAR === */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'<'} DECK</Text>
        </Pressable>
        <Text style={styles.title}>S1LKROAD 4.0</Text>
        <View style={styles.balanceBox}>
          <Text style={styles.balanceLabel}>BAL</Text>
          <Text style={styles.balanceValue}>
            {currency.zeroBol >= 1000000
              ? `${(currency.zeroBol / 1000000).toFixed(2)}M`
              : currency.zeroBol >= 1000
              ? `${(currency.zeroBol / 1000).toFixed(1)}k`
              : currency.zeroBol.toFixed(0)}
          </Text>
        </View>
      </View>

      {/* === FLOATING PNL BAR === */}
      <View style={styles.pnlBar}>
        <View style={styles.pnlItem}>
          <Text style={styles.pnlLabel}>UNRLZD P&L</Text>
          <Text style={[styles.pnlValue, { color: totalUnrealized >= 0 ? COLORS.green : COLORS.red }]}>
            {totalUnrealized >= 0 ? '+' : ''}{Math.round(totalUnrealized).toLocaleString()}
          </Text>
        </View>
        <View style={styles.pnlDivider} />
        <View style={styles.pnlItem}>
          <Text style={styles.pnlLabel}>POSITIONS</Text>
          <Text style={styles.pnlValue}>{positions.length}</Text>
        </View>
        <View style={styles.pnlDivider} />
        <View style={styles.pnlItem}>
          <Text style={styles.pnlLabel}>HEAT</Text>
          <Text style={[styles.pnlValue, { color: heat > 50 ? COLORS.red : heat > 25 ? COLORS.amber : COLORS.textSecondary }]}>
            {Math.round(heat)}%
          </Text>
        </View>
        <View style={styles.pnlDivider} />
        <View style={styles.pnlItem}>
          <Text style={styles.pnlLabel}>TICK</Text>
          <Text style={styles.pnlValue}>{tick}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        {/* === LIVE PRICE DISPLAY === */}
        <View style={styles.priceHeader}>
          <View style={styles.priceLeft}>
            <Text style={styles.tickerBig}>{selectedCommodity.ticker}</Text>
            <Text style={styles.commodityName}>{selectedCommodity.name}</Text>
          </View>
          <View style={styles.priceRight}>
            <Text style={[styles.priceBig, { color: isUp ? COLORS.green : COLORS.red }]}>
              {currentPrice >= 1000
                ? currentPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })
                : currentPrice.toFixed(1)}
            </Text>
            <Text style={[styles.priceChange, { color: isUp ? COLORS.green : COLORS.red }]}>
              {isUp ? '▲' : '▼'} {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </Text>
          </View>
        </View>

        {/* === CHART === */}
        <View style={styles.chartSection}>
          <PriceChart
            priceHistory={history}
            activeNews={activeNews}
            commodityId={selectedCommodityId}
            ticker={selectedCommodity.ticker}
          />
        </View>

        {/* === POSITION INFO (if holding) === */}
        {currentPosition && (
          <View style={styles.positionBanner}>
            <Text style={styles.posInfoText}>
              HOLDING: {currentPosition.quantity}x @ {currentPosition.averageEntry.toFixed(0)}
            </Text>
            <Text style={[styles.posInfoPnl, { color: selectedPnl >= 0 ? COLORS.green : COLORS.red }]}>
              {selectedPnl >= 0 ? '+' : ''}{selectedPnl.toFixed(0)} ({currentPosition.averageEntry > 0
                ? ((selectedPnl / (currentPosition.averageEntry * currentPosition.quantity)) * 100).toFixed(1)
                : '0.0'}%)
            </Text>
          </View>
        )}

        {/* === TRADING PANEL === */}
        <View style={styles.tradingPanel}>
          {/* Quantity row */}
          <View style={styles.qtySection}>
            <Text style={styles.qtyLabel}>QTY</Text>
            <View style={styles.qtyControls}>
              <Pressable style={styles.qtyBtn} onPress={() => adjustQty(-10)}>
                <Text style={styles.qtyBtnText}>-10</Text>
              </Pressable>
              <Pressable style={styles.qtyBtn} onPress={() => adjustQty(-1)}>
                <Text style={styles.qtyBtnText}>-1</Text>
              </Pressable>
              <View style={styles.qtyDisplay}>
                <Text style={styles.qtyValue}>{quantity}</Text>
              </View>
              <Pressable style={styles.qtyBtn} onPress={() => adjustQty(1)}>
                <Text style={styles.qtyBtnText}>+1</Text>
              </Pressable>
              <Pressable style={styles.qtyBtn} onPress={() => adjustQty(10)}>
                <Text style={styles.qtyBtnText}>+10</Text>
              </Pressable>
            </View>
            {/* Quick percentages */}
            <View style={styles.pctRow}>
              {[0.25, 0.5, 0.75, 1].map((pct) => (
                <Pressable
                  key={pct}
                  style={styles.pctBtn}
                  onPress={() => setQuantity(Math.max(1, Math.floor(Math.max(maxBuyQty, maxSellQty) * pct)))}
                >
                  <Text style={styles.pctText}>{pct * 100}%</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Order info */}
          <View style={styles.orderInfo}>
            <Text style={styles.orderInfoText}>
              COST: {totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} | FEE: {feeAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} | SIZE: {quantity * selectedCommodity.size}/{CONSTANTS.MAX_INVENTORY_SIZE - invSize} free
            </Text>
          </View>

          {/* BIG BUY / SELL BUTTONS */}
          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.bigButton,
                styles.buyButton,
                pressed && styles.buttonPressed,
                (quantity <= 0 || quantity > maxBuyQty) && styles.buttonDisabled,
              ]}
              onPress={() => handleExecute('buy')}
              disabled={quantity <= 0 || quantity > maxBuyQty}
            >
              <Text style={styles.buyButtonText}>▲ BUY</Text>
              <Text style={styles.buttonSubtext}>
                {quantity}x {selectedCommodity.ticker}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.bigButton,
                styles.sellButton,
                pressed && styles.buttonPressed,
                (quantity <= 0 || quantity > maxSellQty) && styles.buttonDisabled,
              ]}
              onPress={() => handleExecute('sell')}
              disabled={quantity <= 0 || quantity > maxSellQty}
            >
              <Text style={styles.sellButtonText}>▼ SELL</Text>
              <Text style={styles.buttonSubtext}>
                {quantity}x {selectedCommodity.ticker}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* === ALL POSITIONS === */}
        {positions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>OPEN POSITIONS</Text>
            {positions.map((pos) => {
              const c = getCommodity(pos.commodityId);
              const price = prices[pos.commodityId] ?? 0;
              const pnl = calcUnrealizedPnl(pos, price);
              const pnlPct = pos.averageEntry > 0 ? (pnl / (pos.averageEntry * pos.quantity)) * 100 : 0;

              return (
                <Pressable
                  key={pos.commodityId}
                  style={[
                    styles.posRow,
                    pos.commodityId === selectedCommodityId && styles.posRowSelected,
                  ]}
                  onPress={() => handleSelectCommodity(pos.commodityId)}
                >
                  <Text style={styles.posTicker}>{c.ticker}</Text>
                  <Text style={styles.posQty}>x{pos.quantity}</Text>
                  <Text style={styles.posEntry}>{pos.averageEntry.toFixed(0)}</Text>
                  <Text style={styles.posArrow}>→</Text>
                  <Text style={styles.posCurrent}>{price.toFixed(0)}</Text>
                  <Text style={[styles.posPnl, { color: pnl >= 0 ? COLORS.green : COLORS.red }]}>
                    {pnl >= 0 ? '+' : ''}{pnl.toFixed(0)}
                  </Text>
                  <Text style={[styles.posPnlPct, { color: pnl >= 0 ? COLORS.green : COLORS.red }]}>
                    ({pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}%)
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* === COMMODITY LIST (Market Watch) === */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MARKET WATCH</Text>
          {COMMODITIES.map((c) => {
            const h = priceHistory[c.id] ?? [];
            const hPrices = h.map((p) => p.price);
            const price = prices[c.id] ?? c.basePrice;
            const prev = h.length >= 2 ? h[h.length - 2].price : price;
            const change = prev > 0 ? ((price - prev) / prev) * 100 : 0;
            const owned = positions.find((p) => p.commodityId === c.id)?.quantity ?? 0;
            const isSel = c.id === selectedCommodityId;

            return (
              <Pressable
                key={c.id}
                style={[styles.mktRow, isSel && styles.mktRowSelected]}
                onPress={() => handleSelectCommodity(c.id)}
              >
                <View style={styles.mktLeft}>
                  <Text style={[styles.mktTicker, isSel && { color: COLORS.cyan }]}>{c.ticker}</Text>
                  {owned > 0 && <Text style={styles.mktOwned}>{owned}x</Text>}
                </View>
                <View style={styles.mktSparkBox}>
                  <SparklineChart data={hPrices.slice(-15)} width={45} height={16} />
                </View>
                <View style={styles.mktRight}>
                  <Text style={styles.mktPrice}>
                    {price >= 1000 ? `${(price / 1000).toFixed(1)}k` : price.toFixed(0)}
                  </Text>
                  <Text style={[styles.mktChange, { color: change >= 0 ? COLORS.green : COLORS.red }]}>
                    {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* === NEWS FEED === */}
        {activeNews.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              ▶ NEWS FEED ({activeNews.length})
            </Text>
            {activeNews.map((n) => (
              <NewsCard key={n.id} news={n} currentTick={tick} />
            ))}
          </View>
        )}
      </ScrollView>

      {tutorialActive && <TutorialOverlay />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  // Top bar
  topBar: {
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
  title: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.lg,
    color: COLORS.amber,
    letterSpacing: 3,
    fontWeight: 'bold',
  },
  balanceBox: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: COLORS.textDim,
    letterSpacing: 1,
  },
  balanceValue: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.green,
    fontWeight: 'bold',
  },

  // PnL bar
  pnlBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.darkPanel,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.panelBorder,
  },
  pnlItem: {
    flex: 1,
    alignItems: 'center',
  },
  pnlDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.panelBorder,
  },
  pnlLabel: {
    fontFamily: FONTS.mono,
    fontSize: 7,
    color: COLORS.textDim,
    letterSpacing: 1,
  },
  pnlValue: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  // Live price
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.panelBorder,
  },
  priceLeft: {},
  tickerBig: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.cyan,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  commodityName: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
  },
  priceRight: {
    alignItems: 'flex-end',
  },
  priceBig: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
  },
  priceChange: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
  },

  // Chart
  chartSection: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.panelBorder,
  },

  // Position banner
  positionBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cyanDim,
  },
  posInfoText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.cyan,
  },
  posInfoPnl: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },

  // Trading panel
  tradingPanel: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.panelBorder,
    backgroundColor: COLORS.nearBlack,
  },
  qtySection: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  qtyLabel: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
    letterSpacing: 2,
    marginBottom: SPACING.xs,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  qtyBtn: {
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
    borderRadius: 2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    minWidth: 38,
    alignItems: 'center',
  },
  qtyBtnText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  qtyDisplay: {
    minWidth: 50,
    alignItems: 'center',
  },
  qtyValue: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xl,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  pctRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  pctBtn: {
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
    borderRadius: 2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  pctText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
  },

  // Order info
  orderInfo: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.panelBorder,
  },
  orderInfoText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.textDim,
    letterSpacing: 0.5,
  },

  // Big buttons
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  bigButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: 4,
    borderWidth: 2,
    minHeight: 70,
  },
  buyButton: {
    backgroundColor: 'rgba(118, 255, 3, 0.12)',
    borderColor: COLORS.green,
  },
  sellButton: {
    backgroundColor: 'rgba(255, 23, 68, 0.12)',
    borderColor: COLORS.red,
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  buttonDisabled: {
    opacity: 0.25,
  },
  buyButtonText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xl,
    color: COLORS.green,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  sellButtonText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xl,
    color: COLORS.red,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  buttonSubtext: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
    marginTop: 2,
  },

  // Sections
  section: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.panelBorder,
  },
  sectionTitle: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },

  // Position rows
  posRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.panelBorder,
    gap: SPACING.sm,
  },
  posRowSelected: {
    backgroundColor: COLORS.cyanGlow,
  },
  posTicker: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.cyan,
    fontWeight: 'bold',
    width: 45,
  },
  posQty: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
    width: 30,
  },
  posEntry: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
    width: 40,
    textAlign: 'right',
  },
  posArrow: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
  },
  posCurrent: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    width: 40,
    textAlign: 'right',
  },
  posPnl: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
    width: 50,
    textAlign: 'right',
  },
  posPnlPct: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    width: 55,
    textAlign: 'right',
  },

  // Market watch rows
  mktRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.panelBorder,
    minHeight: 44,
  },
  mktRowSelected: {
    backgroundColor: COLORS.cyanGlow,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.cyan,
  },
  mktLeft: {
    width: 60,
  },
  mktTicker: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  mktOwned: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.cyanDim,
  },
  mktSparkBox: {
    flex: 1,
    alignItems: 'center',
  },
  mktRight: {
    alignItems: 'flex-end',
    width: 65,
  },
  mktPrice: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
  },
  mktChange: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
  },
});
