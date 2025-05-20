"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripRouter = void 0;
var express_1 = require("express");
var TripModel_1 = require("../model/TripModel");
var LocationModel_1 = require("../model/LocationModel");
var TripRouter = /** @class */ (function () {
    function TripRouter(mongoDBConnection) {
        this.Trips = new TripModel_1.TripModel(mongoDBConnection);
        this.Locations = new LocationModel_1.LocationModel(mongoDBConnection);
        this.router = (0, express_1.Router)();
        this.routes();
    }
    TripRouter.prototype.routes = function () {
        var _this = this;
        // Retrieves all trips
        this.router.get('/', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.Trips.retrieveAllTrips(res)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Retrieves a specific trip by tripId
        this.router.get('/:tripId', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.tripId;
                        return [4 /*yield*/, this.Trips.retrieveTrip(res, id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Retrieves all locations for a specific trip
        this.router.get('/:tripId/locations', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.tripId;
                        console.log('Query single trip with id: ' + id);
                        return [4 /*yield*/, this.Locations.retrieveLocationsDetails(res, { tripId: id })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Retrieves data of a specific location for a specific trip by tripId and location name
        this.router.get('/:tripId/locations/:locationName', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var tripId, locationName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tripId = req.params.tripId;
                        locationName = req.params.locationName;
                        return [4 /*yield*/, this.Locations.retrieveSingleLocationDetail(res, tripId, locationName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Creates a new trip object with the given trip data
        this.router.post('/create', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var tripData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tripData = {
                            name: req.body.name,
                            description: req.body.description,
                            tripId: req.body.tripId,
                            userId: req.body.userId,
                            isPublic: req.body.isPublic
                        };
                        return [4 /*yield*/, this.Trips.createTrip(res, tripData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Updates an existing trip object with the given tripId
        this.router.put('/update/:tripId', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var tripId, updateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tripId = req.params.tripId;
                        updateData = req.body;
                        return [4 /*yield*/, this.Trips.updateTrip(res, tripId, updateData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Creates a new location object for a specific trip
        // If the trip already has a location object, it will add the new location to the existing array of locations
        this.router.post('/:tripId/locations/create', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var id, locationData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.tripId;
                        locationData = {
                            tripId: id,
                            name: req.body.name,
                            address: req.body.address,
                            description: req.body.description,
                            dates: req.body.dates,
                            cost: req.body.cost
                        };
                        return [4 /*yield*/, this.Locations.createLocation(res, locationData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return TripRouter;
}());
exports.TripRouter = TripRouter;
