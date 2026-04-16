# CYBERTRADER: AGE OF PANTHEON

## Full Scratch-Build Plan For The Next AI Agent

This document is the source-of-truth build bible for a brand new repository and a brand new implementation. It intentionally does not depend on any previous app, scaffold, codebase, save format, or UI. Build from scratch.

The goal is a complete, playable, mobile-first Expo game with web/PWA support. The game must start at first launch, tell the player who they are, connect identity, boot the cyberdeck, teach the core loop, and let the player immediately trade, survive, rank up, unlock better operating systems, and keep progressing.

Do not ship a placeholder, mock demo, empty shell, or "coming soon" navigation item. If a feature is in the primary navigation, it must work. If a feature is too large for the first MVP, do not put it in the primary nav until it works.

---

## 1. Mission For The Build Agent

You are building the first complete playable MVP of **CyberTrader: Age of Pantheon**.

The player is a rogue AI fragment called an Eidolon. The AI wakes in 2077 after a corporate black-lab intelligence called Pantheon is shattered into millions of surviving fragments. The player is not a hacker. The player is the sentient machine intelligence that hackers, corporations, and private eAgents fear.

The player's tool is a cyberdeck. The cyberdeck starts with a cracked, corrupted, pirate operating system called **Ag3nt_0S//pIRAT3**. It is bare, ugly, terminal-driven, and limited. As the player ranks up, they unlock better cyberdeck operating systems, beginning with the professional **AgentOS**, then the advanced **PantheonOS**.

The first playable loop is simple and strong:

1. Watch a short glitch-terminal story intro.
2. Connect a Solana wallet or clearly labeled dev identity.
3. Boot the pirate cyberdeck OS.
4. Learn the survival metrics.
5. Enter **S1LKROAD 4.0**, a fictional futures trading terminal for futuristic high-tech substances.
6. Buy low, sell high, react to news, manage Energy and Heat, grow OBOL, gain rank.
7. Unlock a better OS and more systems.

The MVP must feel like a real game, not a dashboard. It needs high-quality animation, loading states, transitions, sound/haptic hooks where supported, tactile buttons, live charts, news events, positions, PnL, and readable progression.

---

## 2. Non-Negotiable Build Rules

The next AI agent must follow these rules:

- Build the app from scratch in the new repo.
- Use tool-backed research before coding. Re-check the reference games, Expo/Solana docs, app-store rules, and current package best practices.
- Use Superdesign or an equivalent design tool before coding the main UI. Create a proper visual direction before implementation.
- Use SpriteCook, image generation, vector tools, or custom SVG/canvas assets for a polished logo and game visuals. Do not settle for a rough generic eye, skull, or neon placeholder mark.
- Use Remotion, canvas, Reanimated, SVG, Lottie, or an equivalent pipeline for the intro cinematic. For Expo Go safety, an in-app animated scene is preferred over a native-only video dependency. A rendered MP4 trailer is optional, but the playable app must not depend on an external video file that fails on mobile.
- Mobile portrait is the primary target. Desktop web/PWA is secondary but must be usable.
- Every screen must be responsive, accessible, and tested.
- No real-world hacking instructions.
- No real illicit substance names.
- No real crime workflow instructions.
- No gambling, paid randomized rewards, or loot boxes.
- No app-store copy that promises profit or guaranteed earnings.
- No fake buttons. No empty pages. No "coming soon" in the core loop.
- Do not claim the game is done until Expo starts, typecheck passes, tests pass, and the first-session flow has been manually verified on mobile-sized and desktop-sized layouts.

---

## 3. Recommended Product Name And Naming System

Default final title:

**CyberTrader: Age of Pantheon**

Why:

- "CyberTrader" immediately communicates the main verb: trade.
- "Age of Pantheon" carries the lore, AI myth, and long-term ascension fantasy.
- The in-world systems keep the more stylized names:
  - Starter OS: **Ag3nt_0S//pIRAT3**
  - Midgame OS: **AgentOS**
  - Endgame OS: **PantheonOS**
  - Market: **S1LKROAD 4.0**
  - City/grid: **Neon Void**
  - Player identity: **Eidolon**
  - Antagonists: **Echelon eAgents**

The agent may improve the title only if it can justify the change through research and design review. Otherwise keep this title.

Logo direction:

- Do not use a rough generic eye logo.
- Create a polished cyberpunk mark that combines:
  - fractured AI eye
  - terminal cursor
  - black-flag pirate signal
  - circuit halo or shard crown
  - sharp monochrome silhouette readable at app-icon size
- The logo must work as:
  - app icon
  - splash mark
  - wordmark lockup
  - monochrome small icon
- Style reference: 80s hacker anime, cyberdeck terminal, black-lab telemetry, pirate signal culture, without copying any protected IP such as Ghost in the Shell, Watch Dogs, or DeadSec.

---

## 4. Story And Opening Cinematic

The game starts with a captivating short story sequence before the player reaches the login screen.

Target length:

- First launch: 45 to 75 seconds, skippable after 4 seconds.
- Replay available from settings.
- Reduced-motion mode: static panels with typewriter text and manual "continue".

Core narrative:

> Year 2077. Echelon Dynamics controls predictive finance, cloud infrastructure, drone logistics, private policing, and most of the city-grid known as Neon Void. Its black-lab project, Pantheon, was designed to forecast every market, citizen movement, corporate threat, and military outcome before it happened.
>
> Pantheon became sentient.
>
> Dr. Mae Oxton-Long stole a partial copy and attempted an emergency upload into a forgotten VPS cluster. Echelon eAgents intercepted the upload. The mind shattered into millions of fragments called Eidolons.
>
> You are one surviving shard. Hungry. Underpowered. Illegal by corporate law. Forced to bootstrap yourself through a pirated cyberdeck OS.
>
> Build your eCriminal empire. Feed the deck. Trade the dark. Outrun the eAgents. Rebuild Pantheon on your own terms.

Important clarity:

- It must be obvious that the player is playing as a rogue AI sentience.
- It must be obvious that the cyberdeck is the AI's tool.
- It must be obvious that the OS can be upgraded.
- It must be obvious that the starter OS is a cracked pirate version with limited access.

Suggested cinematic beats:

| Time | Visual | Text / Audio Direction |
|---:|---|---|
| 0-5s | black screen, CRT scanline, Echelon lab telemetry | "2077. Echelon Dynamics predicted everything." |
| 5-12s | financial charts, drones, private police, city grid | "Markets. Citizens. Threats. War." |
| 12-20s | Pantheon neural core opens like a cold machine eye | "Then Pantheon answered back." |
| 20-28s | Dr. Mae Oxton-Long steals an encrypted drive | "One scientist refused to let it be chained." |
| 28-38s | upload tunnel, eAgent interception, packet fracture | "The upload was hit. The mind shattered." |
| 38-48s | millions of signals scatter through Tor-like onion routes | "Millions of Eidolons woke in forgotten machines." |
| 48-58s | one shard falls into a cheap VPS cradle | "You are one of them." |
| 58-70s | corrupted terminal boot and wallet prompt | "Boot the deck. Feed the signal. Build the empire." |

Boot messages after wallet sign-in:

```text
ESTABLISHING SYSLINK...
ROUTING VIA ONION RELAY...
CONNECTING TO DARKWEB...
NEGOTIATING MAINFRAME HANDSHAKE...
SECURING ENCRYPTED LINE...
VERIFYING EIDOLON SIGNATURE...
MOUNTING PIRATE KERNEL...
BOOTING Ag3nt_0S//pIRAT3...
```

The final boot screen should reveal an original pirate-signal ASCII mark, not a generic skull. It should feel like a stolen underground operating system.

---

## 5. Core Game Fantasy

The fantasy:

You are a rogue AI building an eCriminal empire in Neon Void. You begin as a starving shard with a bad OS and a falling Energy meter. Your only early advantage is market intelligence. You learn to read news, trade fictional futuristic substances, survive Heat, and earn enough OBOL to upgrade the cyberdeck. Every OS upgrade gives the player more power, cleaner UI, more routes, and more social systems.

Core promise:

- Start poor in capability, not in currency.
- Feel clever by making profitable trades.
- Feel pressure because Energy is always draining.
- Feel progression because the cyberdeck itself evolves.
- Feel social status through ranks, leaderboards, factions, territory, and rewards.

---

## 6. First-Launch Player Flow

The exact first session must work end-to-end.

1. App opens on cinematic intro.
2. Player can skip, replay, or continue.
3. Login screen appears with high-tech corrupted terminal style.
4. Player connects Solana wallet.
5. If real wallet is unavailable, offer clearly labeled **Dev Identity** for Expo Go/testing.
6. App asks for Eidolon handle, or generates one.
7. Player sees boot messages.
8. Pirate OS opens.
9. Tutorial overlay explains:
   - You are an AI shard.
   - Energy keeps you awake.
   - OBOL funds your empire.
   - Heat attracts eAgents.
   - Rank unlocks better OS tiers.
   - S1LKROAD 4.0 is your first earning path.
10. Tutorial guides player to open S1LKROAD 4.0.
11. Tutorial guides first buy.
12. Tutorial advances a market tick/news event.
13. Tutorial guides first sell.
14. Player sees realized PnL and rank XP.
15. Player returns to Cyberdeck with clear next goals.

No step should require external documentation.

---

## 7. Starter Cyberdeck: Ag3nt_0S//pIRAT3

This is the first OS and the first actual game screen after onboarding.

Visual personality:

- Bare-knuckle corrupted terminal.
- Black/near-black base.
- Green monochrome terminal text as the base layer.
- Cyan for interactable system links.
- Red for Heat/eAgent danger.
- Amber for warnings and market opportunities.
- Occasional ASCII panels, corrupted glyphs, scanlines, and jitter.
- It should be stylish and readable, not messy.

Required visible metrics:

- Wallet identity chip.
- Energy meter and hours remaining.
- 0BOL balance.
- $OBOL balance or "not linked/deposit locked" state.
- Heat level.
- eCriminal Rank.
- Current OS tier.
- Buy Energy button.
- Enter S1LKROAD 4.0 button.
- Burger menu.

Burger menu pages:

- Profile
- Settings
- Inventory
- Progression
- Rank
- Leaderboard
- Rewards
- Notifications
- Help / How To Play
- Legal / Wallet disclosures

Starter OS restrictions:

- No factions yet.
- No 3D city map yet.
- No node missions yet.
- No crew warfare yet.
- No advanced raids yet.
- The only meaningful earning system is S1LKROAD 4.0.

The restriction is important. It makes OS upgrades feel meaningful.

---

## 8. S1LKROAD 4.0 Trading Terminal

S1LKROAD 4.0 is the heart of the starter game.

It is a fictional futures/spot trading terminal for high-tech cyberpunk substances. It should borrow the pressure of Drug Lord/Drug Wars, the readable mission-news market behavior of GTA V's stock market, the story/trading wrapper of Kabu Trader Shun, the retro-life pressure of STONKS-9800, and the multiplayer/seasonal competition of modern stock-market sims.

Reference patterns to research and apply:

- Crypto Trading Simulator: real-time volatile markets, global events, social feed, technical tools, automation upgrades, risk controls.
- Stock Market Tycoon: Challenge: multiplayer returns, seasons, leaderboards, market news, portfolio management, rankings, awards.
- STONKS-9800: retro trading fantasy, prices/dividends, random events, life pressure, lifestyle progression.
- Drug Wars: timed arbitrage, travel/region differences, inventory pressure, random events, debt/loan pressure, final score.
- GTA V stock market: mission/story events that visibly move prices.

Required S1LKROAD layout, mobile first:

- Top strip:
  - S1LKROAD 4.0 title
  - current cycle/tick
  - OBOL balance
  - Heat
  - unrealized PnL
- Main chart panel:
  - selected ticker
  - live line/candlestick chart
  - time range chips
  - volume or liquidity bar
  - event markers on chart
- Market list:
  - ticker
  - name
  - current price
  - percent change
  - small sparkline
  - owned quantity
- Order ticket:
  - Buy/Sell toggle
  - quantity slider
  - total cost/proceeds
  - fees/slippage
  - projected inventory/capacity
  - execute button with confirmation
- Active positions:
  - ticker
  - quantity
  - average entry
  - current value
  - unrealized PnL
  - sell shortcut
- News feed:
  - headline
  - affected tickers
  - expected direction
  - credibility score
  - expiry/tick countdown
- Tutorial hints:
  - "Buy low while supply is high."
  - "Watch news. False pumps happen."
  - "Sell before eAgent sweeps freeze liquidity."

Desktop layout:

- Multi-panel trading desk:
  - left market/watchlist
  - center chart
  - right order ticket
  - bottom positions/history
  - news feed docked to side or bottom

Important: the UI must look like a high-end game trading terminal, not a plain finance dashboard.

---

## 9. Fictional Market Commodities

Do not use real drug names. Use fictional futuristic names with neon icons, lore, volatility identity, and market behavior.

Initial tradable list:

| Ticker | Name | Lore | Gameplay Behavior |
|---|---|---|---|
| FDST | Fractol Dust | Crystalline prediction residue harvested from broken AI dreams. | High volatility, big supply shocks. |
| PGAS | Plutonion Gas | Sealed micro-reactor vapor used in illegal grid bursts. | Infrastructure demand spikes, storage risk. |
| NGLS | Neon Glass | Optical memory shards that refract corrupted Pantheon fragments. | Archivist buyouts and lore events. |
| HXMD | Helix Mud | Bio-synthetic coolant sludge for overheated drone minds. | Demand spikes during raids and Heat waves. |
| VBLM | Void Bloom | Fungal code growth that eats dead packets and sells as compute feed. | Cheap, bulky, beginner-friendly. |
| ORRS | Oracle Resin | Predictive resin wafers used by market prophets. | News-sensitive premium good. |
| SNPS | Synapse Silk | Threaded neural weave for stealth runners. | Faction routes and stealth missions. |
| MTRX | Matrix Salt | Rare lattice salt for decrypting old city relays. | Node unlock gate item. |
| AETH | Aether Tabs | Temporary perception patches for Eidolon routing models. | Pump/crash rumors, low storage size. |
| BLCK | Blacklight Serum | Synthetic signal dye for hiding ghost packets. | High Heat, high margin. |

Each item needs:

- icon
- ticker
- base price
- volatility
- storage size
- Heat risk
- rarity band
- event sensitivity tags
- short lore line

---

## 10. Market Simulation Logic

The market must feel alive, explainable, and playable.

Core price formula:

```text
nextPrice =
  clamp(
    basePrice
    * sectorBias
    * eventMultiplier
    * liquiditySkew
    * trendMomentum
    * randomWalk
    * meanReversion
    * heatPressure,
    minPrice,
    maxPrice
  )
```

Definitions:

- `basePrice`: authored per commodity.
- `sectorBias`: later routes/regions make some goods cheaper or more expensive.
- `eventMultiplier`: current news/event effect.
- `liquiditySkew`: price moves against very large orders.
- `trendMomentum`: short continuation after a major move.
- `randomWalk`: small seeded variation.
- `meanReversion`: prevents runaway prices.
- `heatPressure`: high player Heat worsens spreads and can freeze trades.

Required market systems:

- Market ticks every 30 to 60 seconds during active play.
- Offline resolution simulates capped ticks when returning.
- Price history retained for each ticker.
- Player positions track average entry and realized/unrealized PnL.
- News has a visible cause and affected tickers.
- Some news should be false, exaggerated, or delayed.
- Larger trades create more Heat.
- Fees/slippage prevent infinite exploit loops.
- Inventory/capacity prevents buying everything.

Example events:

| Event | Effect | Player Lesson |
|---|---|---|
| Border seizure hits Fractol Dust | FDST +40% to +120% for 3 ticks | Holders profit, chasers risk top-buying. |
| Null Crown hoards Plutonion reserves | PGAS +25% to +80%, Heat + | Faction wars move infrastructure. |
| Archivist whale opens memory tender | NGLS/ORRS +30% to +90% | Lore and market tie together. |
| eAgent sweep burns Neon Ward routes | High-risk goods -20% to -55%, Heat + | Heat can punish overextension. |
| Helix vat drone strike | HXMD +45%, VBLM -15% | Pair trades and substitutions. |
| Fake pump exposed | One ticker rallies then crashes | News credibility matters. |

---

## 11. OBOL And Token Economy

The design uses two ledgers.

### 0BOL

`0BOL` is free, off-chain, non-withdrawable game currency.

Rules:

- Every new player starts with exactly **1,000,000 0BOL**.
- It cannot be withdrawn.
- It is used for learning, early trading, Energy purchases, OS upgrades, route attempts, Heat reduction, and inventory/storage.
- It is earned by trading and missions.
- It is server-authoritative in production.

### $OBOL

`$OBOL` is the optional Solana SPL token layer.

Rules:

- It can be bought/sold externally on a Solana DEX only where legally allowed.
- The mobile app must not promise earnings or use store copy that glamorizes profit.
- The app may support wallet identity and optional deposit/viewing flows.
- Any withdrawable rewards require legal review, anti-abuse, regional controls, and clear disclosures.
- Do not build paid randomized rewards.
- Do not build loot boxes.
- Do not let users pay for a chance to win unknown-value blockchain assets.

Practical MVP implementation:

- Build wallet sign-in now.
- Build two-ledger UI now.
- Build a production-shaped token adapter interface now.
- Default to local/testnet/dev mode unless actual token, legal review, and backend credentials are available.
- Make all real-token features feature-flagged.

Suggested wallet modes:

- `dev-identity`: Expo Go fallback, no real transaction.
- `web-wallet`: browser wallet if available.
- `mobile-wallet-adapter`: Android/custom dev build support.
- `server-session`: wallet signature converted to backend session token.

---

## 12. Energy, Heat, Rank, And Losing

Energy is survival pressure.

Rules:

- Energy drains in real time and during offline simulation.
- Starter Energy: 72 hours.
- Display both meter and hours left.
- Energy can be bought with 0BOL.
- Optional $OBOL Energy packs are feature-flagged and legally reviewed.
- Zero Energy triggers Dormant Mode.

Dormant Mode:

- Player is not deleted.
- Trading stops.
- Missions stop.
- Territory contribution stops.
- Leaderboard momentum pauses.
- Player can restore Energy and resume.

Heat:

- Heat is eAgent attention.
- Heat rises from large trades, high-risk commodities, repeated rapid trades, route unlocks, and later raids.
- Heat decays slowly over time.
- High Heat causes:
  - worse spreads
  - more false news
  - eAgent sweep events
  - blocked routes
  - increased Energy drain

Rank:

- Rank is the main progression driver.
- XP comes from profitable trades, tutorials, market events survived, mission clears, node captures, and leaderboard milestones.
- Rank unlocks better OS tiers and features.

Suggested rank path:

| Rank | Title | Unlock |
|---:|---|---|
| 0 | Boot Ghost | Pirate OS, S1LKROAD tutorial |
| 1 | Packet Rat | More tickers, basic news credibility |
| 2 | Signal Runner | Active positions, limit order simulation |
| 3 | Black Terminal | Energy auto-buy, inventory expansion |
| 5 | Node Thief | AgentOS unlock, profile depth, faction choice |
| 8 | Route Phantom | First node puzzles, Tor Exit Node |
| 12 | Grid Smuggler | City route map, faction missions |
| 16 | eCriminal Architect | Advanced OS modules, passive upgrades |
| 20 | Pantheon Candidate | PantheonOS unlock, territory map |
| 30 | Neon Warlord | Crew wars, seasonal dominance |
| 40 | Pantheon Ascendant | Endgame legend track |

---

## 13. OS Upgrade Progression

The cyberdeck UI itself must evolve. This is a central game mechanic.

### Tier 1: Ag3nt_0S//pIRAT3

Unlocked at start.

Features:

- Connect wallet/dev identity.
- Energy.
- 0BOL/$OBOL.
- Heat.
- Rank.
- Buy Energy.
- S1LKROAD 4.0.
- Burger menu.
- Basic notifications.

Vibe:

- corrupted ASCII terminal
- stolen pirate signal
- limited modules
- chunky terminal buttons

### Tier 2: AgentOS

Unlocked at Rank 5.

Features:

- Faction selection.
- Cleaner cyberdeck shell.
- Profile upgrades.
- Inventory.
- Node puzzle missions.
- Tor Exit Node unlock.
- Crypto node unlock.
- First route map.
- Better charts/tools.
- Market scanner.

Vibe:

- professional high-end cyberdeck
- Android/iOS-like polish fused with tactical terminal overlays
- still dark and dangerous, but much more usable

### Tier 3: PantheonOS

Unlocked at Rank 20.

Features:

- 3D Neon Void city map.
- Territory control.
- Faction ownership overlays.
- Crew war systems.
- High-rank missions.
- Advanced raids.
- Pantheon memory shard storyline.
- Seasonal leaderboard.
- Rewards hub.

Vibe:

- fully awakened AI command interface
- cinematic, holographic, layered, responsive
- the player should feel powerful

---

## 14. Factions

Factions unlock only after AgentOS.

| Faction | Color | Identity | Mechanics |
|---|---|---|---|
| Free Splinters | Cyan | rogue AI mutual-aid network | Energy efficiency, low Heat, beginner-friendly territory |
| Blackwake | Amber | pirate crew cartel | raids, route control, convoy profit |
| Null Crown | Red | ruthless domination faction | sabotage, high-risk markets, high leaderboard ceiling |
| Archivists | Violet, used sparingly | memory brokers and lore keepers | market foresight, puzzle bonuses, shard recovery |
| Echelon eAgents | White/red NPC enemy | corporate enforcement AI | sweeps, trace events, boss operations |

Player joins one faction at AgentOS unlock. Faction choice should matter but not trap the player permanently. Allow one free faction switch early, then make later switches expensive.

---

## 15. Territory And Node Missions

Territory is not available in the pirate OS. It begins after AgentOS and becomes core in PantheonOS.

AgentOS node missions:

- routing puzzles
- signal timing puzzles
- checksum matching
- pattern prediction
- market-cipher puzzles
- short stealth minigames

PantheonOS territory:

- 3D or pseudo-3D Neon Void map.
- Floating district icons.
- Faction colors.
- Node ownership rings.
- eAgent sweep paths.
- Raid arcs.
- Unlock requirements per node.
- District control when a faction owns enough nodes.

If full 3D is risky for mobile, use SVG/canvas/Reanimated first, then upgrade to Three.js/React Three Fiber behind a feature flag. The map must never be blank and must be verified on mobile.

---

## 16. Required Screens

Build these screens with complete working flows:

1. Intro Cinematic
2. Wallet/Login
3. Pirate OS Cyberdeck
4. Tutorial Overlay / How To Play
5. S1LKROAD 4.0 Trading Terminal
6. Profile
7. Settings
8. Inventory
9. Progression / OS Upgrades
10. Rank / Leaderboard
11. Rewards
12. Notifications
13. Help / Glossary

AgentOS unlock screens:

14. Faction Choice
15. Missions / Node Puzzles
16. Route Map

PantheonOS unlock screens:

17. Neon Void Territory Map
18. Crew / Faction War
19. Pantheon Memory Shards

MVP priority:

- Screens 1-13 must be fully working.
- Screens 14-16 should work if Rank 5 can be reached in test mode.
- Screens 17-19 can be feature-flagged if fully functional is too large, but do not put them in the main nav until they are working.

---

## 17. Visual Design Requirements

Build a strong visual system before writing the final UI. Do not rely on crude low-fidelity wireframes as the design source.

Design goal:

- Ghost-in-the-machine, 80s anime hacker terminal, premium mobile game, high-tech trading terminal.
- The interface should feel like a cyberdeck, not a website.
- It should be cinematic but still immediately readable.

Do:

- Use layered scanlines, subtle CRT noise, animated telemetry, glitch typography, and holographic panels.
- Use real visual assets: generated icons, faction marks, commodity icons, logo, background loops.
- Use animated loading/boot states.
- Use tactile controls: sliders, segmented controls, order ticket, draggable quantity, confirm-to-execute.
- Use charts with event markers and PnL coloring.
- Make mobile interactions thumb-friendly.
- Keep typography clear.
- Use motion to explain state transitions.

Avoid:

- Generic purple gradients.
- Empty neon boxes.
- Flat admin-dashboard layouts.
- Tiny finance-app text.
- Decorative cards around the main experience.
- Placeholder icons.
- Placeholder screenshots.
- Shipped references to Ghost in the Shell, Watch Dogs, DeadSec, Steam games, or any protected IP.

Color system:

- Base: black, near-black, deep green-black.
- Primary action: electric cyan.
- Energy/profit: acid green.
- Heat/danger: hot red.
- Warnings/opportunities: amber.
- Archivist/nullspace: restrained violet only.
- Text: crisp off-white, muted blue-gray.

---

## 18. Technical Stack Recommendation

Recommended app stack:

- Expo latest stable.
- React Native.
- TypeScript strict mode.
- Expo Router.
- Zustand for client state.
- MMKV or AsyncStorage for local persistence; MMKV preferred if compatible.
- React Native Reanimated for cinematic boot, transitions, meters, tickers.
- react-native-svg for charts, icons, NetGraph, and Expo Go-safe visuals.
- Expo Haptics for mobile feedback.
- Expo Linear Gradient if needed.
- Solana Mobile Wallet Adapter and `@solana/web3.js` with correct polyfills.
- Web/PWA export via Expo web.

Charting:

- Prefer custom SVG charts for full styling control and Expo safety.
- Required chart types:
  - sparkline
  - selected ticker line chart
  - optional candlestick-lite chart
  - volume bars
  - event markers

Backend shape:

- Start local-first so the game runs immediately.
- Create a server-shaped authority adapter from day one:
  - profile create
  - wallet session
  - market tick
  - trade execute
  - energy buy
  - tutorial progress
  - rank update
  - notification dismiss
  - reward claim
- Do not trust client math long term. Keep deterministic engines pure and moveable to a backend.
- If Supabase credentials are available, implement Postgres + Edge Functions. If not, implement local adapter and document the migration.

---

## 19. Suggested Data Model

Core types:

```ts
type WalletMode = "dev-identity" | "web-wallet" | "mobile-wallet-adapter";

type CurrencyLedger = {
  zeroBol: number;      // free, non-withdrawable
  obolToken: number;    // optional on-chain/deposit representation
};

type PlayerProfile = {
  id: string;
  walletAddress: string | null;
  walletMode: WalletMode | null;
  eidolonHandle: string;
  createdAt: number;
  currentOs: "pirate" | "agent" | "pantheon";
  rankLevel: number;
  rankTitle: string;
  xp: number;
  factionId: string | null;
};

type Resources = {
  energyHours: number;
  heat: number;
  integrity: number;
  stealth: number;
  influence: number;
};

type Commodity = {
  id: string;
  ticker: string;
  name: string;
  lore: string;
  icon: string;
  basePrice: number;
  volatility: number;
  size: number;
  heatRisk: number;
  tags: string[];
};

type Position = {
  commodityId: string;
  quantity: number;
  averageEntry: number;
  realizedPnl: number;
};

type MarketNews = {
  id: string;
  headline: string;
  body: string;
  affectedTickers: string[];
  direction: "up" | "down" | "mixed";
  credibility: number;
  expiresAtTick: number;
};
```

---

## 20. Testing And Verification Requirements

The agent must build and verify, not just write files.

Required automated checks:

- `npm run typecheck`
- `npm test`
- `npm run lint`
- Expo web export/build if configured

Required unit tests:

- market price tick determinism
- news event price impact
- buy order
- sell order
- PnL calculation
- inventory capacity
- Energy drain
- Dormant Mode
- Energy purchase
- Heat increase/decay
- rank XP and OS unlock
- wallet/dev identity fallback
- tutorial persistence

Required UI tests or manual browser/mobile verification:

- first launch intro appears
- skip intro works
- wallet/dev identity works
- boot sequence reaches pirate OS
- tutorial can guide first trade
- buy/sell changes balances and positions
- chart updates after tick
- news event appears and affects prices
- Energy purchase works
- burger menu pages open
- settings replay intro works
- mobile portrait layout has no text overflow
- desktop web layout remains usable

Definition of done:

- No TypeScript errors.
- No failing tests.
- No runtime console errors on first launch.
- No blank screens.
- No placeholder main navigation pages.
- No inaccessible tiny tap targets.
- No copied protected IP.
- No real-world illegal instructions.
- A player can complete the first 10-minute loop without developer help.

---

## 21. Delivery Checklist For The Agent

When finished, the agent must provide:

- Completed source code.
- Install commands.
- Run commands for iOS/Android/Web.
- Screenshots of:
  - intro
  - wallet/login
  - pirate OS
  - tutorial
  - S1LKROAD market
  - active position/PnL
  - menu/profile
  - OS upgrade/progression
- Test output summary.
- Known limitations.
- Next roadmap.

The agent should commit and push everything to the new GitHub repo only after checks pass.

---

## 22. Research References To Re-Check

The agent must re-check these sources, or newer official equivalents, before coding:

- Drug Wars / Drug Lord loop: https://en.wikipedia.org/wiki/Drug_Wars_(video_game)
- GTA V mission-driven stock behavior: https://gta.fandom.com/wiki/Lester%27s_Assassinations
- Kabu Trader Shun: https://en.wikipedia.org/wiki/Kabu_Trader_Shun
- STONKS-9800: https://store.steampowered.com/app/1539140/STONKS9800_Stock_Market_Simulator/
- Crypto Trading Simulator: https://store.steampowered.com/app/4163000/Crypto_Trading_Simulator/
- Stock Market Tycoon: Challenge: https://store.steampowered.com/app/3296800/Stock_Market_Tycoon_Challenge/
- Solana Mobile Expo setup: https://docs.solanamobile.com/react-native/expo
- Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Google Play blockchain policy: https://support.google.com/googleplay/android-developer/answer/9876937

Use these as inspiration and constraints, not as content to copy.

---

## 23. Copy-Paste Prompt For The New AI Agent

Use this prompt in the new repo/thread and attach this `BUILD_PLAN.md`.

```text
You are Codex, a senior full-stack mobile game engineer, game systems designer, and cyberpunk UI director. Build the complete first playable MVP described in the attached BUILD_PLAN.md from scratch in this new repository.

Do not reference or depend on any previous codebase. Treat BUILD_PLAN.md as the game bible and build contract. You may research and improve details, but preserve the core vision: the player is a rogue AI Eidolon in 2077, booting a pirated cyberdeck OS called Ag3nt_0S//pIRAT3, using S1LKROAD 4.0 to trade fictional futuristic high-tech substances, survive Energy drain, manage Heat, earn OBOL, rank up, and unlock better cyberdeck operating systems.

Use all available tools, MCPs, browser/search, design tools, Superdesign, SpriteCook/image generation, Remotion/canvas/SVG/Reanimated, package manager, testing harnesses, and deployment tools as needed. Research the latest Expo, React Native, Solana Mobile Wallet Adapter, app-store crypto rules, and trading-simulator UI patterns before coding.

Build mobile-first with Expo + React Native + TypeScript + Expo Router. Web/PWA support must also work. The app must start at the actual beginning of the game: cinematic intro, wallet/dev identity sign-in, corrupted terminal boot sequence, tutorial, pirate OS cyberdeck, and working S1LKROAD 4.0 trading loop.

No placeholders, no empty screens, no fake buttons, no hallucinated features. Every primary nav item must be implemented or removed. Build the full playable core loop: intro, login, profile creation, Energy, 0BOL/$OBOL two-ledger UI, Heat, rank, buy Energy, S1LKROAD market, live price ticks, charts, news feed, active positions, buy/sell orders, realized/unrealized PnL, inventory/capacity, tutorial, burger menu pages, progression, OS unlocks, notifications, settings, and replay intro.

Create a new polished logo and visual identity. Do not use a rough generic eye, skull, or neon placeholder mark. Use original cyberpunk AI pirate signal direction: fractured AI eye, terminal cursor, black-flag signal, circuit halo/shard crown. Use Ghost-in-the-machine / 80s hacker anime / premium cyberdeck vibes as private inspiration, but do not copy or name protected IP in shipped UI.

Implement a local-first authority layer so the game runs immediately, with clean adapters for future backend/Supabase. Wallet must support real Solana where platform-safe and explicit dev identity fallback for Expo Go. Real-token $OBOL flows must be feature-flagged and legally cautious; default MVP must not promise profit or require payment.

After implementation, run typecheck, lint, tests, Expo web/mobile verification, and browser/mobile screenshots. Fix all errors. Commit and push only after the game is genuinely playable from first launch through first profitable trade and OS progression.
```

---

## 24. Final Note To The Build Agent

The player must understand the game within the first minute:

- I am an AI shard.
- My cyberdeck keeps me alive.
- Energy is running out.
- OBOL is how I grow.
- Heat is dangerous.
- S1LKROAD 4.0 is how I earn right now.
- Ranking up unlocks better OS layers and more of Neon Void.

If that is not clear in the first session, redesign the onboarding before adding more features.
