const Joi = require("joi");
var crypto = require("crypto");
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.postgres_URL + "?sslmode=require",
});

module.exports = (router, app, authenticator) => {
    router.post("/register", authenticator.registerUser);
    router.post("/login", async (req, res, next) => {
        try {
            const schema = Joi.object({ 
                username: Joi.string().email().required(),
                password: Joi.string().required(),
                grant_type: Joi.string().required(),
                client_id: Joi.string().required(),
                client_secret: Joi.string().required()
            });
            const { error } = schema.validate(req.body);
            if (error) return res.status(400).send(error.details[0].message);
            
            // Find user by username (email)
            const userQuery = {
                text: "SELECT * FROM users WHERE username = $1",
                values: [req.body.username],
            };
            const userResult = await pool.query(userQuery);
            const user = userResult.rows[0];
            
            if (!user) {
                return res.status(400).send("User with given email doesn't exist");
            }
            console.log(user.user_password);

            const hashedPassword = crypto.createHash("sha256").update(req.body.password).digest("hex");

            // Check if hashed password matches the hashed password stored in the database
            if (user.user_password !== hashedPassword) {
                return res.status(400).send("Invalid password");
            }

            // Continue with OAuth grant if username and password are correct
            app.oauth.grant()(req, res, next);
            
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred");
        }
    }, authenticator.login);

    router.post("/forgot-password", authenticator.forgetPassword);
    router.post("/reset-password/:userId", authenticator.resetPassword);
    
    return router;
};
