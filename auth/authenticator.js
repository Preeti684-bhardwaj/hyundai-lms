let userDB;
const dotenv = require("dotenv");

const {
  isValidName,
  isValidEmail,
  isValidPassword,
} = require("../utils/validator");
const crypto = require("crypto");
const Joi = require("joi");
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.postgres_URL + "?sslmode=require",
});

module.exports = (injectedUserDB) => {
  userDB = injectedUserDB;

  return {
    registerUser,
    login,
    forgetPassword,
    // resetPassword,
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

function login(req, res) {}

async function forgetPassword(req, res) {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Find user by username (email)
    const userQuery = {
      text: "SELECT * FROM users WHERE username = $1",
      values: [req.body.email],
    };
    const userResult = await pool.query(userQuery);
    const user = userResult.rows[0];
    console.log(user);

    if (!user) {
      return res.status(400).send("User with given email doesn't exist");
    }

    return res.status(200).send({"success":true,"message":"valid email"});
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
}

// async function resetPassword(req, res) {
//   try {
//     const schema = Joi.object({ password: Joi.string().required() });
//     const { error } = schema.validate(req.body);
//     if (error) return res.status(400).send(error.details[0].message);

//     const user = await User.findById(req.params.userId);
//     if (!user) return res.status(400).send("invalid link or expired");

//     const token = await Token.findOne({
//       userId: user._id,
//       token: req.params.token,
//     });
//     if (!token) return res.status(400).send("Invalid link or expired");

//     user.password = req.body.password;
//     await user.save();
//     await token.delete();

//     res.send("password reset sucessfully.");
//   } catch (error) {
//     res.send("An error occured");
//     console.log(error);
//   }
// }
function sendResponse(res, statusCode, message, error) {
  res.status(statusCode).json({
    message: message,
    error: error,
  });
}
