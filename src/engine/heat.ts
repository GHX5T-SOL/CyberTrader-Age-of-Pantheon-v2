import { CONSTANTS } from './types';

/** Calculate current heat after time-based decay */
export function calculateCurrentHeat(
  storedHeat: number,
  lastUpdateTimestamp: number,
  now: number = Date.now()
): number {
  const elapsedMs = now - lastUpdateTimestamp;
  const elapsedMinutes = elapsedMs / (1000 * 60);
  const decayed = elapsedMinutes * CONSTANTS.HEAT_DECAY_PER_MINUTE;
  return Math.max(0, storedHeat - decayed);
}

/** Add heat from a trade */
export function addTradeHeat(currentHeat: number, heatGenerated: number): number {
  return Math.min(CONSTANTS.MAX_HEAT, currentHeat + heatGenerated);
}

/** Get heat severity level */
export function heatSeverity(heat: number): 'safe' | 'warm' | 'hot' | 'critical' {
  if (heat < 25) return 'safe';
  if (heat < 50) return 'warm';
  if (heat < 75) return 'hot';
  return 'critical';
}

/** Get spread penalty from heat (higher heat = worse prices) */
export function heatSpreadPenalty(heat: number): number {
  if (heat < 50) return 0;
  return (heat - 50) / 100 * 0.05; // up to 2.5% at max heat
}

/** Check if eAgent sweep should trigger */
export function shouldTriggerSweep(heat: number, tickRng: number): boolean {
  if (heat < 75) return false;
  const chance = (heat - 75) / 25 * 0.3; // up to 30% chance at max heat
  return tickRng < chance;
}

/** Format heat for display */
export function formatHeatDisplay(heat: number): string {
  return `${Math.round(heat)}%`;
}

/** Get heat color based on level */
export function getHeatColor(heat: number): string {
  if (heat < 25) return '#76ff03';  // green
  if (heat < 50) return '#ffab00';  // amber
  if (heat < 75) return '#ff6d00';  // orange
  return '#ff1744';                 // red
}
