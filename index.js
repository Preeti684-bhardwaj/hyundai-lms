// Database imports
const pgPool = require("./db/pgWrapper.js");
const tokenDB = require("./db/tokenDb.js")(pgPool);
const userDB = require("./db/userDb.js")(pgPool);
const cors =require('cors')
const dotenv = require('dotenv').config()
const { PORT ,GRANT_TYPE} = process.env;


// OAuth imports
const oAuthService = require("./auth/tokenServices.js")(userDB, tokenDB);
const oAuth2Server = require("node-oauth2-server");
// Express
const express = require("express");
const app = express();
app.oauth = oAuth2Server({
    model: oAuthService,
    grants: [GRANT_TYPE],
    debug: true,
});
const testAPIService = require("./test/testAPIServices.js");
const testAPIRoutes = require("./test/testAPIRoutes.js")(
    express.Router(),
    app,
    testAPIService
);
// Auth and routes
const authenticator = require("./auth/authenticator.js")(userDB);
const routes = require("./auth/routes.js")(
    express.Router(),
    app,
    authenticator
);
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(app.oauth.errorHandler());
app.use("/auth", routes);
app.use("/test", testAPIRoutes);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});