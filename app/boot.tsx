import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../src/theme';
import { useGameStore } from '../src/stores/gameStore';
import { usePlayerStore } from '../src/stores/playerStore';
import { useMarketStore } from '../src/stores/marketStore';
import { CRTOverlay } from '../src/components/CRTOverlay';
import { Logo } from '../src/components/Logo';

const BOOT_MESSAGES = [
  'ESTABLISHING SYSLINK...',
  'ROUTING VIA ONION RELAY...',
  'CONNECTING TO DARKWEB...',
  'NEGOTIATING MAINFRAME HANDSHAKE...',
  'SECURING ENCRYPTED LINE...',
  'VERIFYING EIDOLON SIGNATURE...',
  'MOUNTING PIRATE KERNEL...',
  'INITIALIZING MARKET FEEDS...',
  'LOADING S1LKROAD 4.0 MANIFEST...',
  'BOOTING Ag3nt_0S//pIRAT3...',
];

const ASCII_LOGO = `
    ╔══════════════════════════════╗
    ║   ░█▀█░█▀▀░▀▀█░█▀█░▀█▀░   ║
    ║   ░█▀█░█░█░░▀▄░█░█░░█░░   ║
    ║   ░▀░▀░▀▀▀░▀▀░░▀░▀░░▀░░   ║
    ║      _0S // p I R A T 3     ║
    ║                              ║
    ║   ◄◄ PIRATE SIGNAL ACTIVE ►►║
    ╚══════════════════════════════╝
`;

export default function BootScreen() {
  const [messages, setMessages] = useState<string[]>([]);
  const [showLogo, setShowLogo] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);
  const { setPhase } = useGameStore();
  const profile = usePlayerStore((s) => s.profile);
  const { initializeMarket } = useMarketStore();

  useEffect(() => {
    // Initialize market data during boot
    initializeMarket();

    let msgIndex = 0;
    const interval = setInterval(() => {
      if (msgIndex < BOOT_MESSAGES.length) {
        setMessages((prev) => [...prev, BOOT_MESSAGES[msgIndex]]);
        msgIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowLogo(true), 500);
        setTimeout(() => setBootComplete(true), 2000);
      }
    }, 350);

    return () => clearInterval(interval);
  }, [initializeMarket]);

  useEffect(() => {
    if (bootComplete) {
      const timer = setTimeout(() => {
        setPhase('playing');
        router.replace('/cyberdeck');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [bootComplete, setPhase]);

  return (
    <SafeAreaView style={styles.container}>
      <CRTOverlay />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={styles.header}>
          {'>'} EIDOLON BOOT SEQUENCE
        </Text>
        <Text style={styles.identity}>
          HANDLE: {profile?.eidolonHandle ?? 'UNKNOWN'}
        </Text>
        <View style={styles.divider} />

        {/* Boot messages */}
        {messages.map((msg, i) => (
          <View key={i} style={styles.msgRow}>
            <Text style={styles.msgOk}>[OK]</Text>
            <Text style={styles.msgText}>{msg}</Text>
          </View>
        ))}

        {/* ASCII logo */}
        {showLogo && (
          <View style={styles.logoSection}>
            <Logo size={80} color={COLORS.terminalGreen} />
            <Text style={styles.asciiArt}>{ASCII_LOGO}</Text>
            <Text style={styles.bootStatus}>
              SYSTEM ONLINE — PIRATE KERNEL v0.7.3
            </Text>
          </View>
        )}

        {bootComplete && (
          <Text style={styles.enterText}>
            {'\n'}{'>'} ENTERING CYBERDECK...
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  header: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.cyan,
    marginBottom: SPACING.xs,
  },
  identity: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
    marginBottom: SPACING.sm,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.panelBorder,
    marginBottom: SPACING.md,
  },
  msgRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  msgOk: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.green,
    width: 40,
  },
  msgText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.terminalGreen,
    flex: 1,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  asciiArt: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.terminalGreen,
    lineHeight: 14,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  bootStatus: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.green,
    marginTop: SPACING.sm,
    letterSpacing: 1,
  },
  enterText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.cyan,
    textAlign: 'center',
  },
});
