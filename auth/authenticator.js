let userDB;
const {
  isValidName,
  isValidEmail,
  isValidPassword,
} = require("../utils/validator");

module.exports = (injectedUserDB) => {
  userDB = injectedUserDB;

  return {
    registerUser,
    login,
  };
};

function registerUser(req, res) {
  userDB.isValidUser(req.body.username, (error, isValidUser) => {
    if (error || !isValidUser) {
      sendResponse(res, 400, "Something went wrong!", error);
      return;
    }

    if (!isValidEmail(req.body.username)) {
      sendResponse(res, 400, "Email is invalid!", error);
      return;
    }

    if (!isValidName(req.body.userTitle)) {
      sendResponse(res, 400, "Name is not correct!", error);
      return;
    }

    if (!isValidPassword(req.body.password)) {
      sendResponse(
        res,
        400,
        "Password should be strong, please use one number, one upper case, one lower case, and one special character, and characters should be between 8 to 15 only!",
        error
      );
      return;
    }

    userDB.register(
      req.body.username,
      req.body.userTitle,
      req.body.password,
      (response) => {
        sendResponse(
          res,
          response.error === undefined ? 200 : 400,
          response.error === undefined ? "Success!!" : "Something went wrong!",
          response.error
        );
      }
    );
  });
}

function login(username, password, res) {
    getUser(username, password, (error, user, statusCode, errorMessage) => {
        if (error) {
            // Handle the case where username and password don't match
            res.status(statusCode).json({ error: errorMessage });
        } else {
            // Handle the case where login is successful
            if (user) {
                res.status(200).json({ message: "Login successful", user: user });
            } else {
                // Handle the case where no user is found
                res.status(404).json({ error: "User not found" });
            }
        }
    });
}


function sendResponse(res, statusCode, message, error) {
  res.status(statusCode).json({
    message: message,
    error: error,
  });
}
