import { MarketNews } from './types';
import { SeededRandom } from './seededRandom';

interface NewsTemplate {
  headline: string;
  body: string;
  affectedTickers: string[];
  direction: 'up' | 'down' | 'mixed';
  multiplierRange: [number, number];
  credibility: number;
  isFake: boolean;
  durationTicks: number;
}

const NEWS_TEMPLATES: NewsTemplate[] = [
  // Supply shocks
  {
    headline: 'Border Seizure Hits Fractol Dust Supply',
    body: 'Echelon customs intercepted a major Fractol Dust shipment at Sector 7 checkpoint. Supply crunch expected.',
    affectedTickers: ['fdst'],
    direction: 'up',
    multiplierRange: [1.3, 1.8],
    credibility: 0.85,
    isFake: false,
    durationTicks: 3,
  },
  {
    headline: 'Null Crown Hoards Plutonion Reserves',
    body: 'Faction intelligence confirms Null Crown is stockpiling Plutonion Gas for unknown operations.',
    affectedTickers: ['pgas'],
    direction: 'up',
    multiplierRange: [1.2, 1.6],
    credibility: 0.7,
    isFake: false,
    durationTicks: 4,
  },
  {
    headline: 'Archivist Whale Opens Memory Tender',
    body: 'A senior Archivist posted a massive buy order for Neon Glass and Oracle Resin. Market makers scrambling.',
    affectedTickers: ['ngls', 'orrs'],
    direction: 'up',
    multiplierRange: [1.25, 1.7],
    credibility: 0.8,
    isFake: false,
    durationTicks: 3,
  },
  {
    headline: 'eAgent Sweep Burns Neon Ward Routes',
    body: 'Echelon eAgents conducted a coordinated sweep through Neon Ward. High-risk goods under pressure.',
    affectedTickers: ['blck', 'snps', 'mtrx'],
    direction: 'down',
    multiplierRange: [0.55, 0.8],
    credibility: 0.9,
    isFake: false,
    durationTicks: 3,
  },
  {
    headline: 'Helix Vat Drone Strike Disrupts Production',
    body: 'Automated drones hit a major Helix Mud refinery. Void Bloom flooding market as substitute.',
    affectedTickers: ['hxmd', 'vblm'],
    direction: 'mixed',
    multiplierRange: [1.3, 1.5],
    credibility: 0.75,
    isFake: false,
    durationTicks: 3,
  },
  {
    headline: 'Aether Tab Lab Discovered in Sector 12',
    body: 'Underground lab producing Aether Tabs raided. Short-term supply spike before crackdown.',
    affectedTickers: ['aeth'],
    direction: 'down',
    multiplierRange: [0.6, 0.85],
    credibility: 0.65,
    isFake: false,
    durationTicks: 2,
  },
  {
    headline: 'Synapse Silk Demand Surges from Runner Networks',
    body: 'Free Splinter stealth runners report critical Synapse Silk shortages. Prices climbing.',
    affectedTickers: ['snps'],
    direction: 'up',
    multiplierRange: [1.2, 1.55],
    credibility: 0.8,
    isFake: false,
    durationTicks: 3,
  },
  {
    headline: 'Matrix Salt Vein Found Near Grid Edge',
    body: 'Prospectors found a new Matrix Salt deposit near the decommissioned relay tower. Prices may soften.',
    affectedTickers: ['mtrx'],
    direction: 'down',
    multiplierRange: [0.7, 0.9],
    credibility: 0.7,
    isFake: false,
    durationTicks: 4,
  },
  {
    headline: 'Blacklight Serum Cartel War Escalates',
    body: 'Three cartels are fighting over Blacklight distribution. Danger up, but premium buyers still paying.',
    affectedTickers: ['blck'],
    direction: 'up',
    multiplierRange: [1.15, 1.45],
    credibility: 0.85,
    isFake: false,
    durationTicks: 3,
  },
  {
    headline: 'Oracle Resin Prophet Predicts Market Crash',
    body: 'A self-styled Oracle Resin prophet claims massive downturn incoming. Credibility uncertain.',
    affectedTickers: ['orrs', 'fdst'],
    direction: 'down',
    multiplierRange: [0.65, 0.85],
    credibility: 0.4,
    isFake: false,
    durationTicks: 2,
  },
  // Fake pumps
  {
    headline: '[UNVERIFIED] Void Bloom Miracle Breakthrough',
    body: 'Anonymous sources claim Void Bloom can now synthesize neural pathways. Take with salt.',
    affectedTickers: ['vblm'],
    direction: 'up',
    multiplierRange: [1.4, 2.0],
    credibility: 0.2,
    isFake: true,
    durationTicks: 2,
  },
  {
    headline: '[RUMOR] Echelon to Legalize Aether Tabs',
    body: 'Leaked memo suggests Echelon may decriminalize Aether Tabs. Source credibility: very low.',
    affectedTickers: ['aeth'],
    direction: 'up',
    multiplierRange: [1.5, 2.2],
    credibility: 0.15,
    isFake: true,
    durationTicks: 2,
  },
  {
    headline: '[SIGNAL INTERCEPT] Massive PGAS Buy Incoming',
    body: 'Intercepted Echelon comms suggest bulk Plutonion Gas purchase. Could be disinformation.',
    affectedTickers: ['pgas'],
    direction: 'up',
    multiplierRange: [1.3, 1.7],
    credibility: 0.25,
    isFake: true,
    durationTicks: 2,
  },
  // More events
  {
    headline: 'Grid Power Surge Increases Coolant Demand',
    body: 'Unexpected power surge in Sector 4 has drones overheating. Helix Mud demand soaring.',
    affectedTickers: ['hxmd'],
    direction: 'up',
    multiplierRange: [1.25, 1.65],
    credibility: 0.9,
    isFake: false,
    durationTicks: 3,
  },
  {
    headline: 'Free Splinter Convoy Raided',
    body: 'Null Crown forces ambushed a Free Splinter supply run. Multiple commodity shortages expected.',
    affectedTickers: ['fdst', 'vblm', 'aeth'],
    direction: 'up',
    multiplierRange: [1.15, 1.4],
    credibility: 0.75,
    isFake: false,
    durationTicks: 4,
  },
  {
    headline: 'Neon Glass Refraction Index Degrading',
    body: 'Quality concerns emerge as latest Neon Glass batches show signal degradation.',
    affectedTickers: ['ngls'],
    direction: 'down',
    multiplierRange: [0.7, 0.88],
    credibility: 0.8,
    isFake: false,
    durationTicks: 3,
  },
];

let newsCounter = 0;

/** Generate a news event for the current tick */
export function generateNewsEvent(tick: number, rng: SeededRandom): MarketNews | null {
  const template = rng.pick(NEWS_TEMPLATES);
  const multiplier = rng.range(template.multiplierRange[0], template.multiplierRange[1]);

  newsCounter++;
  return {
    id: `news-${tick}-${newsCounter}`,
    headline: template.headline,
    body: template.body,
    affectedTickers: template.affectedTickers,
    direction: template.direction,
    multiplier: Math.round(multiplier * 1000) / 1000,
    credibility: template.credibility,
    expiresAtTick: tick + template.durationTicks,
    createdAtTick: tick,
    isFake: template.isFake,
  };
}

/** Remove expired news events */
export function pruneExpiredNews(news: MarketNews[], currentTick: number): MarketNews[] {
  return news.filter((n) => n.expiresAtTick > currentTick);
}
