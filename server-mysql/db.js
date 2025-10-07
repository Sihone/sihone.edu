const mysql = require("mysql");
require("dns").setDefaultResultOrder("ipv4first");

let env = process.env;
if (process.env.NODE_ENV !== "production") {
  env = require("./db-mysql.json");
}

const sqlOptions = {
  connectionLimit: 10,
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  port: env.DB_PORT,
  multipleStatements: true,
  connectTimeout: 15000,   // fail fast on network issues
  waitForConnections: true,
  queueLimit: 0
};

const pool = mysql.createPool(sqlOptions);

module.exports = {
  /**
   * @param {string} sql
   * @param {Array<any>} params
   * @param {(result: {rows: any[]}|null, err: Error|null) => void} callBack
   */
  query: (sql, params = [], callBack) => {
    pool.getConnection((getErr, connection) => {
      if (getErr) {
        // Don't touch connection here; it's undefined on error
        console.error("DB getConnection error:", getErr.code || getErr);
        if (callBack) callBack(null, getErr);
        return;
      }

      // Use parameter binding instead of manual string replacement
      connection.query({ sql, values: params, timeout: 30000 }, (qErr, rows) => {
        // Always release only if we *have* a connection
        connection.release();

        if (qErr) {
          console.error("DB query error:", qErr.code || qErr);
          if (callBack) callBack(null, qErr);
          return;
        }

        if (callBack) callBack({ rows }, null);
      });

      // Optional: connection-level error logging
      connection.on("error", (err) => {
        console.error("DB connection error:", err.code || err);
      });
    });
  }
};
