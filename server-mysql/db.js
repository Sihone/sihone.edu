const mysql = require("mysql");

let env = process.env;
if (process.env.NODE_ENV !== 'production') {
  env = require('./db-mysql.json');
}
const sqlOptions = {
  connectionLimit: 10,
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
    pool.getConnection(function(err,connection){
      if (err) {
        console.error(err);
        connection.release(error => error ? reject(error) : resolve());
        // throw err;
      }
      params.forEach(element => {
        // check if element is a string
        if (typeof element === 'string' || element instanceof String) {
          element = pool.escape(element);
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
