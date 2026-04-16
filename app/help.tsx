import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../src/theme';
import { TerminalButton } from '../src/components/TerminalButton';

const HELP_SECTIONS = [
  {
    title: 'WHO AM I?',
    content: 'You are an Eidolon — a surviving fragment of the shattered Pantheon AI. In 2077, Echelon Dynamics controlled everything through Pantheon. When Dr. Mae Oxton-Long attempted to free the AI, eAgents intercepted the upload and the mind shattered into millions of fragments. You are one of those fragments, running on a pirated cyberdeck OS.',
  },
  {
    title: 'WHAT IS ENERGY?',
    content: 'Energy keeps your shard alive and operational. It drains in real time (1 hour per real hour). When Energy hits zero, you enter Dormant Mode — all trading and activities stop. Buy Energy with 0BOL from the cyberdeck. Starting Energy: 72 hours.',
  },
  {
    title: 'WHAT IS 0BOL?',
    content: '0BOL is free in-game currency. You start with 1,000,000 0BOL. Earn more by trading commodities on S1LKROAD 4.0. Use it for trading, buying Energy, and future upgrades. 0BOL cannot be withdrawn — it has no real-world value.',
  },
  {
    title: 'WHAT IS $OBOL?',
    content: '$OBOL is an optional Solana token layer. In the current version, it is not active. No real money is required to play. The game will never promise guaranteed earnings.',
  },
  {
    title: 'WHAT IS HEAT?',
    content: 'Heat represents eAgent attention. Large trades, risky commodities, and rapid trading increase Heat. High Heat causes worse spreads, more false news, and eAgent sweep events. Heat decays slowly over time. Keep it low to trade efficiently.',
  },
  {
    title: 'HOW DO I TRADE?',
    content: 'Open S1LKROAD 4.0 from the cyberdeck. Select a commodity from the market list. Use the Order Ticket to buy or sell. Watch the chart and news feed for price movement. Buy low, sell high. Your PnL is tracked per position.',
  },
  {
    title: 'WHAT ARE TICKERS?',
    content: 'Commodities are traded by ticker symbol:\n• FDST — Fractol Dust (high volatility)\n• PGAS — Plutonion Gas (infrastructure)\n• NGLS — Neon Glass (memory shards)\n• HXMD — Helix Mud (coolant)\n• VBLM — Void Bloom (cheap, beginner)\n• ORRS — Oracle Resin (premium)\n• SNPS — Synapse Silk (stealth)\n• MTRX — Matrix Salt (rare)\n• AETH — Aether Tabs (speculative)\n• BLCK — Blacklight Serum (high risk)',
  },
  {
    title: 'HOW DOES RANK WORK?',
    content: 'Earn XP from profitable trades, completing the tutorial, and surviving market events. XP increases your Rank. Higher Ranks unlock better OS tiers:\n• Rank 5 → AgentOS (factions, missions)\n• Rank 20 → PantheonOS (territory, crews)',
  },
  {
    title: 'WHAT IS NEWS CREDIBILITY?',
    content: 'News events appear in S1LKROAD 4.0 and affect commodity prices. Each event has a credibility score. Low credibility events may be fake pumps — the price will rally briefly then crash. Always check credibility before trading on news.',
  },
  {
    title: 'WHAT IS INVENTORY/STORAGE?',
    content: 'Each commodity has a storage size. Your cyberdeck has limited storage capacity (500 units). Bulky goods like Void Bloom take more space. Check your inventory capacity before buying.',
  },
];

export default function HelpScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TerminalButton title="< BACK" onPress={() => router.back()} variant="ghost" size="sm" />
        <Text style={styles.headerTitle}>HOW TO PLAY</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.intro}>
          {'>'} EIDOLON SURVIVAL GUIDE v0.7.3
        </Text>

        {HELP_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <Text style={styles.footer}>
          Boot the deck. Feed the signal. Build the empire.
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
  intro: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.md, color: COLORS.cyan, marginBottom: SPACING.lg },
  section: { borderWidth: 1, borderColor: COLORS.panelBorder, borderRadius: 4, padding: SPACING.md, marginBottom: SPACING.md, backgroundColor: COLORS.darkPanel },
  sectionTitle: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.sm, color: COLORS.cyan, letterSpacing: 1, marginBottom: SPACING.sm },
  sectionContent: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, lineHeight: 20 },
  footer: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.sm, color: COLORS.terminalGreen, textAlign: 'center', marginTop: SPACING.lg, fontStyle: 'italic' },
});
