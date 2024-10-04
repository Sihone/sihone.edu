const mysql = require("mysql");

let env = process.env;
if (process.env.NODE_ENV !== 'production') {
  env = require('./db-mysql.json');
}
const sqlOptions = {
  connectionLimit: 20,
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  port: env.DB_PORT,
  multipleStatements: true
};

console.log(sqlOptions);
const pool = mysql.createPool(sqlOptions);

module.exports = {
  query: (query, params, callBack) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        console.error("Error getting MySQL connection:", err);
        // If there's an error getting the connection, handle it here and do not attempt to release
        return callBack(null, err);
      }

      // Escaping and replacing query parameters safely
      params.forEach((element, index) => {
        if (typeof element === 'string' || element instanceof String) {
          params[index] = pool.escape(element); // Safely escape string parameters
        }
      });

      connection.query(query, params, function(err, rows) {
        // Ensure connection release happens whether or not there's an error
        connection.release();
        
        if (!err) {
          callBack({ rows: rows }, null);
        } else {
          console.log("Error executing query:", err);
          callBack(null, err);
        }
      });

      connection.on('error', function(err) {
        console.log("Connection error:", err);
        callBack(null, err); // Handle the error
      });
    });
  }
};
