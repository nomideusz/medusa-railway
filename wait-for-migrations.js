// Worker boots alongside the server; its module loaders query tables that only
// exist after the server's migrations. Exit 0 once a late migration's table exists.
const { Client } = require("pg")
const c = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
})
c.connect()
  .then(() => c.query("select to_regclass('public.tax_provider') as t"))
  .then((r) => process.exit(r.rows[0].t ? 0 : 1))
  .catch(() => process.exit(1))
