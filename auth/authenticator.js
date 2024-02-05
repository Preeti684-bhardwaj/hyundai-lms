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
            const message = error
                ? "Something went wrong!"
                : "This user already exists!";

            sendResponse(res, message, error);

            return;
        }
        if(!isValidEmail(req.body.username)){
                const message = error
                ? "Something went wrong!"
                : "Email is invalid!";

            sendResponse(res, message, error);

            return;  
        }
        if(!isValidName(req.body.userTitle)){
            const message = error
            ? "Something went wrong!"
            : "Name is not correct!";

        sendResponse(res, message, error);

        return;  
    }
    if(!isValidPassword(req.body.password)){
        const message = error
        ? "Something went wrong!"
        : "Password should be strong, please use one number, one upper case, one lower case and one special character and characters should be between 8 to 15 only!";

    sendResponse(res, message, error);

    return;  
}

        userDB.register(req.body.username, req.body.userTitle, req.body.password, (response) => {
            sendResponse(
                res,
                response.error === undefined ? "Success!!" : "Something went wrong!",
                response.error
            );
        });
    });
}

function login(query, res) {}

function sendResponse(res, message, error) {
    res.status(error !== undefined ? 400 : 200).json({
        message: message,
        error: error,
    });
}