const Pool = require("pg").Pool;
 dotenv= require("dotenv");
dotenv.config();
function query(queryString, cbFunc) {
  const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "chatBot",
    password: "987654",
    port: 5432,
  });
  pool.query(queryString, (error, results) => {
    cbFunc(setResponse(error, results));
  });
}
function setResponse(error, results) {
  return {
    error: error,
    results: results ? results : null,
  };
}
module.exports = {
  query,
};