const Pool = require("pg").Pool;
const dotenv= require("dotenv");
dotenv.config();
function query(queryString, cbFunc) {
  const pool = new Pool({
    user:"chatbot_d8qc_user",
    host:"dpg-cn0c5igcmk4c73am8u6g-a",
    database:"chatbot_d8qc",
    password:"DbCFjiM7OLFSvpXgafPHaqee0iDV8Zad",
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