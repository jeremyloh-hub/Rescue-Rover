const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: "jeremyloh-hub",
  host: "db.bit.io",
  database: "jeremyloh-hub.Adoption",
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;

// pool.query("SELECT * FROM dogs", (err, res) => {
//   console.log(err, res.rows[0]);
//   pool.end();
// });
