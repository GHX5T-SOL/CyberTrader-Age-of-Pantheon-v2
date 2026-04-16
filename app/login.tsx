import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../src/theme';
import { useGameStore } from '../src/stores/gameStore';
import { usePlayerStore } from '../src/stores/playerStore';
import { Logo } from '../src/components/Logo';
import { TerminalButton } from '../src/components/TerminalButton';
import { GlitchText } from '../src/components/GlitchText';
import { CRTOverlay } from '../src/components/CRTOverlay';

const ADJECTIVES = ['Ghost', 'Phantom', 'Shadow', 'Null', 'Void', 'Neon', 'Zero', 'Glitch', 'Rogue', 'Dark'];
const NOUNS = ['Shard', 'Signal', 'Pulse', 'Node', 'Relay', 'Echo', 'Fragment', 'Cipher', 'Vector', 'Daemon'];

function generateHandle(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 999);
  return `${adj}${noun}_${num}`;
}

function generateDevAddress(): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let addr = '';
  for (let i = 0; i < 44; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)];
  }
  return addr;
}

export default function LoginScreen() {
  const [handle, setHandle] = useState(generateHandle);
  const [connecting, setConnecting] = useState(false);
  const { setPhase } = useGameStore();
  const { createProfile } = usePlayerStore();

  const connectDevIdentity = () => {
    setConnecting(true);
    const addr = generateDevAddress();

    setTimeout(() => {
      createProfile(handle, addr, 'dev-identity');
      setPhase('boot');
      router.replace('/boot');
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CRTOverlay />

      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <Logo size={100} />
          <GlitchText
            text="CYBERTRADER"
            style={styles.gameTitle}
            glitchIntensity={0.15}
          />
          <Text style={styles.subtitle}>AGE OF PANTHEON</Text>
        </View>

        {/* Identity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'>'} CONNECT IDENTITY</Text>
          <View style={styles.divider} />

          {/* Eidolon Handle */}
          <Text style={styles.fieldLabel}>EIDOLON HANDLE</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={handle}
              onChangeText={setHandle}
              maxLength={24}
              placeholderTextColor={COLORS.textDim}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable style={styles.randomBtn} onPress={() => setHandle(generateHandle())}>
              <Text style={styles.randomText}>RNG</Text>
            </Pressable>
          </View>
        </View>

        {/* Connection Options */}
        <View style={styles.section}>
          <TerminalButton
            title="Dev Identity"
            onPress={connectDevIdentity}
            variant="primary"
            size="lg"
            disabled={connecting || handle.length < 3}
          />
          <Text style={styles.devNote}>
            Local testing mode. No real wallet required.
          </Text>

          <View style={styles.walletOption}>
            <TerminalButton
              title="Solana Wallet"
              onPress={() => {}}
              variant="ghost"
              size="md"
              disabled={true}
            />
            <Text style={styles.walletNote}>
              Requires dev build + Mobile Wallet Adapter
            </Text>
          </View>
        </View>

        {connecting && (
          <Text style={styles.connectingText}>
            {'>'} ESTABLISHING SYSLINK...
          </Text>
        )}

        {/* Legal */}
        <Text style={styles.legal}>
          This is a game. No real profit is guaranteed.{'\n'}
          0BOL is free in-game currency only.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  gameTitle: {
    fontSize: FONT_SIZES.xxl,
    letterSpacing: 6,
    marginTop: SPACING.md,
    color: COLORS.cyan,
  },
  subtitle: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textDim,
    letterSpacing: 4,
    marginTop: SPACING.xs,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.cyan,
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.panelBorder,
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  inputRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.lg,
    color: COLORS.terminalGreen,
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
    borderRadius: 2,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.darkPanel,
  },
  randomBtn: {
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
    borderRadius: 2,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
  },
  randomText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  devNote: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  walletOption: {
    marginTop: SPACING.md,
  },
  walletNote: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  connectingText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.cyan,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  legal: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.textDim,
    textAlign: 'center',
    lineHeight: 14,
    marginTop: SPACING.md,
  },
});
