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
      sendResponse(res, 400, "user already exist!", error);
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

function login(req, res) {  
}


function sendResponse(res, statusCode, message, error) {
  res.status(statusCode).json({
    message: message,
    error: error,
  });
}
