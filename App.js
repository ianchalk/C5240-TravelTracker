"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var session = require("express-session");
var path = require("path");
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
    // Configure Express middleware.
    App.prototype.middleware = function (sessionSecret) {
        // Increased payload size limits for photo uploads
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
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Credentials", "true");
            // Handle preflight OPTIONS request
            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
                return;
            }
            next();
        });
    };
    // Configure API endpoints.
    App.prototype.routes = function () {
        // Authentication routes
        this.express.use('/auth', this.authRouter);
        // Trip management routes
        this.express.use('/trip', this.tripRouter);
        // Default route
        this.express.use('/', express.static(path.join(__dirname, 'dist')));
        // Catches all other routes
        this.express.get(/.*/, function (_req, res) {
            res.sendFile(path.join(__dirname, 'dist', 'index.html'));
        });
    };
    return App;
}());
exports.App = App;
//# sourceMappingURL=App.js.map