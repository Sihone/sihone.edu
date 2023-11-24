const { Pool } = require('pg');

let env = process.env;
if (process.env.NODE_ENV !== 'production') {
  env = require('./db.json');
}

const pool = new Pool({
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_DATABASE,
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};
