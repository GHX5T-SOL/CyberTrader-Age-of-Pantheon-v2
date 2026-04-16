import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../src/theme';
import { usePlayerStore } from '../src/stores/playerStore';
import { TerminalButton } from '../src/components/TerminalButton';

// Simulated leaderboard data
const LEADERBOARD = [
  { handle: 'NullViper_777', rank: 12, title: 'Grid Smuggler', xp: 5200, pnl: 2450000 },
  { handle: 'DarkSignal_042', rank: 8, title: 'Route Phantom', xp: 2800, pnl: 1230000 },
  { handle: 'GhostRelay_913', rank: 5, title: 'Node Thief', xp: 1500, pnl: 890000 },
  { handle: 'VoidEcho_308', rank: 3, title: 'Black Terminal', xp: 720, pnl: 420000 },
  { handle: 'NeonFragment_561', rank: 2, title: 'Signal Runner', xp: 350, pnl: 180000 },
];

export default function RankScreen() {
  const profile = usePlayerStore((s) => s.profile);
  const totalRealizedPnl = usePlayerStore((s) => s.totalRealizedPnl);

  const playerEntry = {
    handle: profile?.eidolonHandle ?? 'YOU',
    rank: profile?.rankLevel ?? 0,
    title: profile?.rankTitle ?? 'Boot Ghost',
    xp: profile?.xp ?? 0,
    pnl: Math.round(totalRealizedPnl),
  };

  const allEntries = [...LEADERBOARD, playerEntry].sort((a, b) => b.xp - a.xp);
  const playerPosition = allEntries.findIndex((e) => e.handle === playerEntry.handle) + 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TerminalButton title="< BACK" onPress={() => router.back()} variant="ghost" size="sm" />
        <Text style={styles.headerTitle}>LEADERBOARD</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.playerCard}>
          <Text style={styles.playerPosition}>#{playerPosition}</Text>
          <Text style={styles.playerHandle}>{playerEntry.handle}</Text>
          <Text style={styles.playerRank}>LVL {playerEntry.rank} — {playerEntry.title}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TOP EIDOLONS</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.colText, { flex: 0.5 }]}>#</Text>
            <Text style={[styles.colText, { flex: 2 }]}>HANDLE</Text>
            <Text style={[styles.colText, { flex: 1 }]}>RANK</Text>
            <Text style={[styles.colText, { flex: 1, textAlign: 'right' }]}>XP</Text>
            <Text style={[styles.colText, { flex: 1.5, textAlign: 'right' }]}>P&L</Text>
          </View>
          {allEntries.map((entry, i) => {
            const isPlayer = entry.handle === playerEntry.handle;
            return (
              <View key={entry.handle} style={[styles.tableRow, isPlayer && styles.playerRow]}>
                <Text style={[styles.cellText, { flex: 0.5, color: COLORS.textDim }]}>{i + 1}</Text>
                <Text style={[styles.cellText, { flex: 2, color: isPlayer ? COLORS.cyan : COLORS.textPrimary }]} numberOfLines={1}>
                  {entry.handle}
                </Text>
                <Text style={[styles.cellText, { flex: 1 }]}>{entry.rank}</Text>
                <Text style={[styles.cellText, { flex: 1, textAlign: 'right' }]}>
                  {entry.xp.toLocaleString()}
                </Text>
                <Text style={[styles.cellText, { flex: 1.5, textAlign: 'right', color: entry.pnl >= 0 ? COLORS.green : COLORS.red }]}>
                  {entry.pnl >= 0 ? '+' : ''}{entry.pnl.toLocaleString()}
                </Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.note}>
          Leaderboard updates each cycle. Rankings based on total XP.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.panelBorder },
  headerTitle: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.md, color: COLORS.cyan, letterSpacing: 2 },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  playerCard: { borderWidth: 1, borderColor: COLORS.cyan, borderRadius: 4, padding: SPACING.md, marginBottom: SPACING.md, backgroundColor: COLORS.cyanGlow, alignItems: 'center' },
  playerPosition: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.title, color: COLORS.cyan },
  playerHandle: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.lg, color: COLORS.textPrimary, marginTop: SPACING.xs },
  playerRank: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  section: { borderWidth: 1, borderColor: COLORS.panelBorder, borderRadius: 4, padding: SPACING.sm, marginBottom: SPACING.md, backgroundColor: COLORS.darkPanel },
  sectionTitle: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.textDim, letterSpacing: 2, marginBottom: SPACING.sm, paddingHorizontal: SPACING.xs },
  tableHeader: { flexDirection: 'row', paddingVertical: SPACING.xs, borderBottomWidth: 1, borderBottomColor: COLORS.panelBorder, paddingHorizontal: SPACING.xs },
  colText: { fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textDim, letterSpacing: 1 },
  tableRow: { flexDirection: 'row', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.panelBorder, paddingHorizontal: SPACING.xs },
  playerRow: { backgroundColor: COLORS.cyanGlow },
  cellText: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.textSecondary },
  note: { fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textDim, textAlign: 'center', marginTop: SPACING.sm },
});
