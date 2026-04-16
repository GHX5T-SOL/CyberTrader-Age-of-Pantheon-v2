import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../src/theme';
import { usePlayerStore } from '../src/stores/playerStore';
import { TerminalButton } from '../src/components/TerminalButton';

const TYPE_COLORS: Record<string, string> = {
  trade: COLORS.cyan,
  news: COLORS.amber,
  energy: COLORS.green,
  heat: COLORS.red,
  rank: COLORS.violet,
  system: COLORS.textSecondary,
};

export default function NotificationsScreen() {
  const notifications = usePlayerStore((s) => s.notifications);
  const markNotificationRead = usePlayerStore((s) => s.markNotificationRead);
  const clearNotifications = usePlayerStore((s) => s.clearNotifications);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TerminalButton title="< BACK" onPress={() => router.back()} variant="ghost" size="sm" />
        <Text style={styles.headerTitle}>NOTIFICATIONS</Text>
        {notifications.length > 0 && (
          <TerminalButton title="CLEAR" onPress={clearNotifications} variant="danger" size="sm" />
        )}
        {notifications.length === 0 && <View style={{ width: 80 }} />}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {unread > 0 && (
          <Text style={styles.unreadBanner}>{unread} UNREAD</Text>
        )}

        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{'>'} NO SIGNALS</Text>
            <Text style={styles.emptyHint}>Notifications from trades, news, and system events appear here.</Text>
          </View>
        ) : (
          notifications.map((n) => (
            <Pressable
              key={n.id}
              style={[styles.notifCard, !n.read && styles.notifUnread]}
              onPress={() => markNotificationRead(n.id)}
            >
              <View style={styles.notifHeader}>
                <View style={[styles.typeDot, { backgroundColor: TYPE_COLORS[n.type] ?? COLORS.textDim }]} />
                <Text style={styles.notifType}>{n.type.toUpperCase()}</Text>
                <Text style={styles.notifTime}>
                  {formatTime(n.timestamp)}
                </Text>
              </View>
              <Text style={styles.notifTitle}>{n.title}</Text>
              <Text style={styles.notifBody}>{n.body}</Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.panelBorder },
  headerTitle: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.md, color: COLORS.cyan, letterSpacing: 2 },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  unreadBanner: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.red, letterSpacing: 2, textAlign: 'center', marginBottom: SPACING.md },
  emptyState: { alignItems: 'center', paddingVertical: SPACING.xxl },
  emptyText: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.lg, color: COLORS.textDim },
  emptyHint: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.textDim, marginTop: SPACING.sm, textAlign: 'center' },
  notifCard: { borderWidth: 1, borderColor: COLORS.panelBorder, borderRadius: 4, padding: SPACING.md, marginBottom: SPACING.sm, backgroundColor: COLORS.darkPanel },
  notifUnread: { borderLeftWidth: 3, borderLeftColor: COLORS.cyan },
  notifHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: 4 },
  typeDot: { width: 6, height: 6, borderRadius: 3 },
  notifType: { fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textDim, letterSpacing: 1, flex: 1 },
  notifTime: { fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textDim },
  notifTitle: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.sm, color: COLORS.textPrimary, fontWeight: 'bold' },
  notifBody: { fontFamily: FONTS.mono, fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, marginTop: 2, lineHeight: 18 },
});
