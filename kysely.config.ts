import dotenv from 'dotenv';
import { SqliteDialect } from 'kysely'
import { defineConfig } from 'kysely-ctl'

import Database from 'better-sqlite3'

dotenv.config();

export default defineConfig({
	dialect: new SqliteDialect({
		database: new Database(
			process.env.DATABASE_URL ?? 'db.sqlite'
		),
	}),

	migrations: {
		migrationFolder: 'src/migrations',
	},
})
