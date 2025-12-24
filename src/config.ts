import 'dotenv/config';

function env(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error("Missing required environment variable: ${name}");
  }
  return value;
}

export const config = {
  botToken: env('BOT_TOKEN'),
  creatorId: env('THE_CREATORS_ID'),
  databaseUrl: env('DATABASE_URL', 'db.sqlite'),
  prefix: env('TTS_PREFIX', '!'),

} as const;
