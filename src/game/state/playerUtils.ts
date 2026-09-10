/**
 * Player Name Validation, Sanitization, and Deduplication Utilities
 */

import type { Player } from '../types/gameState';

// Neutral placeholder names (avoiding country-specific biases)
export const NEUTRAL_NAME_SUGGESTIONS = ['Alex', 'Sofia', 'Liam', 'Yuki', 'Jordan', 'Maya', 'Sam', 'Kai'];

// Avatar background colors to make each player card visually distinct & attractive
export const AVATAR_PALETTES = [
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F43F5E', // Rose
  '#84CC16', // Lime
  '#38BDF8', // Sky
];

/**
 * Sanitizes and trims player names, allowing international Unicode, numbers, spaces, safe emojis.
 */
export function sanitizePlayerName(name: string): string {
  // Collapse consecutive whitespaces and trim edges
  return name.replace(/\s+/g, ' ').trim();
}

/**
 * Validates player name length (2 to 20 characters)
 */
export function validatePlayerName(name: string): { isValid: boolean; reason?: string } {
  const sanitized = sanitizePlayerName(name);
  if (sanitized.length === 0) {
    return { isValid: false, reason: 'Name cannot be empty' };
  }
  if (sanitized.length < 2) {
    return { isValid: false, reason: 'Name must be at least 2 characters' };
  }
  if (sanitized.length > 20) {
    return { isValid: false, reason: 'Name cannot exceed 20 characters' };
  }
  return { isValid: true };
}

/**
 * Generates an intelligent, unique display name if duplicate exists.
 * Example: if "Alex" already exists, returns "Alex 2", then "Alex 3", etc.
 */
export function resolveDuplicateName(desiredName: string, existingPlayers: Player[], currentPlayerId?: string): string {
  const cleanDesired = sanitizePlayerName(desiredName);
  const otherNames = existingPlayers
    .filter((p) => p.id !== currentPlayerId)
    .map((p) => p.name.toLowerCase().trim());

  if (!otherNames.includes(cleanDesired.toLowerCase())) {
    return cleanDesired;
  }

  // Find next available number suffix
  let counter = 2;
  while (otherNames.includes(`${cleanDesired.toLowerCase()} ${counter}`)) {
    counter++;
  }
  return `${cleanDesired} ${counter}`;
}

/**
 * Creates default initial players (Classic mode default: 3 players)
 */
export function createDefaultPlayers(): Player[] {
  return [
    {
      id: 'p-1',
      name: 'Player 1',
      isCustomName: false,
      avatarColor: AVATAR_PALETTES[0],
      isHost: true,
    },
    {
      id: 'p-2',
      name: 'Player 2',
      isCustomName: false,
      avatarColor: AVATAR_PALETTES[1],
    },
    {
      id: 'p-3',
      name: 'Player 3',
      isCustomName: false,
      avatarColor: AVATAR_PALETTES[2],
    },
  ];
}

/**
 * Creates a new player with an auto-assigned default name and distinct avatar
 */
export function createNewPlayer(existingPlayers: Player[], customName?: string): Player {
  const nextNum = existingPlayers.length + 1;
  const rawName = customName && customName.trim().length >= 2 ? customName.trim() : `Player ${nextNum}`;
  const finalName = resolveDuplicateName(rawName, existingPlayers);
  const colorIndex = (existingPlayers.length) % AVATAR_PALETTES.length;

  return {
    id: `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: finalName,
    isCustomName: Boolean(customName && customName.trim().length >= 2),
    avatarColor: AVATAR_PALETTES[colorIndex],
  };
}
