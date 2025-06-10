"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var App_1 = require("./App");
dotenv.config();
var port = process.env.PORT || 8080;
var dbUser = process.env.DB_USER;
var dbPassword = process.env.DB_PASSWORD;
var dbProtocol = process.env.DB_PROTOCOL;
var mongoDBConnection = dbProtocol + dbUser + ':' + encodeURIComponent(dbPassword) + process.env.DB_INFO;
var sessionSecret = process.env.SESSION_SECRET || 'your-session-secret';
console.log("server db connection URL " + mongoDBConnection);
console.log("Google OAuth configured for:", process.env.CALLBACK_URL);
var server = new App_1.App(mongoDBConnection, sessionSecret).express;
server.listen(port);
console.log("server running in port " + port);
//# sourceMappingURL=AppServer.js.map