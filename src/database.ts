import Database from 'better-sqlite3'
// Pull in database interface for typechecking
import { DB } from 'kysely-codegen'
import { Kysely, SqliteDialect } from 'kysely'
import { config } from './config.js'

const dialect = new SqliteDialect({
  database: new Database(config.databaseUrl)
})

export const db = new Kysely<DB>({
  dialect,
})

