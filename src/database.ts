import Database from 'better-sqlite3'
// Pull in database interface for typechecking
import { DB } from 'kysely-codegen'
import { Kysely, SqliteDialect } from 'kysely'

const DB_PATH = process.env.DATABASE_PATH ?? 'db.sqlite';

const dialect = new SqliteDialect({
  database: new Database(DB_PATH)
})

export const db = new Kysely<DB>({
  dialect,
})

