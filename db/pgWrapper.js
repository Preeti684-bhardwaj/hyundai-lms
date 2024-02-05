const Pool = require("pg").Pool;
const dotenv= require("dotenv");
dotenv.config();
const {POSTGRES_USER,POSTGRES_HOST,POSTGRES_PASSWORD,POSTGRES_DATABASE} =process.env
function query(queryString, cbFunc) {
  const pool = new Pool({
    user:POSTGRES_USER,
    host:POSTGRES_HOST,
    database:POSTGRES_DATABASE,
    password:POSTGRES_PASSWORD,
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