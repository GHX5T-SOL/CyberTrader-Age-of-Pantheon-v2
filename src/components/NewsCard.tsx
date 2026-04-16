import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../theme';
import { MarketNews } from '../engine/types';

interface Props {
  news: MarketNews;
  currentTick: number;
}

export function NewsCard({ news, currentTick }: Props) {
  const ticksLeft = news.expiresAtTick - currentTick;
  const dirColor = news.direction === 'up' ? COLORS.green
    : news.direction === 'down' ? COLORS.red
    : COLORS.amber;

  const credColor = news.credibility > 0.7 ? COLORS.green
    : news.credibility > 0.4 ? COLORS.amber
    : COLORS.red;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.dirIndicator, { backgroundColor: dirColor }]} />
        <Text style={styles.headline} numberOfLines={2}>
          {news.headline}
        </Text>
      </View>

      <Text style={styles.body} numberOfLines={2}>
        {news.body}
      </Text>

      <View style={styles.meta}>
        <Text style={styles.tickers}>
          {news.affectedTickers.map((t) => t.toUpperCase()).join(', ')}
        </Text>
        <View style={styles.metaRight}>
          <Text style={[styles.credibility, { color: credColor }]}>
            CRED: {(news.credibility * 100).toFixed(0)}%
          </Text>
          <Text style={styles.expires}>
            {ticksLeft > 0 ? `${ticksLeft} ticks` : 'EXPIRED'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
    borderRadius: 4,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.darkPanel,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  dirIndicator: {
    width: 4,
    height: 16,
    borderRadius: 2,
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  headline: {
    flex: 1,
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  body: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.md,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: SPACING.md,
  },
  tickers: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.cyan,
  },
  metaRight: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  credibility: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
  },
  expires: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDim,
  },
});
