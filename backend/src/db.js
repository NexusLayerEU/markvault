const { Pool } = require('pg')

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: 5432,
  database: process.env.DB_NAME || 'markvault',
  user: process.env.DB_USER || 'mv_app',
  password: process.env.DB_PASS || 'changeme',
})

async function initDb() {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    CREATE TABLE IF NOT EXISTS docs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      tags TEXT[] DEFAULT '{}',
      pushed_by TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS docs_tags_idx ON docs USING GIN(tags);
    CREATE INDEX IF NOT EXISTS docs_title_idx ON docs USING GIN(to_tsvector('english', title));
  `)
  console.log('DB ready')
}

module.exports = { pool, initDb }
