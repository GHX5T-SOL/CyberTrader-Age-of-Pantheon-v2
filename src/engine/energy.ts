import { CONSTANTS } from './types';

/** Calculate current energy after time-based drain */
export function calculateCurrentEnergy(
  storedEnergy: number,
  lastUpdateTimestamp: number,
  now: number = Date.now()
): number {
  const elapsedMs = now - lastUpdateTimestamp;
  const elapsedHours = elapsedMs / (1000 * 60 * 60);
  const drained = elapsedHours * CONSTANTS.ENERGY_DRAIN_PER_HOUR;
  return Math.max(0, storedEnergy - drained);
}

/** Check if player is in dormant mode */
export function isDormant(energyHours: number): boolean {
  return energyHours <= 0;
}

/** Calculate cost to buy energy hours */
export function energyPurchaseCost(hours: number): number {
  return hours * CONSTANTS.ENERGY_COST_PER_HOUR;
}

/** Buy energy, returns new energy and cost */
export function buyEnergy(
  currentEnergy: number,
  hoursToBuy: number,
  playerBalance: number
): { success: boolean; newEnergy: number; cost: number; message: string } {
  const cost = energyPurchaseCost(hoursToBuy);

  if (cost > playerBalance) {
    return {
      success: false,
      newEnergy: currentEnergy,
      cost: 0,
      message: `Insufficient 0BOL. Need ${cost.toLocaleString()} 0BOL.`,
    };
  }

  return {
    success: true,
    newEnergy: currentEnergy + hoursToBuy,
    cost,
    message: `Purchased ${hoursToBuy}h of Energy for ${cost.toLocaleString()} 0BOL.`,
  };
}

/** Format energy hours for display */
export function formatEnergyDisplay(hours: number): string {
  if (hours <= 0) return 'DORMANT';
  if (hours < 1) return `${Math.ceil(hours * 60)}m`;
  if (hours < 24) return `${hours.toFixed(1)}h`;
  const days = Math.floor(hours / 24);
  const remainHours = Math.floor(hours % 24);
  return `${days}d ${remainHours}h`;
}
