import { createClient } from '@libsql/client';
import type { Game } from '../types/game';

const client = createClient({
  url: process.env.VITE_DB_URL || 'file:local.db',
  authToken: process.env.VITE_DB_AUTH_TOKEN,
});

export async function initDB() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      emojis TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )
  `);
}

export async function saveGame(game: Game): Promise<void> {
  try {
    await initDB();
    await client.execute({
      sql: `INSERT INTO games (id, title, emojis, created_at) VALUES (?, ?, ?, ?)`,
      args: [game.id, game.title, game.emojis, Math.floor(game.createdAt.getTime() / 1000)]
    });
  } catch (error) {
    console.error('Error saving game:', error);
    throw new Error('Failed to save game');
  }
}

export async function getGame(id: string): Promise<Game | null> {
  try {
    await initDB();
    const result = await client.execute({
      sql: `SELECT * FROM games WHERE id = ?`,
      args: [id]
    });

    if (!result.rows.length) return null;

    const row = result.rows[0];
    return {
      id: row.id as string,
      title: row.title as string,
      emojis: row.emojis as string,
      createdAt: new Date((row.created_at as number) * 1000)
    };
  } catch (error) {
    console.error('Error getting game:', error);
    throw new Error('Failed to retrieve game');
  }
}