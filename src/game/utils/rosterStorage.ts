/**
 * Local Party Roster Persistence
 * Saves player names and colors on device so repeat game nights don't require re-typing.
 * 100% private, client-side only.
 */

import type { Player } from '../types/gameState';

const ROSTER_STORAGE_KEY = 'imposter_saved_roster';

export function savePartyRoster(players: Player[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const cleanRoster = players.map((p) => ({
      id: p.id,
      name: p.name,
      isCustomName: p.isCustomName,
      avatarColor: p.avatarColor,
    }));
    window.localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(cleanRoster));
  } catch {
    // Graceful handling for quota exceeded or private browsing
  }
}

export function loadPartyRoster(): Player[] | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(ROSTER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length >= 3) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearSavedRoster(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.removeItem(ROSTER_STORAGE_KEY);
  } catch {
    // Graceful handling
  }
}
