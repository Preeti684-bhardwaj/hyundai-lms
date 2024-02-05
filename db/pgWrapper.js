const Pool = require("pg").Pool;
const dotenv= require("dotenv");
dotenv.config();
function query(queryString, cbFunc) {
  const pool = new Pool({
    user: process.env.USERNAME,
    host: process.env.USERHOST,
    database:  process.env.DATABASE,
    password:  process.env.USERPASSWORD,
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