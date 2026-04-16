import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../src/theme';
import { useGameStore } from '../src/stores/gameStore';
import { usePlayerStore } from '../src/stores/playerStore';
import { useMarketStore } from '../src/stores/marketStore';
import { CRTOverlay } from '../src/components/CRTOverlay';
import { Logo } from '../src/components/Logo';

// === Boot messages with status types ===
interface BootMsg {
  text: string;
  status: 'ok' | 'warn' | 'fail' | 'info';
  delay?: number; // ms before showing (default 250)
}

const BOOT_MESSAGES: BootMsg[] = [
  { text: 'ESTABLISHING SYSLINK...', status: 'ok' },
  { text: 'ROUTING VIA ONION RELAY x3...', status: 'ok' },
  { text: 'NEGOTIATING TOR HANDSHAKE...', status: 'ok' },
  { text: 'CONNECTING TO DARKNET NODE...', status: 'ok' },
  { text: 'SSL CERT FORGED — BYPASSING CA...', status: 'warn', delay: 350 },
  { text: 'SECURING ENCRYPTED CHANNEL...', status: 'ok' },
  { text: 'VERIFYING EIDOLON SIGNATURE...', status: 'ok' },
  { text: 'LOADING PIRATE KERNEL v0.7.3...', status: 'ok', delay: 400 },
  { text: 'MOUNTING ENCRYPTED VOLUMES...', status: 'ok' },
  { text: 'PATCHING MEMORY ALLOCATOR...', status: 'warn' },
  { text: 'INITIALIZING MARKET FEEDS...', status: 'ok', delay: 300 },
  { text: 'SYNCING S1LKROAD 4.0 MANIFEST...', status: 'ok' },
  { text: 'LOADING COMMODITY DATABASES...', status: 'ok' },
  { text: 'CALIBRATING PRICE ORACLES...', status: 'ok' },
  { text: 'BOOTING Ag3nt_0S//pIRAT3...', status: 'info', delay: 500 },
];

// === ASCII Art Banner ===
const BANNER_ART = [
  { text: '╔═══════════════════════════════════════╗', color: COLORS.cyan },
  { text: '║                                       ║', color: COLORS.cyan },
  { text: '║   ░█▀█░█▀▀░▀▀█░█▀█░▀█▀░  _0S        ║', color: COLORS.terminalGreen },
  { text: '║   ░█▀█░█░█░░▀▄░█░█░░█░░  //          ║', color: COLORS.terminalGreen },
  { text: '║   ░▀░▀░▀▀▀░▀▀░░▀░▀░░▀░░  pIRAT3     ║', color: COLORS.terminalGreen },
  { text: '║                                       ║', color: COLORS.cyan },
  { text: '║   ░▒▓ PIRATE SIGNAL ACTIVE ▓▒░        ║', color: COLORS.amber },
  { text: '║                                       ║', color: COLORS.cyan },
  { text: '╚═══════════════════════════════════════╝', color: COLORS.cyan },
];

const SHIP_ART = [
  { text: '                  |    |    |', color: COLORS.textDim },
  { text: '                 )_)  )_)  )_)', color: COLORS.textDim },
  { text: '                )___))___))___)', color: COLORS.terminalGreen },
  { text: '               )____)____)_____)', color: COLORS.terminalGreen },
  { text: '             _____|____|____|____', color: COLORS.terminalGreen },
  { text: '    ---------\\  01100110  10011 /---------', color: COLORS.cyan },
  { text: '      ^^^^^ ^^^^^^^^^^^^^^^^^^^', color: COLORS.cyanDim },
  { text: '        ^^^^      ^^^^     ^^^    ^^', color: COLORS.cyanDim },
  { text: '             ^^^^      ^^^', color: COLORS.cyanDim },
];

// Status tag colors
const STATUS_COLORS: Record<string, string> = {
  ok: COLORS.green,
  warn: COLORS.amber,
  fail: COLORS.red,
  info: COLORS.cyan,
};

const STATUS_LABELS: Record<string, string> = {
  ok: ' OK ',
  warn: 'WARN',
  fail: 'FAIL',
  info: 'INFO',
};

export default function BootScreen() {
  const [messages, setMessages] = useState<BootMsg[]>([]);
  const [showBanner, setShowBanner] = useState(false);
  const [showShip, setShowShip] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);
  const [progressPct, setProgressPct] = useState(0);

  const scrollRef = useRef<ScrollView>(null);
  const { setPhase } = useGameStore();
  const profile = usePlayerStore((s) => s.profile);
  const { initializeMarket } = useMarketStore();

  // Boot sequence
  useEffect(() => {
    initializeMarket();

    let msgIndex = 0;
    const addNext = () => {
      if (msgIndex >= BOOT_MESSAGES.length) {
        // All messages done — show banner
        setTimeout(() => setShowBanner(true), 400);
        setTimeout(() => setShowShip(true), 1200);
        setTimeout(() => setBootComplete(true), 2200);
        return;
      }

      const msg = BOOT_MESSAGES[msgIndex];
      setMessages((prev) => [...prev, msg]);
      setProgressPct(((msgIndex + 1) / BOOT_MESSAGES.length) * 100);
      msgIndex++;

      setTimeout(addNext, msg.delay ?? 250);
    };

    // Initial delay before boot starts
    setTimeout(addNext, 600);
  }, [initializeMarket]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, showBanner, showShip]);

  // Navigate when boot complete
  useEffect(() => {
    if (bootComplete) {
      const timer = setTimeout(() => {
        setPhase('playing');
        router.replace('/cyberdeck');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [bootComplete, setPhase]);

  return (
    <SafeAreaView style={styles.container}>
      <CRTOverlay />

      {/* Top header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {'>'} EIDOLON BOOT SEQUENCE v0.7.3
        </Text>
        <Text style={styles.handleText}>
          HANDLE: {profile?.eidolonHandle ?? 'UNKNOWN'} | PID: {Math.floor(Math.random() * 9000 + 1000)}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressOuter}>
        <View style={[styles.progressInner, { width: `${progressPct}%` }]} />
        <Text style={styles.progressLabel}>{Math.round(progressPct)}%</Text>
      </View>

      <View style={styles.divider} />

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Boot messages */}
        {messages.map((msg, i) => (
          <View key={i} style={styles.msgRow}>
            <Text style={[styles.statusTag, { color: STATUS_COLORS[msg.status] }]}>
              [{STATUS_LABELS[msg.status]}]
            </Text>
            <Text style={styles.msgText}>{msg.text}</Text>
          </View>
        ))}

        {/* ASCII Banner */}
        {showBanner && (
          <View style={styles.artSection}>
            {BANNER_ART.map((line, i) => (
              <Text key={`b${i}`} style={[styles.artLine, { color: line.color }]}>
                {line.text}
              </Text>
            ))}
          </View>
        )}

        {/* Ship art */}
        {showShip && (
          <View style={styles.artSection}>
            {SHIP_ART.map((line, i) => (
              <Text key={`s${i}`} style={[styles.artLine, { color: line.color }]}>
                {line.text}
              </Text>
            ))}
          </View>
        )}

        {/* Logo */}
        {showBanner && (
          <View style={styles.logoSection}>
            <Logo size={60} color={COLORS.terminalGreen} />
          </View>
        )}

        {/* Boot complete */}
        {bootComplete && (
          <View style={styles.bootDoneSection}>
            <Text style={styles.sysOnline}>
              ▓▓▓ SYSTEM ONLINE ▓▓▓
            </Text>
            <Text style={styles.enterText}>
              {'>'} ENTERING CYBERDECK...
            </Text>
          </View>
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
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  headerText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.cyan,
  },
  handleText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
    marginTop: 2,
  },
  progressOuter: {
    height: 14,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
    backgroundColor: COLORS.darkPanel,
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
    borderRadius: 2,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressInner: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.terminalGreenDim,
  },
  progressLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.terminalGreen,
    textAlign: 'center',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.panelBorder,
    marginHorizontal: SPACING.md,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  msgRow: {
    flexDirection: 'row',
    marginBottom: 3,
    alignItems: 'flex-start',
  },
  statusTag: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    width: 50,
    marginRight: SPACING.xs,
  },
  msgText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.terminalGreen,
    flex: 1,
  },
  artSection: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  artLine: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    lineHeight: 13,
    textAlign: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  bootDoneSection: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  sysOnline: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.green,
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  enterText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.cyan,
  },
});
