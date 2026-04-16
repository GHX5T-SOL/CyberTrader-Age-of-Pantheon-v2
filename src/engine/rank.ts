import { RankInfo, OSTier } from './types';

export const RANKS: RankInfo[] = [
  { level: 0,  title: 'Boot Ghost',          xpRequired: 0,      unlocks: ['Pirate OS', 'S1LKROAD tutorial'] },
  { level: 1,  title: 'Packet Rat',          xpRequired: 100,    unlocks: ['More tickers', 'Basic news credibility'] },
  { level: 2,  title: 'Signal Runner',       xpRequired: 300,    unlocks: ['Active positions view', 'Limit order simulation'] },
  { level: 3,  title: 'Black Terminal',       xpRequired: 600,    unlocks: ['Energy auto-buy', 'Inventory expansion'] },
  { level: 5,  title: 'Node Thief',          xpRequired: 1200,   unlocks: ['AgentOS unlock', 'Profile depth', 'Faction choice'] },
  { level: 8,  title: 'Route Phantom',       xpRequired: 2500,   unlocks: ['Node puzzles', 'Tor Exit Node'] },
  { level: 12, title: 'Grid Smuggler',       xpRequired: 5000,   unlocks: ['City route map', 'Faction missions'] },
  { level: 16, title: 'eCriminal Architect', xpRequired: 10000,  unlocks: ['Advanced OS modules', 'Passive upgrades'] },
  { level: 20, title: 'Pantheon Candidate',  xpRequired: 20000,  unlocks: ['PantheonOS unlock', 'Territory map'] },
  { level: 30, title: 'Neon Warlord',        xpRequired: 50000,  unlocks: ['Crew wars', 'Seasonal dominance'] },
  { level: 40, title: 'Pantheon Ascendant',  xpRequired: 100000, unlocks: ['Endgame legend track'] },
];

/** Get rank info for a given level */
export function getRankForLevel(level: number): RankInfo {
  let rankInfo = RANKS[0];
  for (const r of RANKS) {
    if (level >= r.level) rankInfo = r;
  }
  return rankInfo;
}

/** Get rank info for a given XP amount */
export function getRankForXp(xp: number): RankInfo {
  let rankInfo = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.xpRequired) rankInfo = r;
  }
  return rankInfo;
}

/** Calculate level from XP */
export function calculateLevel(xp: number): number {
  return getRankForXp(xp).level;
}

/** Get XP needed for next rank */
export function xpToNextRank(xp: number): { current: number; needed: number; progress: number } {
  const currentRank = getRankForXp(xp);
  const currentIndex = RANKS.indexOf(currentRank);
  const nextRank = RANKS[currentIndex + 1];

  if (!nextRank) {
    return { current: xp, needed: currentRank.xpRequired, progress: 1 };
  }

  const xpIntoRank = xp - currentRank.xpRequired;
  const xpForRank = nextRank.xpRequired - currentRank.xpRequired;
  return {
    current: xpIntoRank,
    needed: xpForRank,
    progress: Math.min(1, xpIntoRank / xpForRank),
  };
}

/** Get the OS tier that should be active at a given rank */
export function osForRank(rankLevel: number): OSTier {
  if (rankLevel >= 20) return 'pantheon';
  if (rankLevel >= 5) return 'agent';
  return 'pirate';
}

/** Calculate XP from a profitable trade */
export function xpFromTrade(profitPercent: number): number {
  if (profitPercent <= 0) return 0;
  return Math.max(1, Math.floor(profitPercent * 100));
}

/** XP rewards for specific actions */
export const XP_REWARDS = {
  TUTORIAL_COMPLETE: 50,
  FIRST_TRADE: 25,
  SURVIVED_SWEEP: 25,
  NEWS_CORRECT_CALL: 15,
  PROFITABLE_TRADE_BASE: 5,
} as const;
