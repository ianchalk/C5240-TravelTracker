"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var session = require("express-session");
var TripRouter_1 = require("./routes/TripRouter");
var AuthRouter_1 = require("./routes/AuthRouter");
var GooglePassport_1 = require("./config/GooglePassport");
// Creates and configures an ExpressJS web server.
var App = /** @class */ (function () {
    //Run configuration methods on the Express instance.
    function App(mongoDBConnection, sessionSecret) {
        this.googlePassportObj = new GooglePassport_1.default();
        this.express = express();
        this.middleware(sessionSecret);
        this.tripRouter = new TripRouter_1.TripRouter(mongoDBConnection).router;
        this.authRouter = new AuthRouter_1.AuthRouter().router;
        this.routes();
    }
    App.prototype.middleware = function (sessionSecret) {
        // Increase payload size limits for photo uploads
        this.express.use(bodyParser.json({ limit: '50mb' }));
        this.express.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
        // Session configuration
        this.express.use(session({
            secret: sessionSecret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false, // Set to true in production with HTTPS
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            }
        }));
        // Initialize Passport and session handling
        this.express.use(passport.initialize());
        this.express.use(passport.session());
        // CORS configuration
        this.express.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    };
    // Configure API endpoints.
    App.prototype.routes = function () {
        var router = express.Router();
        // Authentication routes
        this.express.use('/auth', this.authRouter);
        // Trip management routes
        this.express.use('/trip', this.tripRouter);
        // Default route
        this.express.use('/', express.static(__dirname + '/dist'));
    };
    return App;
}());
exports.App = App;
//# sourceMappingURL=App.js.map