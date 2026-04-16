import { create } from 'zustand';
import { MarketNews, PricePoint, CONSTANTS } from '../engine/types';
import { initializeMarketPrices, processMarketTick } from '../engine/market';
import { generateNewsEvent, pruneExpiredNews } from '../engine/news';
import { SeededRandom } from '../engine/seededRandom';
import { COMMODITIES } from '../engine/commodities';

interface MarketStoreState {
  tick: number;
  prices: Record<string, number>;
  priceHistory: Record<string, PricePoint[]>;
  activeNews: MarketNews[];
  selectedCommodityId: string;
  tickIntervalId: ReturnType<typeof setInterval> | null;
  isRunning: boolean;

  // Actions
  initializeMarket: () => void;
  processTick: (heat: number) => void;
  startTicking: (getHeat: () => number) => void;
  stopTicking: () => void;
  selectCommodity: (id: string) => void;
  getPrice: (commodityId: string) => number;
  getPriceChange: (commodityId: string) => number;
}

export const useMarketStore = create<MarketStoreState>((set, get) => ({
  tick: 0,
  prices: {},
  priceHistory: {},
  activeNews: [],
  selectedCommodityId: 'vblm', // Start with beginner-friendly Void Bloom
  tickIntervalId: null,
  isRunning: false,

  initializeMarket: () => {
    const prices = initializeMarketPrices();
    const now = Date.now();
    const priceHistory: Record<string, PricePoint[]> = {};
    for (const c of COMMODITIES) {
      priceHistory[c.id] = [{ price: prices[c.id], tick: 0, timestamp: now }];
    }
    set({ prices, priceHistory, tick: 0, activeNews: [] });
  },

  processTick: (heat) => {
    const state = get();
    const newTick = state.tick + 1;
    const now = Date.now();
    const rng = new SeededRandom(newTick * 31337);

    // Maybe spawn news
    let news = [...state.activeNews];
    if (rng.chance(CONSTANTS.NEWS_SPAWN_CHANCE)) {
      const newsEvent = generateNewsEvent(newTick, rng);
      if (newsEvent) {
        news.push(newsEvent);
      }
    }

    // Process prices
    const newPrices = processMarketTick(state.prices, news, heat, newTick);

    // Update price history
    const newHistory = { ...state.priceHistory };
    for (const c of COMMODITIES) {
      const history = [...(newHistory[c.id] || [])];
      history.push({ price: newPrices[c.id], tick: newTick, timestamp: now });
      // Keep limited history
      if (history.length > CONSTANTS.MAX_PRICE_HISTORY) {
        history.shift();
      }
      newHistory[c.id] = history;
    }

    // Prune expired news
    news = pruneExpiredNews(news, newTick);

    set({
      tick: newTick,
      prices: newPrices,
      priceHistory: newHistory,
      activeNews: news,
    });
  },

  startTicking: (getHeat) => {
    const state = get();
    if (state.tickIntervalId) return;

    // Initialize if needed
    if (Object.keys(state.prices).length === 0) {
      get().initializeMarket();
    }

    const intervalId = setInterval(() => {
      get().processTick(getHeat());
    }, CONSTANTS.TICK_INTERVAL_MS);

    set({ tickIntervalId: intervalId, isRunning: true });
  },

  stopTicking: () => {
    const { tickIntervalId } = get();
    if (tickIntervalId) {
      clearInterval(tickIntervalId);
      set({ tickIntervalId: null, isRunning: false });
    }
  },

  selectCommodity: (id) => set({ selectedCommodityId: id }),

  getPrice: (commodityId) => {
    return get().prices[commodityId] ?? 0;
  },

  getPriceChange: (commodityId) => {
    const history = get().priceHistory[commodityId];
    if (!history || history.length < 2) return 0;
    const current = history[history.length - 1].price;
    const previous = history[history.length - 2].price;
    return previous > 0 ? (current - previous) / previous : 0;
  },
}));
