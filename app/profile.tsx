import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../src/theme';
import { usePlayerStore } from '../src/stores/playerStore';
import { xpToNextRank } from '../src/engine/rank';
import { formatEnergyDisplay } from '../src/engine/energy';
import { Logo } from '../src/components/Logo';
import { MeterBar } from '../src/components/MeterBar';
import { TerminalButton } from '../src/components/TerminalButton';

export default function ProfileScreen() {
  const profile = usePlayerStore((s) => s.profile);
  const currency = usePlayerStore((s) => s.currency);
  const resources = usePlayerStore((s) => s.resources);
  const totalRealizedPnl = usePlayerStore((s) => s.totalRealizedPnl);
  const totalTradeCount = usePlayerStore((s) => s.totalTradeCount);
  const positions = usePlayerStore((s) => s.positions);

  const rankProgress = xpToNextRank(profile?.xp ?? 0);
  const energy = usePlayerStore((s) => s.getEnergy)();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TerminalButton title="< BACK" onPress={() => router.back()} variant="ghost" size="sm" />
        <Text style={styles.headerTitle}>PROFILE</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <Logo size={80} color={COLORS.terminalGreen} />
          <Text style={styles.handle}>{profile?.eidolonHandle ?? 'UNKNOWN'}</Text>
          <Text style={styles.rankTitle}>{profile?.rankTitle ?? 'Boot Ghost'}</Text>
          <Text style={styles.walletAddr}>
            {profile?.walletMode === 'dev-identity' ? 'DEV IDENTITY' : 'WALLET'}: {profile?.walletAddress ? `${profile.walletAddress.slice(0, 8)}...${profile.walletAddress.slice(-6)}` : 'NONE'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>STATS</Text>
          <Row label="RANK LEVEL" value={`${profile?.rankLevel ?? 0}`} />
          <Row label="XP" value={`${profile?.xp ?? 0}`} />
          <Row label="OS TIER" value={(profile?.currentOs ?? 'pirate').toUpperCase()} color={COLORS.terminalGreen} />
          <Row label="TOTAL TRADES" value={`${totalTradeCount}`} />
          <Row label="REALIZED P&L" value={`${totalRealizedPnl >= 0 ? '+' : ''}${Math.round(totalRealizedPnl).toLocaleString()}`} color={totalRealizedPnl >= 0 ? COLORS.green : COLORS.red} />
          <Row label="OPEN POSITIONS" value={`${positions.length}`} />
          <Row label="0BOL BALANCE" value={currency.zeroBol.toLocaleString()} color={COLORS.green} />
          <Row label="ENERGY" value={formatEnergyDisplay(energy)} />
          <Row label="FACTION" value={profile?.factionId ?? 'NONE'} />
          <Row label="CREATED" value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '-'} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RANK PROGRESS</Text>
          <MeterBar
            label={`LEVEL ${profile?.rankLevel ?? 0} → ${(profile?.rankLevel ?? 0) + 1}`}
            value={rankProgress.progress}
            valueText={`${rankProgress.current} / ${rankProgress.needed} XP`}
            color={COLORS.cyan}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, color ? { color } : null]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.panelBorder },
  headerTitle: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.md, color: COLORS.cyan, letterSpacing: 2 },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  avatarSection: { alignItems: 'center', marginBottom: SPACING.lg, paddingVertical: SPACING.lg },
  handle: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xl, color: COLORS.terminalGreen, marginTop: SPACING.md },
  rankTitle: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.sm, color: COLORS.cyan, letterSpacing: 2, marginTop: SPACING.xs },
  walletAddr: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.textDim, marginTop: SPACING.sm },
  section: { borderWidth: 1, borderColor: COLORS.panelBorder, borderRadius: 4, padding: SPACING.md, marginBottom: SPACING.md, backgroundColor: COLORS.darkPanel },
  sectionTitle: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.textDim, letterSpacing: 2, marginBottom: SPACING.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.panelBorder },
  rowLabel: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.textDim },
  rowValue: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.sm, color: COLORS.textPrimary },
});
