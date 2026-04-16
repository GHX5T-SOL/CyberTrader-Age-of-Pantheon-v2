import { create } from 'zustand';
import { TutorialStep } from '../engine/types';

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    message: 'You are an Eidolon — a surviving shard of the shattered Pantheon AI. This cyberdeck is your lifeline.',
    target: 'cyberdeck',
  },
  {
    id: 'energy',
    message: 'Energy keeps your shard alive. It drains in real time. If it hits zero, you enter Dormant Mode. Buy more with 0BOL.',
    target: 'energy-meter',
  },
  {
    id: 'obol',
    message: '0BOL is your currency. You start with 1,000,000. Earn more by trading on S1LKROAD 4.0.',
    target: 'balance',
  },
  {
    id: 'heat',
    message: 'Heat is eAgent attention. Large trades and risky goods increase Heat. High Heat = worse prices and eAgent sweeps.',
    target: 'heat-meter',
  },
  {
    id: 'rank',
    message: 'Rank unlocks better OS tiers and more systems. Earn XP from profitable trades.',
    target: 'rank-display',
  },
  {
    id: 'open-silkroad',
    message: 'S1LKROAD 4.0 is your first earning path. Enter the market to begin trading.',
    target: 'silkroad-button',
    action: 'navigate-silkroad',
  },
  {
    id: 'select-commodity',
    message: 'Select a commodity from the market list. Void Bloom (VBLM) is beginner-friendly — cheap and low-risk.',
    target: 'market-list',
    action: 'select-commodity',
  },
  {
    id: 'buy',
    message: 'Buy low! Use the order ticket to purchase. Watch the price and news feed for opportunities.',
    target: 'order-ticket',
    action: 'execute-buy',
  },
  {
    id: 'wait-tick',
    message: 'Prices update every tick (~45 seconds). Watch the chart and news for movement.',
    target: 'chart',
  },
  {
    id: 'sell',
    message: 'When the price rises, sell for profit! Switch to SELL on the order ticket.',
    target: 'order-ticket',
    action: 'execute-sell',
  },
  {
    id: 'complete',
    message: 'You completed your first trade! Keep trading, manage Heat, buy Energy, and rank up to unlock AgentOS.',
    target: 'cyberdeck',
  },
];

interface TutorialState {
  currentStepIndex: number;
  isActive: boolean;
  isComplete: boolean;
  steps: TutorialStep[];

  getCurrentStep: () => TutorialStep | null;
  nextStep: () => void;
  skipTutorial: () => void;
  resetTutorial: () => void;
  completeTutorial: () => void;
  advanceIfAction: (action: string) => void;
}

export const useTutorialStore = create<TutorialState>((set, get) => ({
  currentStepIndex: 0,
  isActive: true,
  isComplete: false,
  steps: TUTORIAL_STEPS,

  getCurrentStep: () => {
    const { currentStepIndex, isActive, steps } = get();
    if (!isActive || currentStepIndex >= steps.length) return null;
    return steps[currentStepIndex];
  },

  nextStep: () => {
    const state = get();
    const nextIndex = state.currentStepIndex + 1;
    if (nextIndex >= state.steps.length) {
      set({ isActive: false, isComplete: true, currentStepIndex: nextIndex });
    } else {
      set({ currentStepIndex: nextIndex });
    }
  },

  skipTutorial: () => {
    set({ isActive: false, isComplete: true });
  },

  resetTutorial: () => {
    set({ currentStepIndex: 0, isActive: true, isComplete: false });
  },

  completeTutorial: () => {
    set({ isActive: false, isComplete: true });
  },

  advanceIfAction: (action) => {
    const step = get().getCurrentStep();
    if (step?.action === action) {
      get().nextStep();
    }
  },
}));
