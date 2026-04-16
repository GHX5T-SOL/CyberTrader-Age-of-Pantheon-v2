import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../src/theme';
import { usePlayerStore } from '../src/stores/playerStore';
import { RANKS, xpToNextRank } from '../src/engine/rank';
import { MeterBar } from '../src/components/MeterBar';
import { TerminalButton } from '../src/components/TerminalButton';

export default function ProgressionScreen() {
  const profile = usePlayerStore((s) => s.profile);
  const playerLevel = profile?.rankLevel ?? 0;
  const playerXp = profile?.xp ?? 0;
  const rankProgress = xpToNextRank(playerXp);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TerminalButton title="< BACK" onPress={() => router.back()} variant="ghost" size="sm" />
        <Text style={styles.headerTitle}>PROGRESSION</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.currentRank}>
          <Text style={styles.currentLabel}>CURRENT RANK</Text>
          <Text style={styles.currentLevel}>LEVEL {playerLevel}</Text>
          <Text style={styles.currentTitle}>{profile?.rankTitle ?? 'Boot Ghost'}</Text>
          <MeterBar
            label="NEXT RANK"
            value={rankProgress.progress}
            valueText={`${rankProgress.current} / ${rankProgress.needed} XP`}
            color={COLORS.cyan}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OS TIERS</Text>

          <OSTierCard
            name="Ag3nt_0S//pIRAT3"
            tier="PIRATE"
            requirement="Starting OS"
            unlocked={true}
            active={profile?.currentOs === 'pirate'}
            description="Corrupted terminal. S1LKROAD access. Basic trading."
            color={COLORS.terminalGreen}
          />
          <OSTierCard
            name="AgentOS"
            tier="AGENT"
            requirement="Rank 5 (Node Thief)"
            unlocked={playerLevel >= 5}
            active={profile?.currentOs === 'agent'}
            description="Professional cyberdeck. Factions, missions, route maps, better tools."
            color={COLORS.cyan}
          />
          <OSTierCard
            name="PantheonOS"
            tier="PANTHEON"
            requirement="Rank 20 (Pantheon Candidate)"
            unlocked={playerLevel >= 20}
            active={profile?.currentOs === 'pantheon'}
            description="Full AI command interface. Territory, crews, legend track."
            color={COLORS.amber}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RANK MILESTONES</Text>
          {RANKS.map((rank) => (
            <View key={rank.level} style={[styles.rankRow, playerLevel >= rank.level && styles.rankUnlocked]}>
              <View style={styles.rankLeft}>
                <Text style={[styles.rankLevel, playerLevel >= rank.level && styles.rankLevelActive]}>
                  {rank.level}
                </Text>
                <View>
                  <Text style={[styles.rankTitle, playerLevel >= rank.level && styles.rankTitleActive]}>
                    {rank.title}
                  </Text>
                  <Text style={styles.rankXp}>{rank.xpRequired.toLocaleString()} XP</Text>
                </View>
              </View>
              <Text style={styles.rankUnlocks}>
                {rank.unlocks.join(', ')}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function OSTierCard({ name, tier, requirement, unlocked, active, description, color }: {
  name: string; tier: string; requirement: string; unlocked: boolean; active: boolean; description: string; color: string;
}) {
  return (
    <View style={[styles.osCard, active && { borderColor: color }, !unlocked && styles.osCardLocked]}>
      <View style={styles.osCardHeader}>
        <Text style={[styles.osName, { color: unlocked ? color : COLORS.textDim }]}>{name}</Text>
        {active && <Text style={[styles.osActive, { color }]}>[ACTIVE]</Text>}
        {!unlocked && <Text style={styles.osLocked}>[LOCKED]</Text>}
      </View>
      <Text style={styles.osRequirement}>{requirement}</Text>
      <Text style={styles.osDesc}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.panelBorder },
  headerTitle: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.md, color: COLORS.cyan, letterSpacing: 2 },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  currentRank: { borderWidth: 1, borderColor: COLORS.cyan, borderRadius: 4, padding: SPACING.md, marginBottom: SPACING.md, backgroundColor: COLORS.darkPanel },
  currentLabel: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.textDim, letterSpacing: 2 },
  currentLevel: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xxl, color: COLORS.cyan, marginVertical: SPACING.xs },
  currentTitle: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.lg, color: COLORS.textPrimary, marginBottom: SPACING.md },
  section: { marginBottom: SPACING.lg },
  sectionTitle: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.textDim, letterSpacing: 2, marginBottom: SPACING.sm },
  osCard: { borderWidth: 1, borderColor: COLORS.panelBorder, borderRadius: 4, padding: SPACING.md, marginBottom: SPACING.sm, backgroundColor: COLORS.darkPanel },
  osCardLocked: { opacity: 0.5 },
  osCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  osName: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.md, fontWeight: 'bold' },
  osActive: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, letterSpacing: 1 },
  osLocked: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.textDim },
  osRequirement: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.textDim, marginBottom: 4 },
  osDesc: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, lineHeight: 18 },
  rankRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, paddingHorizontal: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.panelBorder, opacity: 0.5 },
  rankUnlocked: { opacity: 1, backgroundColor: COLORS.darkPanel },
  rankLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1 },
  rankLevel: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.lg, color: COLORS.textDim, width: 30 },
  rankLevelActive: { color: COLORS.cyan },
  rankTitle: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.sm, color: COLORS.textDim },
  rankTitleActive: { color: COLORS.textPrimary },
  rankXp: { fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textDim },
  rankUnlocks: { fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textDim, flex: 1, textAlign: 'right' },
});
