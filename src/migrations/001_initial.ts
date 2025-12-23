import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('user_preferences')
    // https://sqlite.org/lang_createtable.html#the_primary_key
    // Differs to SQL spec and allows null in primary key by default.
    .addColumn('user_id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('voice', 'text', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("user_preferences").execute()
}
