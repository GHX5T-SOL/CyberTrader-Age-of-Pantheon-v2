// ── Core Game Types ──────────────────────────────────────────────────────────

export type WalletMode = 'dev-identity' | 'web-wallet' | 'mobile-wallet-adapter';

export type OSTier = 'pirate' | 'agent' | 'pantheon';

export interface CurrencyLedger {
  zeroBol: number;    // free, non-withdrawable 0BOL
  obolToken: number;  // optional on-chain $OBOL (feature-flagged)
}

export interface PlayerProfile {
  id: string;
  walletAddress: string | null;
  walletMode: WalletMode | null;
  eidolonHandle: string;
  createdAt: number;
  currentOs: OSTier;
  rankLevel: number;
  rankTitle: string;
  xp: number;
  factionId: string | null;
}

export interface Resources {
  energyHours: number;
  energyLastUpdate: number; // timestamp for drain calc
  heat: number;
  heatLastUpdate: number;   // timestamp for decay calc
}

export interface Commodity {
  id: string;
  ticker: string;
  name: string;
  lore: string;
  basePrice: number;
  volatility: number;  // 0-1, higher = wilder swings
  size: number;         // storage units per 1 qty
  heatRisk: number;     // 0-1, heat generated per trade
  tags: string[];
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

export interface Position {
  commodityId: string;
  quantity: number;
  averageEntry: number;
  realizedPnl: number;
}

export interface PricePoint {
  price: number;
  tick: number;
  timestamp: number;
}

export interface MarketState {
  tick: number;
  prices: Record<string, number>;           // commodityId -> current price
  priceHistory: Record<string, PricePoint[]>; // commodityId -> history
  activeNews: MarketNews[];
}

export interface MarketNews {
  id: string;
  headline: string;
  body: string;
  affectedTickers: string[];
  direction: 'up' | 'down' | 'mixed';
  multiplier: number;       // price effect multiplier
  credibility: number;      // 0-1, low = possibly fake
  expiresAtTick: number;
  createdAtTick: number;
  isFake: boolean;
}

export interface TradeOrder {
  commodityId: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
}

export interface TradeResult {
  success: boolean;
  message: string;
  executedPrice: number;
  quantity: number;
  totalCost: number;
  fee: number;
  heatGenerated: number;
  xpGained: number;
}

export interface RankInfo {
  level: number;
  title: string;
  xpRequired: number;
  unlocks: string[];
}

export interface Notification {
  id: string;
  type: 'trade' | 'news' | 'energy' | 'heat' | 'rank' | 'system';
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
}

export type GamePhase = 'intro' | 'login' | 'boot' | 'playing';

export interface TutorialStep {
  id: string;
  message: string;
  target?: string; // component to highlight
  action?: string; // what user needs to do
}

export const CONSTANTS = {
  STARTING_ZERO_BOL: 1_000_000,
  STARTING_ENERGY_HOURS: 72,
  MAX_HEAT: 100,
  TRADE_FEE_PERCENT: 0.02,
  SLIPPAGE_THRESHOLD: 0.1, // 10% of commodity, triggers slippage
  SLIPPAGE_RATE: 0.03,
  TICK_INTERVAL_MS: 45_000, // 45 seconds per tick
  ENERGY_DRAIN_PER_HOUR: 1,
  HEAT_DECAY_PER_MINUTE: 0.5,
  MAX_INVENTORY_SIZE: 500,
  ENERGY_COST_PER_HOUR: 5_000, // 0BOL per hour of energy
  NEWS_SPAWN_CHANCE: 0.35,
  MAX_PRICE_HISTORY: 100,
  AGENT_OS_RANK: 5,
  PANTHEON_OS_RANK: 20,
} as const;
