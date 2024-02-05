const Pool = require("pg").Pool;
const dotenv= require("dotenv");

function query(queryString, cbFunc) {
    const pool = new Pool({
        connectionString: process.env.postgres_URL + "?sslmode=require",
      })
      pool.connect((err)=>{
        if(err) throw err
        console.log("database connected successfully ")
      })
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