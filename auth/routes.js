

module.exports = (router, app, authenticator) => {
    router.post("/register", authenticator.registerUser);
    router.post("/login", app.oauth.grant(), authenticator.login);
    router.post("/forgot-password",authenticator.forgetPassword);
    router.post("/reset-password/:userId",authenticator.resetPassword);
    return router;
};