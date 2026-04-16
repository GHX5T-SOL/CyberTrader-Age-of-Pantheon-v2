import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../src/theme';
import { usePlayerStore } from '../src/stores/playerStore';
import { TerminalButton } from '../src/components/TerminalButton';

const DAILY_REWARDS = [
  { day: 1, reward: '10,000 0BOL', claimed: true },
  { day: 2, reward: '15,000 0BOL', claimed: true },
  { day: 3, reward: '25,000 0BOL', claimed: false },
  { day: 4, reward: '+6h Energy', claimed: false },
  { day: 5, reward: '50,000 0BOL', claimed: false },
  { day: 6, reward: '-10 Heat', claimed: false },
  { day: 7, reward: '100,000 0BOL + 50 XP', claimed: false },
];

const ACHIEVEMENTS = [
  { id: 'first_trade', name: 'First Blood', desc: 'Complete your first trade', reward: '25 XP', unlocked: false },
  { id: 'profit_10k', name: 'Packet Profit', desc: 'Realize 10,000 0BOL in profit', reward: '50 XP', unlocked: false },
  { id: 'profit_100k', name: 'Signal Strength', desc: 'Realize 100,000 0BOL in profit', reward: '100 XP', unlocked: false },
  { id: 'trades_10', name: 'Active Terminal', desc: 'Execute 10 trades', reward: '30 XP', unlocked: false },
  { id: 'trades_50', name: 'Market Presence', desc: 'Execute 50 trades', reward: '75 XP', unlocked: false },
  { id: 'rank_1', name: 'Boot Complete', desc: 'Reach Rank 1', reward: '25 XP', unlocked: false },
  { id: 'rank_5', name: 'OS Upgrade', desc: 'Reach Rank 5 and unlock AgentOS', reward: '200 XP', unlocked: false },
];

export default function RewardsScreen() {
  const profile = usePlayerStore((s) => s.profile);
  const totalTradeCount = usePlayerStore((s) => s.totalTradeCount);
  const totalRealizedPnl = usePlayerStore((s) => s.totalRealizedPnl);
  const currency = usePlayerStore((s) => s.currency);
  const addNotification = usePlayerStore((s) => s.addNotification);

  // Check achievement status
  const achievements = ACHIEVEMENTS.map((a) => {
    let unlocked = false;
    if (a.id === 'first_trade' && totalTradeCount >= 1) unlocked = true;
    if (a.id === 'profit_10k' && totalRealizedPnl >= 10000) unlocked = true;
    if (a.id === 'profit_100k' && totalRealizedPnl >= 100000) unlocked = true;
    if (a.id === 'trades_10' && totalTradeCount >= 10) unlocked = true;
    if (a.id === 'trades_50' && totalTradeCount >= 50) unlocked = true;
    if (a.id === 'rank_1' && (profile?.rankLevel ?? 0) >= 1) unlocked = true;
    if (a.id === 'rank_5' && (profile?.rankLevel ?? 0) >= 5) unlocked = true;
    return { ...a, unlocked };
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TerminalButton title="< BACK" onPress={() => router.back()} variant="ghost" size="sm" />
        <Text style={styles.headerTitle}>REWARDS</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DAILY LOGIN</Text>
          <View style={styles.dailyGrid}>
            {DAILY_REWARDS.map((d) => (
              <View key={d.day} style={[styles.dailyCard, d.claimed && styles.dailyClaimed]}>
                <Text style={styles.dailyDay}>DAY {d.day}</Text>
                <Text style={[styles.dailyReward, d.claimed && { color: COLORS.textDim }]}>
                  {d.reward}
                </Text>
                {d.claimed && <Text style={styles.dailyCheck}>✓</Text>}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
          {achievements.map((a) => (
            <View key={a.id} style={[styles.achieveRow, a.unlocked && styles.achieveUnlocked]}>
              <View style={styles.achieveLeft}>
                <Text style={[styles.achieveName, a.unlocked && { color: COLORS.green }]}>
                  {a.unlocked ? '✓ ' : '○ '}{a.name}
                </Text>
                <Text style={styles.achieveDesc}>{a.desc}</Text>
              </View>
              <Text style={[styles.achieveReward, a.unlocked && { color: COLORS.green }]}>
                {a.reward}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.panelBorder },
  headerTitle: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.md, color: COLORS.cyan, letterSpacing: 2 },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  section: { marginBottom: SPACING.lg },
  sectionTitle: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.textDim, letterSpacing: 2, marginBottom: SPACING.sm },
  dailyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  dailyCard: { borderWidth: 1, borderColor: COLORS.panelBorder, borderRadius: 4, padding: SPACING.sm, minWidth: 90, alignItems: 'center', backgroundColor: COLORS.darkPanel },
  dailyClaimed: { borderColor: COLORS.greenDim, backgroundColor: COLORS.greenGlow },
  dailyDay: { fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textDim, letterSpacing: 1 },
  dailyReward: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.green, marginTop: 2, textAlign: 'center' },
  dailyCheck: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.sm, color: COLORS.green, marginTop: 2 },
  achieveRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, paddingHorizontal: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.panelBorder, opacity: 0.5 },
  achieveUnlocked: { opacity: 1, backgroundColor: COLORS.darkPanel },
  achieveLeft: { flex: 1 },
  achieveName: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.sm, color: COLORS.textPrimary },
  achieveDesc: { fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textDim },
  achieveReward: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.textDim, marginLeft: SPACING.sm },
});
