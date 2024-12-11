import type { Game } from '../types/game';

export function encodeGameData(title: string, emojis: string): string {
  const gameData = { title, emojis };
  return btoa(encodeURIComponent(JSON.stringify(gameData)));
}

export function decodeGameData(token: string): Game | null {
  try {
    const jsonString = decodeURIComponent(atob(token));
    const data = JSON.parse(jsonString);
    return {
      id: token,
      title: data.title,
      emojis: data.emojis,
      createdAt: new Date()
    };
  } catch (e) {
    console.error("Failed to decode game data:", e);
    return null;
  }
}