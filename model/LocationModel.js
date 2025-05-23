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
exports.LocationModel = void 0;
var Mongoose = require("mongoose");
var LocationModel = /** @class */ (function () {
    function LocationModel(DB_CONNECTION_STRING) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }
    LocationModel.prototype.createSchema = function () {
        this.schema = new Mongoose.Schema({
            tripId: String,
            locations: [{
                    name: String,
                    address: String,
                    description: String,
                    dates: [Date],
                    cost: Number
                }]
        }, { collection: 'locations' });
    };
    LocationModel.prototype.createModel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Mongoose.connect(this.dbConnectionString)];
                    case 1:
                        _a.sent();
                        this.model = Mongoose.model("Locations", this.schema);
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Create location
    LocationModel.prototype.createLocation = function (response, locationData) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!locationData.tripId) {
                            return [2 /*return*/, response.status(400).json({ error: "tripId is required" })];
                        }
                        return [4 /*yield*/, this.model.findOneAndUpdate({ tripId: locationData.tripId }, {
                                $push: {
                                    locations: {
                                        name: locationData.name,
                                        address: locationData.address,
                                        description: locationData.description,
                                        dates: locationData.dates,
                                        cost: locationData.cost || 0
                                    }
                                }
                            }, {
                                new: true, // Return updated document
                                upsert: true, // Create if doesn't exist
                                runValidators: true, // Validate against schema
                                setDefaultsOnInsert: true
                            })];
                    case 1:
                        result = _a.sent();
                        // Send appropriate status code (201 for created, 200 for updated)
                        response.status(result ? 200 : 201).json(result);
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        console.error(e_2);
                        response.status(500).json({
                            error: "Failed to save location",
                            details: e_2 instanceof Error ? e_2.message : "Unknown error"
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Retrieve all locations for a trip
    LocationModel.prototype.retrieveLocationsDetails = function (response, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var query, itemArray, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.model.findOne(filter);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.exec()];
                    case 2:
                        itemArray = _a.sent();
                        response.json(itemArray);
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _a.sent();
                        console.error(e_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Retrieve a specific location within a trip
    LocationModel.prototype.retrieveSingleLocationDetail = function (response, tripId, locationName) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.findOne({ tripId: tripId, "locations.name": locationName }, { "locations.$": 1 })];
                    case 1:
                        result = _a.sent();
                        if (!result || !result.locations || result.locations.length === 0) {
                            return [2 /*return*/, response.status(404).json({ error: "Location not found" })];
                        }
                        response.json(result.locations[0]);
                        return [3 /*break*/, 3];
                    case 2:
                        e_4 = _a.sent();
                        console.error(e_4);
                        response.status(500).json({ error: "Server error" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LocationModel.prototype.retrieveLocationsCount = function (response, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var query, innerLocationList, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.model.findOne(filter);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.exec()];
                    case 2:
                        innerLocationList = _a.sent();
                        if (innerLocationList == null) {
                            response.status(404);
                            response.json('{count: -1}');
                        }
                        else {
                            console.log('number of locations: ' + innerLocationList.locations.length);
                            response.json('{count:' + innerLocationList.locations.length + '}');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_5 = _a.sent();
                        console.error(e_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return LocationModel;
}());
exports.LocationModel = LocationModel;
