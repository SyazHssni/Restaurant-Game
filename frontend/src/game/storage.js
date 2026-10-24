import { START_FUNDS, START_REPUTATION } from "./config";

const SAVE_KEY = "rushbite_save_v1";
const SETTINGS_KEY = "rushbite_settings_v1";

export const DEFAULT_SETTINGS = { volume: 70, musicEnabled: true, musicVolume: 30, reducedMotion: false, textSize: "normal", highContrast: false, timerDifficulty: "biasa", mathMode: "challenge" };

export const newSave = (prev) => ({
  day: 1, funds: START_FUNDS, reputation: START_REPUTATION, insolventShifts: 0, bankrupt: false,
  tutorialDone: prev ? prev.tutorialDone : false, bestStreak: prev ? prev.bestStreak : 0, history: [],
});

const read = (k) => {
  try { return JSON.parse(localStorage.getItem(k)); } catch { return null; }
};
export const loadSave = () => read(SAVE_KEY);
export const writeSave = (s) => localStorage.setItem(SAVE_KEY, JSON.stringify(s));
export const loadSettings = () => ({ ...DEFAULT_SETTINGS, ...(read(SETTINGS_KEY) || {}) });
export const writeSettings = (s) => localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
