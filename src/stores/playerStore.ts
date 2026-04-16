import { create } from 'zustand';
import { PlayerProfile, Resources, Position, CurrencyLedger, Notification, CONSTANTS, WalletMode } from '../engine/types';
import { calculateCurrentEnergy, buyEnergy } from '../engine/energy';
import { calculateCurrentHeat, addTradeHeat } from '../engine/heat';
import { getRankForXp, calculateLevel, osForRank, xpToNextRank } from '../engine/rank';
import { executeTrade, totalInventorySize } from '../engine/market';
import { getCommodity } from '../engine/commodities';

interface PlayerState {
  profile: PlayerProfile | null;
  resources: Resources;
  currency: CurrencyLedger;
  positions: Position[];
  notifications: Notification[];
  totalRealizedPnl: number;
  totalTradeCount: number;

  // Actions
  createProfile: (handle: string, walletAddress: string | null, walletMode: WalletMode) => void;
  getEnergy: () => number;
  getHeat: () => number;
  purchaseEnergy: (hours: number) => { success: boolean; message: string };
  executeTradeOrder: (commodityId: string, side: 'buy' | 'sell', quantity: number, currentPrice: number) => { success: boolean; message: string; xpGained: number };
  addXp: (amount: number) => void;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  syncResources: () => void;
}

let notifCounter = 0;

export const usePlayerStore = create<PlayerState>((set, get) => ({
  profile: null,
  resources: {
    energyHours: CONSTANTS.STARTING_ENERGY_HOURS,
    energyLastUpdate: Date.now(),
    heat: 0,
    heatLastUpdate: Date.now(),
  },
  currency: {
    zeroBol: CONSTANTS.STARTING_ZERO_BOL,
    obolToken: 0,
  },
  positions: [],
  notifications: [],
  totalRealizedPnl: 0,
  totalTradeCount: 0,

  createProfile: (handle, walletAddress, walletMode) => {
    const now = Date.now();
    set({
      profile: {
        id: `eidolon-${now}-${Math.random().toString(36).slice(2, 8)}`,
        walletAddress,
        walletMode,
        eidolonHandle: handle,
        createdAt: now,
        currentOs: 'pirate',
        rankLevel: 0,
        rankTitle: 'Boot Ghost',
        xp: 0,
        factionId: null,
      },
      resources: {
        energyHours: CONSTANTS.STARTING_ENERGY_HOURS,
        energyLastUpdate: now,
        heat: 0,
        heatLastUpdate: now,
      },
      currency: {
        zeroBol: CONSTANTS.STARTING_ZERO_BOL,
        obolToken: 0,
      },
      positions: [],
      notifications: [],
      totalRealizedPnl: 0,
      totalTradeCount: 0,
    });
  },

  getEnergy: () => {
    const { resources } = get();
    return calculateCurrentEnergy(resources.energyHours, resources.energyLastUpdate);
  },

  getHeat: () => {
    const { resources } = get();
    return calculateCurrentHeat(resources.heat, resources.heatLastUpdate);
  },

  purchaseEnergy: (hours) => {
    const state = get();
    const currentEnergy = calculateCurrentEnergy(state.resources.energyHours, state.resources.energyLastUpdate);
    const result = buyEnergy(currentEnergy, hours, state.currency.zeroBol);

    if (result.success) {
      const now = Date.now();
      set({
        resources: {
          ...state.resources,
          energyHours: result.newEnergy,
          energyLastUpdate: now,
        },
        currency: {
          ...state.currency,
          zeroBol: state.currency.zeroBol - result.cost,
        },
      });
    }
    return { success: result.success, message: result.message };
  },

  executeTradeOrder: (commodityId, side, quantity, currentPrice) => {
    const state = get();
    const commodity = getCommodity(commodityId);
    const currentHeat = calculateCurrentHeat(state.resources.heat, state.resources.heatLastUpdate);
    const invSize = totalInventorySize(state.positions);

    const result = executeTrade(
      { commodityId, side, quantity, price: currentPrice },
      currentPrice,
      state.currency.zeroBol,
      state.positions,
      invSize,
      commodity.size,
      commodity.heatRisk
    );

    if (!result.success) {
      return { success: false, message: result.message, xpGained: 0 };
    }

    const now = Date.now();
    let newPositions = [...state.positions];
    let newRealizedPnl = state.totalRealizedPnl;

    if (side === 'buy') {
      const existing = newPositions.find((p) => p.commodityId === commodityId);
      if (existing) {
        const totalQty = existing.quantity + quantity;
        const totalCost = existing.averageEntry * existing.quantity + result.executedPrice * quantity;
        existing.averageEntry = totalCost / totalQty;
        existing.quantity = totalQty;
      } else {
        newPositions.push({
          commodityId,
          quantity,
          averageEntry: result.executedPrice,
          realizedPnl: 0,
        });
      }
    } else {
      const existing = newPositions.find((p) => p.commodityId === commodityId);
      if (existing) {
        const pnl = (result.executedPrice - existing.averageEntry) * quantity;
        existing.quantity -= quantity;
        existing.realizedPnl += pnl;
        newRealizedPnl += pnl;
        if (existing.quantity <= 0) {
          newPositions = newPositions.filter((p) => p.commodityId !== commodityId);
        }
      }
    }

    const newBalance = side === 'buy'
      ? state.currency.zeroBol - result.totalCost
      : state.currency.zeroBol + Math.abs(result.totalCost);

    const newHeat = addTradeHeat(currentHeat, result.heatGenerated);

    // Apply XP
    let newXp = state.profile?.xp ?? 0;
    newXp += result.xpGained;
    const newRank = getRankForXp(newXp);
    const newOs = osForRank(newRank.level);

    set({
      currency: { ...state.currency, zeroBol: Math.round(newBalance) },
      positions: newPositions,
      resources: {
        ...state.resources,
        heat: newHeat,
        heatLastUpdate: now,
      },
      totalRealizedPnl: newRealizedPnl,
      totalTradeCount: state.totalTradeCount + 1,
      profile: state.profile
        ? {
            ...state.profile,
            xp: newXp,
            rankLevel: newRank.level,
            rankTitle: newRank.title,
            currentOs: newOs,
          }
        : null,
    });

    return { success: true, message: result.message, xpGained: result.xpGained };
  },

  addXp: (amount) => {
    const state = get();
    if (!state.profile) return;
    const newXp = state.profile.xp + amount;
    const newRank = getRankForXp(newXp);
    const newOs = osForRank(newRank.level);
    set({
      profile: {
        ...state.profile,
        xp: newXp,
        rankLevel: newRank.level,
        rankTitle: newRank.title,
        currentOs: newOs,
      },
    });
  },

  addNotification: (n) => {
    notifCounter++;
    const notification: Notification = {
      ...n,
      id: `notif-${notifCounter}`,
      timestamp: Date.now(),
      read: false,
    };
    set((s) => ({
      notifications: [notification, ...s.notifications].slice(0, 50),
    }));
  },

  markNotificationRead: (id) => {
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  clearNotifications: () => set({ notifications: [] }),

  syncResources: () => {
    const state = get();
    const now = Date.now();
    const currentEnergy = calculateCurrentEnergy(state.resources.energyHours, state.resources.energyLastUpdate);
    const currentHeat = calculateCurrentHeat(state.resources.heat, state.resources.heatLastUpdate);
    set({
      resources: {
        energyHours: currentEnergy,
        energyLastUpdate: now,
        heat: currentHeat,
        heatLastUpdate: now,
      },
    });
  },
}));
