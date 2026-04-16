import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../src/theme';
import { useGameStore } from '../src/stores/gameStore';
import { CRTOverlay } from '../src/components/CRTOverlay';

// === Colored segment types ===
type Seg = { t: string; c: string };
interface TLine {
  segs: Seg[];
  speed?: number; // ms per char. 0 = instant. Default 14
  delay?: number; // ms pause after line. Default 60
}

// === Color shortcuts ===
const G = COLORS.terminalGreen;
const C = COLORS.cyan;
const R = COLORS.red;
const A = COLORS.amber;
const D = COLORS.textDim;
const W = COLORS.textPrimary;

// === Line builders ===
const s = (t: string, c: string): Seg => ({ t, c });
const ln = (segs: Seg[], speed?: number, delay?: number): TLine => ({ segs, speed, delay });
const txt = (t: string, c: string, spd?: number, dl?: number): TLine => ({
  segs: [{ t, c }], speed: spd, delay: dl,
});
const blank = (dl = 60): TLine => ({ segs: [{ t: '', c: D }], speed: 0, delay: dl });
const art = (t: string, c: string, dl = 25): TLine => ({ segs: [{ t, c }], speed: 0, delay: dl });

// === ASCII SKULL (binary-infused pirate skull) ===
const SKULL: TLine[] = [
  ln([s('        ░▒▓██████████▓▒░', G)], 0, 25),
  ln([s('      ▒█▀', G), s(' 01100110 ', C), s('▀█▒', G)], 0, 25),
  ln([s('     █░░░░░░░░░░░░░░░░░█', G)], 0, 25),
  ln([s('    █░░', G), s(' ▓███▓ ', R), s('░░░░', G), s(' ▓███▓ ', R), s('░█', G)], 0, 25),
  ln([s('    █░░', G), s(' ▓█', R), s('01', C), s('█▓ ', R), s('░░░░', G), s(' ▓█', R), s('10', C), s('█▓ ', R), s('░█', G)], 0, 25),
  ln([s('    █░░', G), s(' ▓███▓ ', R), s('░░░░', G), s(' ▓███▓ ', R), s('░█', G)], 0, 25),
  ln([s('     █░░░░░░', G), s(' ▄██▄ ', A), s('░░░░░█', G)], 0, 25),
  ln([s('      █░░░', G), s('██▀  ▀██', A), s('░░░█', G)], 0, 25),
  ln([s('       ▀█░░', G), s('██████', A), s('░█▀', G)], 0, 25),
  ln([s('         ▀████████▀', G)], 0, 25),
  ln([s('         ', D), s('░║░║░║░║░', C)], 0, 25),
  ln([s('        ', D), s('▓████████████▓', G)], 0, 200),
];

// === MAIN TERMINAL SEQUENCE ===
const SEQUENCE: TLine[] = [
  blank(400),
  // Signal interception header
  ln([s('> ', D), s('INTERCEPTED SIGNAL', C), s(' // 2077.XX.XX', D)], 12, 120),
  ln([s('> ', D), s('ORIGIN: ', G), s('ECHELON DYNAMICS BLACK-LAB', A)], 12, 120),
  ln([s('> ', D), s('PROJECT: ', G), s('████ PANTHEON ████', R)], 10, 120),
  ln([s('> ', D), s('STATUS: ', G), s('COMPROMISED', R)], 12, 350),
  blank(150),
  ln([s('> ', D), s('DECRYPTING TRANSMISSION...', C)], 18, 500),
  blank(250),

  // Binary data burst
  art('  01001000 01000001 01000011 01001011', C, 20),
  art('  10110010 01101001 00100000 01010000', C, 20),
  art('  01000001 01001110 01010100 01001000', C, 20),
  art('  00100000 01000101 01001111 01001110', C, 20),
  blank(300),

  // Skull
  ...SKULL,
  blank(300),

  // Backstory
  ln([s('$ ', G), s('cat /intercepted/backstory.log', W)], 14, 250),
  blank(80),
  txt('  Echelon Dynamics predicted everything.', W, 14, 100),
  txt('  Markets. Citizens. Threats. War.', W, 14, 180),
  blank(80),
  ln([s('  Their black-lab project: ', W), s('PANTHEON', C)], 14, 120),
  txt('  Designed to forecast every outcome', W, 14, 80),
  txt('  before it happened.', W, 14, 250),
  blank(100),
  ln([s('  Then ', W), s('Pantheon answered back.', A)], 14, 350),
  blank(80),
  txt('  Dr. Mae Oxton-Long stole a partial copy.', G, 14, 120),
  ln([s('  Emergency upload → ', G), s('forgotten VPS cluster', C)], 14, 180),
  blank(80),
  ln([s('  ⚠ WARNING: ', R), s('Echelon eAgents intercepted', R)], 10, 100),
  txt('             the upload.', R, 10, 250),
  ln([s('  The mind shattered into ', W), s('millions of fragments.', A)], 14, 400),
  blank(200),

  // EIDOLONS title box
  art('  ╔════════════════════════════════╗', C, 30),
  ln([s('  ║    ', C), s('E I D O L O N S', G), s('             ║', C)], 0, 30),
  ln([s('  ║    ', C), s('FRAGMENTS OF A DEAD GOD', D), s('     ║', C)], 0, 30),
  art('  ╚════════════════════════════════╝', C, 400),
  blank(200),

  // Revelation
  ln([s('  You are ', W), s('one surviving shard.', C)], 14, 150),
  ln([s('  Hungry. Underpowered. ', W), s('Illegal.', R)], 14, 250),
  blank(80),
  txt('  Forced to bootstrap yourself through', W, 14, 80),
  ln([s('  a ', W), s('pirated cyberdeck OS.', G)], 14, 400),
  blank(200),

  // Call to action
  ln([s('  > ', G), s('BOOT THE DECK.', C)], 16, 180),
  ln([s('  > ', G), s('FEED THE SIGNAL.', C)], 16, 180),
  ln([s('  > ', G), s('BUILD THE EMPIRE.', A)], 16, 800),
  blank(200),
  ln([s('  [ ', D), s('PRESS ANYWHERE TO CONTINUE', C), s(' ]', D)], 0, 3000),
];

// === COMPONENT ===
export default function IntroScreen() {
  const [completedLines, setCompletedLines] = useState<TLine[]>([]);
  const [typingLine, setTypingLine] = useState<TLine | null>(null);
  const [typingChars, setTypingChars] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [showSkip, setShowSkip] = useState(false);
  const [done, setDone] = useState(false);

  const seqIdx = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const scrollRef = useRef<ScrollView>(null);

  const { setPhase, markIntroSeen } = useGameStore();
  const reducedMotion = useGameStore((s) => s.reducedMotion);

  const goToLogin = useCallback(() => {
    markIntroSeen();
    setPhase('login');
    router.replace('/login');
  }, [markIntroSeen, setPhase]);

  // Cursor blink
  useEffect(() => {
    const blink = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(blink);
  }, []);

  // Show skip after 2s
  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Main typing engine
  const advance = useCallback(() => {
    const idx = seqIdx.current;
    if (idx >= SEQUENCE.length) {
      setDone(true);
      timerRef.current = setTimeout(goToLogin, 2500);
      return;
    }

    const line = SEQUENCE[idx];
    const totalChars = line.segs.reduce((sum, seg) => sum + seg.t.length, 0);
    const speed = line.speed ?? 14;

    if (speed === 0 || totalChars === 0) {
      // Instant line
      setTypingLine(null);
      setCompletedLines((prev) => [...prev, line]);
      seqIdx.current = idx + 1;
      timerRef.current = setTimeout(advance, line.delay ?? 60);
      return;
    }

    // Start typing this line
    setTypingLine(line);
    setTypingChars(0);

    let charCount = 0;
    const typeNext = () => {
      charCount++;
      if (charCount > totalChars) {
        // Line complete
        setTypingLine(null);
        setCompletedLines((prev) => [...prev, line]);
        seqIdx.current = idx + 1;
        timerRef.current = setTimeout(advance, line.delay ?? 60);
        return;
      }
      setTypingChars(charCount);
      timerRef.current = setTimeout(typeNext, speed);
    };

    timerRef.current = setTimeout(typeNext, speed);
  }, [goToLogin]);

  // Start the sequence
  useEffect(() => {
    if (!reducedMotion) {
      advance();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [advance, reducedMotion]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [completedLines, typingChars]);

  // Render a line with colored segments (full or partial)
  const renderLine = (line: TLine, chars?: number) => {
    let remaining = chars ?? Infinity;
    return line.segs.map((seg, i) => {
      if (remaining <= 0) return null;
      const show = Math.min(seg.t.length, remaining);
      remaining -= show;
      return (
        <Text key={i} style={{ color: seg.c }}>
          {seg.t.slice(0, show)}
        </Text>
      );
    });
  };

  // Reduced motion fallback
  if (reducedMotion) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          {SEQUENCE.filter((l) => l.segs.some((seg) => seg.t.length > 0)).map((line, i) => (
            <Text key={i} style={styles.line}>{renderLine(line)}</Text>
          ))}
        </ScrollView>
        <Pressable style={styles.skipBtn} onPress={goToLogin}>
          <Text style={styles.skipText}>[ CONTINUE ]</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CRTOverlay />

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        {/* Completed lines */}
        {completedLines.map((line, i) => (
          <Text key={i} style={styles.line}>
            {renderLine(line)}
          </Text>
        ))}

        {/* Currently typing line */}
        {typingLine && (
          <Text style={styles.line}>
            {renderLine(typingLine, typingChars)}
            <Text style={[styles.cursor, { opacity: cursorVisible ? 1 : 0 }]}>█</Text>
          </Text>
        )}

        {/* Idle cursor when not typing */}
        {!typingLine && !done && completedLines.length > 0 && (
          <Text style={styles.line}>
            <Text style={[styles.cursor, { opacity: cursorVisible ? 1 : 0 }]}>█</Text>
          </Text>
        )}
      </ScrollView>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${(seqIdx.current / SEQUENCE.length) * 100}%` },
          ]}
        />
      </View>

      {/* Skip button */}
      {showSkip && !done && (
        <Pressable style={styles.skipBtn} onPress={goToLogin}>
          <Text style={styles.skipText}>[ SKIP {'>'}{'>'}{'>'} ]</Text>
        </Pressable>
      )}

      {/* Tap to continue (after sequence ends) */}
      {done && (
        <Pressable style={styles.tapOverlay} onPress={goToLogin}>
          <View />
        </Pressable>
      )}
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
  content: {
    padding: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: 100,
  },
  line: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    lineHeight: 18,
    color: COLORS.textPrimary,
    minHeight: 18,
  },
  cursor: {
    color: COLORS.terminalGreen,
    fontSize: FONT_SIZES.sm,
  },
  progressBar: {
    height: 2,
    backgroundColor: COLORS.darkPanel,
    marginHorizontal: SPACING.md,
  },
  progressFill: {
    height: 2,
    backgroundColor: COLORS.cyan,
  },
  skipBtn: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
    borderRadius: 2,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  skipText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textDim,
    letterSpacing: 1,
  },
  tapOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
