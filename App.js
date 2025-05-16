"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var express = require("express");
var bodyParser = require("body-parser");
var TripRouter_1 = require("./routes/TripRouter");
// Creates and configures an ExpressJS web server.
var App = /** @class */ (function () {
    //Run configuration methods on the Express instance.
    function App(mongoDBConnection) {
        this.express = express();
        this.middleware();
        this.tripRouter = new TripRouter_1.TripRouter(mongoDBConnection).router;
        this.routes();
    }
    App.prototype.middleware = function () {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    };
    // Configure API endpoints.
    App.prototype.routes = function () {
        var router = express.Router();
        this.express.use('/trip', this.tripRouter);
        this.express.use('/', router);
    };
    return App;
}());
exports.App = App;
