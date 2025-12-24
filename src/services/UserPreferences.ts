import { db } from '../database.js'

const DEFAULT_VOICE = "en";

export class UserPreferences {
  static async getVoice(userId: string): Promise<string> {
    const row = await db
      .selectFrom('user_preferences')
      .where('user_id', '=', userId)
      .select('voice')
      .executeTakeFirst()

    return row?.voice ?? DEFAULT_VOICE
  }

  static async setVoice(
    userId: string,
    voice: string,
  ): Promise<void> {
    await db
      .insertInto('user_preferences')
      .values({
        user_id: userId,
        voice,
      })
      .onConflict(oc =>
        oc.column('user_id').doUpdateSet({
          voice,
        }),
      )
      .execute()
  }
}

