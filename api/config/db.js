// db.js
const { Pool } = require("pg");
const { drizzle } = require("drizzle-orm/node-postgres");
const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
  connectionString: "postgres://aditya:bhosale@localhost:5432/unb_marketplace",
});

const db = drizzle(pool);

module.exports = db;
