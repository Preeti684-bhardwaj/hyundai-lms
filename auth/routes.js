

module.exports = (router, app, authenticator) => {
    router.post("/register", authenticator.registerUser);
    router.post("/login", (req, res, next) => {
        app.oauth.grant()(req, res, (err) => {
            if (err instanceof Error && err.code === 400 && err.name === 'OAuth2Error') {
                // Handle invalid credentials error
                return res.status(401).json({ error: 'Invalid username or password' });
            }
            next(err); // Pass other errors to the error handler middleware
        });
    }, authenticator.login);
    router.post("/forgot-password",authenticator.forgetPassword);
    router.post("/reset-password/:userId",authenticator.resetPassword);
    return router;
};