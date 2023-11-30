// const { Pool } = require('pg');
const mysql = require("mysql");

let env = process.env;
if (process.env.NODE_ENV !== 'production') {
  // env = require('./db.json');
  env = require('./db-mysql.json');
}

// const pool = new Pool({
//   user: env.DB_USER,
//   password: env.DB_PASSWORD,
//   host: env.DB_HOST,
//   port: env.DB_PORT,
//   database: env.DB_DATABASE,
// });

const pool = mysql.createPool({
  connectionLimit: 10,
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  port: env.DB_PORT,
  multipleStatements: true
});

// module.exports = {
//   query: (text, params) => pool.query(text, params)
// };

module.exports = {
  query: (query, params, callBack) => {
    pool.getConnection(function(err,connection){
      if (err) {
        connection.release(error => error ? reject(error) : resolve());
        // throw err;
      }
      params.forEach(element => {
        // check if element is a string
        if (typeof element === 'string' || element instanceof String) {
          element = "'" + element + "'";
        }
        query = query.replace("?", element);
      });
      connection.query(query, function(err,rows){
        connection.release();
        if(!err) {
          callBack({rows: rows}, err);
        } else {
          console.log(err);
        }         
      });
      connection.on('error', function(err) {      
        console.log(err);
      });
    });
  }
};
