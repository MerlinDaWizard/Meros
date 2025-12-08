import Database from 'better-sqlite3';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Open or create the database file
const db = new Database(path.resolve(__dirname, 'userPrefs.sqlite'));

// Initialize the table if it doesn't exist
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS user_preferences (
    user_id TEXT PRIMARY KEY,
    voice TEXT NOT NULL
  )
`,
).run();

interface UserPrefRow {
  voice: string;
}

export class UserPreferences {
  static getVoice(userId: string): string | null {
    const row = db
      .prepare('SELECT voice FROM user_preferences WHERE user_id = ?')
      .get(userId) as UserPrefRow | undefined;
    return row ? row.voice : null;
  }

  static setVoice(userId: string, voice: string): void {
    db.prepare(
      `
      INSERT INTO user_preferences (user_id, voice)
      VALUES (?, ?)
      ON CONFLICT(user_id) DO UPDATE SET voice=excluded.voice
    `,
    ).run(userId, voice);
  }
}
