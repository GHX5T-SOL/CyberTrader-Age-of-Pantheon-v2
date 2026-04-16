import { SeededRandom } from './seededRandom';
import { COMMODITIES } from './commodities';
import { CONSTANTS, PricePoint, TradeOrder, TradeResult, Position, MarketNews } from './types';

const rng = new SeededRandom(Date.now());

/** Calculate the next price for a commodity given current state */
export function calculateNextPrice(
  commodityId: string,
  currentPrice: number,
  basePrice: number,
  volatility: number,
  activeNews: MarketNews[],
  heat: number,
  tickSeed: number
): number {
  const tickRng = new SeededRandom(tickSeed + commodityId.charCodeAt(0) * 1000);

  // Random walk: proportional to volatility
  const walkMagnitude = volatility * 0.08;
  const walk = 1 + (tickRng.next() - 0.5) * 2 * walkMagnitude;

  // Mean reversion: pulls toward base price
  const deviation = (currentPrice - basePrice) / basePrice;
  const reversionStrength = 0.05 + Math.abs(deviation) * 0.1;
  const meanReversion = 1 - deviation * reversionStrength;

  // News event multiplier
  let eventMultiplier = 1;
  for (const news of activeNews) {
    if (news.affectedTickers.includes(commodityId)) {
      const strength = news.isFake ? news.multiplier * 0.3 : news.multiplier;
      eventMultiplier *= strength;
    }
  }

  // Heat pressure: worsens prices unpredictably
  const heatFactor = heat / CONSTANTS.MAX_HEAT;
  const heatPressure = 1 + (tickRng.next() - 0.5) * heatFactor * 0.06;

  // Trend momentum: small continuation bias
  const momentum = 1 + (currentPrice > basePrice ? 0.005 : -0.005) * tickRng.next();

  // Combine all factors
  let nextPrice = currentPrice * walk * meanReversion * eventMultiplier * heatPressure * momentum;

  // Clamp
  const minPrice = basePrice * 0.12;
  const maxPrice = basePrice * 8;
  nextPrice = Math.max(minPrice, Math.min(maxPrice, nextPrice));

  return Math.round(nextPrice * 100) / 100;
}

/** Process a full market tick for all commodities */
export function processMarketTick(
  currentPrices: Record<string, number>,
  activeNews: MarketNews[],
  heat: number,
  tick: number
): Record<string, number> {
  const newPrices: Record<string, number> = {};
  const tickSeed = tick * 7919; // prime seed per tick

  for (const commodity of COMMODITIES) {
    const current = currentPrices[commodity.id] ?? commodity.basePrice;
    newPrices[commodity.id] = calculateNextPrice(
      commodity.id,
      current,
      commodity.basePrice,
      commodity.volatility,
      activeNews,
      heat,
      tickSeed
    );
  }

  return newPrices;
}

/** Initialize market with base prices + small random offset */
export function initializeMarketPrices(): Record<string, number> {
  const prices: Record<string, number> = {};
  for (const commodity of COMMODITIES) {
    const offset = 1 + (rng.next() - 0.5) * 0.2; // ±10% from base
    prices[commodity.id] = Math.round(commodity.basePrice * offset * 100) / 100;
  }
  return prices;
}

/** Execute a trade order */
export function executeTrade(
  order: TradeOrder,
  currentPrice: number,
  playerBalance: number,
  positions: Position[],
  currentInventorySize: number,
  commoditySize: number,
  commodityHeatRisk: number
): TradeResult {
  const { side, quantity, commodityId } = order;

  if (quantity <= 0) {
    return { success: false, message: 'Invalid quantity', executedPrice: 0, quantity: 0, totalCost: 0, fee: 0, heatGenerated: 0, xpGained: 0 };
  }

  // Calculate slippage for large orders
  let slippage = 0;
  if (quantity * commoditySize > CONSTANTS.SLIPPAGE_THRESHOLD * CONSTANTS.MAX_INVENTORY_SIZE) {
    slippage = CONSTANTS.SLIPPAGE_RATE;
  }

  const fee = CONSTANTS.TRADE_FEE_PERCENT;

  if (side === 'buy') {
    const executedPrice = currentPrice * (1 + slippage);
    const subtotal = quantity * executedPrice;
    const feeAmount = subtotal * fee;
    const totalCost = subtotal + feeAmount;

    // Check balance
    if (totalCost > playerBalance) {
      return { success: false, message: 'Insufficient 0BOL', executedPrice: 0, quantity: 0, totalCost: 0, fee: 0, heatGenerated: 0, xpGained: 0 };
    }

    // Check inventory capacity
    const neededSize = quantity * commoditySize;
    if (currentInventorySize + neededSize > CONSTANTS.MAX_INVENTORY_SIZE) {
      return { success: false, message: 'Inventory full', executedPrice: 0, quantity: 0, totalCost: 0, fee: 0, heatGenerated: 0, xpGained: 0 };
    }

    const heatGenerated = quantity * commodityHeatRisk * 2;

    return {
      success: true,
      message: `Bought ${quantity} units`,
      executedPrice,
      quantity,
      totalCost,
      fee: feeAmount,
      heatGenerated: Math.min(heatGenerated, 15),
      xpGained: 0, // XP only on profitable sells
    };
  } else {
    // Sell
    const existingPosition = positions.find((p) => p.commodityId === commodityId);
    if (!existingPosition || existingPosition.quantity < quantity) {
      return { success: false, message: 'Insufficient inventory', executedPrice: 0, quantity: 0, totalCost: 0, fee: 0, heatGenerated: 0, xpGained: 0 };
    }

    const executedPrice = currentPrice * (1 - slippage);
    const subtotal = quantity * executedPrice;
    const feeAmount = subtotal * fee;
    const totalProceeds = subtotal - feeAmount;

    // Calculate PnL for XP
    const costBasis = quantity * existingPosition.averageEntry;
    const pnl = totalProceeds - costBasis;
    const pnlPercent = costBasis > 0 ? pnl / costBasis : 0;
    const xpGained = pnl > 0 ? Math.max(1, Math.floor(pnlPercent * 100)) : 0;

    const heatGenerated = quantity * commodityHeatRisk * 1.5;

    return {
      success: true,
      message: `Sold ${quantity} units for ${pnl >= 0 ? '+' : ''}${Math.round(pnl)} 0BOL PnL`,
      executedPrice,
      quantity,
      totalCost: -totalProceeds, // negative = player receives money
      fee: feeAmount,
      heatGenerated: Math.min(heatGenerated, 10),
      xpGained,
    };
  }
}

/** Calculate unrealized PnL for a position */
export function unrealizedPnl(position: Position, currentPrice: number): number {
  return (currentPrice - position.averageEntry) * position.quantity;
}

/** Calculate total unrealized PnL across all positions */
export function totalUnrealizedPnl(positions: Position[], prices: Record<string, number>): number {
  return positions.reduce((sum, p) => {
    const price = prices[p.commodityId] ?? 0;
    return sum + unrealizedPnl(p, price);
  }, 0);
}

/** Calculate total inventory size used */
export function totalInventorySize(positions: Position[]): number {
  return positions.reduce((sum, p) => {
    const commodity = COMMODITIES.find((c) => c.id === p.commodityId);
    return sum + p.quantity * (commodity?.size ?? 1);
  }, 0);
}
