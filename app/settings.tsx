import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../src/theme';
import { useGameStore } from '../src/stores/gameStore';
import { TerminalButton } from '../src/components/TerminalButton';

export default function SettingsScreen() {
  const { soundEnabled, reducedMotion, toggleSound, toggleReducedMotion, setPhase } = useGameStore();

  const handleReplayIntro = () => {
    setPhase('intro');
    router.replace('/intro');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TerminalButton title="< BACK" onPress={() => router.back()} variant="ghost" size="sm" />
        <Text style={styles.headerTitle}>SETTINGS</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AUDIO</Text>
          <SettingToggle
            label="SOUND EFFECTS"
            value={soundEnabled}
            onToggle={toggleSound}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCESSIBILITY</Text>
          <SettingToggle
            label="REDUCED MOTION"
            value={reducedMotion}
            onToggle={toggleReducedMotion}
          />
          <Text style={styles.settingDesc}>
            Replaces animations with static panels and manual advance.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CINEMATIC</Text>
          <TerminalButton
            title="REPLAY INTRO"
            onPress={handleReplayIntro}
            variant="secondary"
            size="md"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LEGAL</Text>
          <Text style={styles.legalText}>
            CyberTrader: Age of Pantheon is a fictional game.{'\n\n'}
            0BOL is free in-game currency with no real-world value.{'\n\n'}
            $OBOL integration is optional and feature-flagged. No real profit is guaranteed.{'\n\n'}
            All commodities are fictional. No real substances are depicted.{'\n\n'}
            The game does not contain gambling, loot boxes, or paid randomized rewards.{'\n\n'}
            Wallet connections are used for identity only in the current version.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <Text style={styles.aboutText}>
            v1.0.0 — PIRATE KERNEL v0.7.3{'\n'}
            Built with Expo + React Native{'\n'}
            © 2077 Neon Void Systems
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingToggle({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) {
  return (
    <Pressable style={styles.toggleRow} onPress={onToggle}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Text style={[styles.toggleValue, { color: value ? COLORS.green : COLORS.red }]}>
        [{value ? 'ON' : 'OFF'}]
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.panelBorder },
  headerTitle: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.md, color: COLORS.cyan, letterSpacing: 2 },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  section: { borderWidth: 1, borderColor: COLORS.panelBorder, borderRadius: 4, padding: SPACING.md, marginBottom: SPACING.md, backgroundColor: COLORS.darkPanel },
  sectionTitle: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.textDim, letterSpacing: 2, marginBottom: SPACING.sm },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, minHeight: 44 },
  toggleLabel: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.sm, color: COLORS.textPrimary },
  toggleValue: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.sm, letterSpacing: 1 },
  settingDesc: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.textDim, marginTop: SPACING.xs, lineHeight: 18 },
  legalText: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, lineHeight: 18 },
  aboutText: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.textDim, lineHeight: 18, textAlign: 'center' },
});
