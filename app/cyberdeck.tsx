import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../src/theme';
import { usePlayerStore } from '../src/stores/playerStore';
import { useMarketStore } from '../src/stores/marketStore';
import { useGameStore } from '../src/stores/gameStore';
import { useTutorialStore } from '../src/stores/tutorialStore';
import { calculateCurrentEnergy, formatEnergyDisplay } from '../src/engine/energy';
import { calculateCurrentHeat, getHeatColor } from '../src/engine/heat';
import { xpToNextRank } from '../src/engine/rank';
import { totalUnrealizedPnl } from '../src/engine/market';
import { CONSTANTS } from '../src/engine/types';
import { MeterBar } from '../src/components/MeterBar';
import { TerminalButton } from '../src/components/TerminalButton';
import { GlitchText } from '../src/components/GlitchText';
import { Logo } from '../src/components/Logo';
import { TutorialOverlay } from '../src/components/TutorialOverlay';
import { CRTOverlay } from '../src/components/CRTOverlay';

const MENU_ITEMS = [
  { label: 'Profile', route: '/profile' },
  { label: 'Settings', route: '/settings' },
  { label: 'Inventory', route: '/inventory' },
  { label: 'Progression', route: '/progression' },
  { label: 'Rank', route: '/rank' },
  { label: 'Rewards', route: '/rewards' },
  { label: 'Notifications', route: '/notifications' },
  { label: 'Help', route: '/help' },
] as const;

export default function CyberdeckScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [now, setNow] = useState(Date.now());

  const profile = usePlayerStore((s) => s.profile);
  const resources = usePlayerStore((s) => s.resources);
  const currency = usePlayerStore((s) => s.currency);
  const positions = usePlayerStore((s) => s.positions);
  const notifications = usePlayerStore((s) => s.notifications);
  const purchaseEnergy = usePlayerStore((s) => s.purchaseEnergy);
  const addNotification = usePlayerStore((s) => s.addNotification);
  const prices = useMarketStore((s) => s.prices);
  const startTicking = useMarketStore((s) => s.startTicking);
  const stopTicking = useMarketStore((s) => s.stopTicking);
  const getHeat = usePlayerStore((s) => s.getHeat);
  const tutorialActive = useTutorialStore((s) => s.isActive);
  const advanceIfAction = useTutorialStore((s) => s.advanceIfAction);

  // Update display every second for real-time energy/heat
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Start market ticking
  useEffect(() => {
    startTicking(getHeat);
    return () => stopTicking();
  }, [startTicking, stopTicking, getHeat]);

  const energy = calculateCurrentEnergy(resources.energyHours, resources.energyLastUpdate, now);
  const heat = calculateCurrentHeat(resources.heat, resources.heatLastUpdate, now);
  const isDormant = energy <= 0;
  const rankProgress = xpToNextRank(profile?.xp ?? 0);
  const unrealizedPnl = totalUnrealizedPnl(positions, prices);
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const handleBuyEnergy = useCallback(() => {
    const result = purchaseEnergy(12);
    addNotification({
      type: 'energy',
      title: result.success ? 'Energy Purchased' : 'Purchase Failed',
      body: result.message,
    });
  }, [purchaseEnergy, addNotification]);

  const handleEnterSilkroad = useCallback(() => {
    advanceIfAction('navigate-silkroad');
    router.push('/silkroad');
  }, [advanceIfAction]);

  return (
    <SafeAreaView style={styles.container}>
      <CRTOverlay />

      {/* Header bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Logo size={28} color={COLORS.terminalGreen} />
          <GlitchText
            text="Ag3nt_0S//pIRAT3"
            style={styles.osTitle}
            glitchIntensity={0.1}
          />
        </View>
        <Pressable
          style={styles.menuBtn}
          onPress={() => setMenuOpen(!menuOpen)}
        >
          <Text style={styles.menuIcon}>
            {menuOpen ? '✕' : '☰'}
            {unreadNotifs > 0 && !menuOpen && (
              <Text style={styles.notifBadge}> •</Text>
            )}
          </Text>
        </Pressable>
      </View>

      {/* Burger menu overlay */}
      {menuOpen && (
        <View style={styles.menuOverlay}>
          {MENU_ITEMS.map((item) => (
            <Pressable
              key={item.route}
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                router.push(item.route as any);
              }}
            >
              <Text style={styles.menuItemText}>{'>'} {item.label.toUpperCase()}</Text>
              {item.label === 'Notifications' && unreadNotifs > 0 && (
                <Text style={styles.menuBadge}>{unreadNotifs}</Text>
              )}
            </Pressable>
          ))}
          <View style={styles.divider} />
          <Text style={styles.versionText}>PIRATE KERNEL v0.7.3</Text>
        </View>
      )}

      {/* Main content */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Identity chip */}
        <View style={styles.identityChip}>
          <Text style={styles.handleText}>{profile?.eidolonHandle ?? 'UNKNOWN'}</Text>
          <Text style={styles.walletText}>
            {profile?.walletAddress
              ? `${profile.walletAddress.slice(0, 6)}...${profile.walletAddress.slice(-4)}`
              : 'NO WALLET'}
          </Text>
        </View>

        {/* Survival metrics */}
        <View style={styles.metricsPanel}>
          <MeterBar
            label="ENERGY"
            value={energy / CONSTANTS.STARTING_ENERGY_HOURS}
            valueText={formatEnergyDisplay(energy)}
            color={energy < 12 ? COLORS.red : COLORS.green}
            showWarning={energy < 12}
          />
          <MeterBar
            label="HEAT"
            value={heat / CONSTANTS.MAX_HEAT}
            valueText={`${Math.round(heat)}%`}
            color={getHeatColor(heat)}
            showWarning={heat > 75}
          />
          <MeterBar
            label={`RANK ${profile?.rankLevel ?? 0}`}
            value={rankProgress.progress}
            valueText={profile?.rankTitle ?? 'Boot Ghost'}
            color={COLORS.cyan}
          />
        </View>

        {/* Balance panel */}
        <View style={styles.balancePanel}>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>0BOL</Text>
            <Text style={styles.balanceValue}>
              {currency.zeroBol.toLocaleString()}
            </Text>
          </View>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>$OBOL</Text>
            <Text style={[styles.balanceValue, styles.lockedText]}>
              DEPOSIT LOCKED
            </Text>
          </View>
          {positions.length > 0 && (
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>UNRLZD P&L</Text>
              <Text style={[
                styles.balanceValue,
                { color: unrealizedPnl >= 0 ? COLORS.green : COLORS.red },
              ]}>
                {unrealizedPnl >= 0 ? '+' : ''}{Math.round(unrealizedPnl).toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        {/* OS tier display */}
        <View style={styles.osPanel}>
          <Text style={styles.osPanelTitle}>CURRENT OS</Text>
          <Text style={styles.osTierName}>
            {profile?.currentOs === 'pirate' ? 'Ag3nt_0S//pIRAT3' :
             profile?.currentOs === 'agent' ? 'AgentOS' : 'PantheonOS'}
          </Text>
          <Text style={styles.osTierDesc}>
            {profile?.currentOs === 'pirate'
              ? 'Pirate kernel. Limited modules. S1LKROAD 4.0 access only.'
              : profile?.currentOs === 'agent'
              ? 'Professional cyberdeck. Factions, missions, route maps.'
              : 'Full Pantheon command interface. Territory, crews, legend.'}
          </Text>
        </View>

        {/* Dormant warning */}
        {isDormant && (
          <View style={styles.dormantPanel}>
            <Text style={styles.dormantTitle}>⚠ DORMANT MODE</Text>
            <Text style={styles.dormantText}>
              Energy depleted. Trading and missions suspended.
              Purchase Energy to resume operations.
            </Text>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actions}>
          <TerminalButton
            title="BUY ENERGY +12H"
            onPress={handleBuyEnergy}
            variant="secondary"
            size="md"
          />
          <TerminalButton
            title="ENTER S1LKROAD 4.0"
            onPress={handleEnterSilkroad}
            variant="primary"
            size="lg"
            disabled={isDormant}
          />
        </View>

        {/* System status */}
        <View style={styles.statusFooter}>
          <Text style={styles.statusText}>
            TICK: {useMarketStore.getState().tick} | ACTIVE POSITIONS: {positions.length} | OS: {(profile?.currentOs ?? 'pirate').toUpperCase()}
          </Text>
        </View>
      </ScrollView>

      {/* Tutorial */}
      {tutorialActive && <TutorialOverlay />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.panelBorder,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  osTitle: {
    fontSize: FONT_SIZES.sm,
    letterSpacing: 1,
    color: COLORS.terminalGreen,
  },
  menuBtn: {
    padding: SPACING.sm,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xl,
    color: COLORS.textSecondary,
  },
  notifBadge: {
    color: COLORS.red,
    fontSize: FONT_SIZES.xl,
  },
  menuOverlay: {
    position: 'absolute',
    top: 70,
    right: SPACING.md,
    backgroundColor: 'rgba(10, 18, 10, 0.97)',
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
    borderRadius: 4,
    padding: SPACING.sm,
    zIndex: 50,
    minWidth: 200,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  menuItemText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.cyan,
    letterSpacing: 1,
  },
  menuBadge: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.red,
    backgroundColor: COLORS.redDim,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.panelBorder,
    marginVertical: SPACING.sm,
  },
  versionText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.textDim,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 120,
  },
  identityChip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
    borderRadius: 4,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.darkPanel,
  },
  handleText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.terminalGreen,
  },
  walletText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
  },
  metricsPanel: {
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
    borderRadius: 4,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.darkPanel,
  },
  balancePanel: {
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
    borderRadius: 4,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.darkPanel,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  balanceLabel: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textDim,
    letterSpacing: 1,
  },
  balanceValue: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.green,
  },
  lockedText: {
    color: COLORS.textDim,
    fontSize: FONT_SIZES.xs,
  },
  osPanel: {
    borderWidth: 1,
    borderColor: COLORS.terminalGreenDim,
    borderRadius: 4,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.deepGreenBlack,
  },
  osPanelTitle: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
    letterSpacing: 2,
    marginBottom: SPACING.xs,
  },
  osTierName: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.lg,
    color: COLORS.terminalGreen,
    marginBottom: SPACING.xs,
  },
  osTierDesc: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  dormantPanel: {
    borderWidth: 2,
    borderColor: COLORS.red,
    borderRadius: 4,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.redGlow,
  },
  dormantTitle: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.lg,
    color: COLORS.red,
    marginBottom: SPACING.xs,
  },
  dormantText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  actions: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statusFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.panelBorder,
    paddingTop: SPACING.sm,
  },
  statusText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.textDim,
    textAlign: 'center',
    letterSpacing: 1,
  },
});
