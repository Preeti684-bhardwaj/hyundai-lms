let pgPool;

module.exports = (injectedPgPool) => {
  pgPool = injectedPgPool;

  return {
    register,
    getUser,
    isValidUser,
  };
};

var crypto = require("crypto");

async function register(username, userTitle, password, cbFunc) {
    var shaPass = crypto.createHash("sha256").update(password).digest("hex"); 

    const query = `INSERT INTO users (username, user_title, user_password) VALUES ('${username}','${userTitle}', '${shaPass}')`;

    pgPool.query(query, cbFunc);
}

function getUser(username, password, cbFunc) {
    var shaPass = crypto.createHash("sha256").update(password).digest("hex");

    const getUserQuery = `SELECT * FROM users WHERE username = '${username}' AND user_password = '${shaPass}'`;

    pgPool.query(getUserQuery, (response) => {
        if (response.results && response.results.rowCount === 1) {
            const user = response.results.rows[0];

            // Compare username and password
            if (user.username !== user.user_password) {
                // Username and password don't match
                cbFunc(true, null, 400, "Password doesn't match");
            } else {
                // Username and password match
                cbFunc(false, user);
            }
        } else {
            // No user found
            cbFunc(false, null);
        }
    });
}

function isValidUser(username, cbFunc) {
    const query = `SELECT * FROM users WHERE username = '${username}'`;

    const checkUsrcbFunc = (response) => {
        const isValidUser = response.results
            ? !(response.results.rowCount > 0)
            : null;

        cbFunc(response.error, isValidUser);
    };

    pgPool.query(query, checkUsrcbFunc);
}