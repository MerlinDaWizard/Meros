import { db } from '../database.js'

export class UserPreferences {
  static async getVoice(userId: string): Promise<string | null> {
    const row = await db
      .selectFrom('user_preferences')
      .where('user_id', '=', userId)
      .select('voice')
      .executeTakeFirst()

    return row?.voice ?? null
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

