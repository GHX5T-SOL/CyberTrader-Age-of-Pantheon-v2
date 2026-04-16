import { create } from 'zustand';
import { GamePhase } from '../engine/types';

interface GameState {
  phase: GamePhase;
  hasSeenIntro: boolean;
  settingsReplayIntro: boolean;
  soundEnabled: boolean;
  reducedMotion: boolean;
  showTutorial: boolean;

  setPhase: (phase: GamePhase) => void;
  markIntroSeen: () => void;
  setReplayIntro: (val: boolean) => void;
  toggleSound: () => void;
  toggleReducedMotion: () => void;
  setShowTutorial: (val: boolean) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  phase: 'intro',
  hasSeenIntro: false,
  settingsReplayIntro: false,
  soundEnabled: true,
  reducedMotion: false,
  showTutorial: true,

  setPhase: (phase) => set({ phase }),
  markIntroSeen: () => set({ hasSeenIntro: true }),
  setReplayIntro: (val) => set({ settingsReplayIntro: val }),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  toggleReducedMotion: () => set((s) => ({ reducedMotion: !s.reducedMotion })),
  setShowTutorial: (val) => set({ showTutorial: val }),
  resetGame: () => set({ phase: 'intro', hasSeenIntro: false, showTutorial: true }),
}));
