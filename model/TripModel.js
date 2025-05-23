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
exports.TripModel = void 0;
var Mongoose = require("mongoose");
var TripModel = /** @class */ (function () {
    function TripModel(DB_CONNECTION_STRING) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }
    TripModel.prototype.createSchema = function () {
        this.schema = new Mongoose.Schema({
            name: { type: String, required: true },
            description: String,
            tripId: String,
            userId: { type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
            isPublic: { type: Boolean, default: false },
        }, { collection: 'trips' });
    };
    TripModel.prototype.createModel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Mongoose.connect(this.dbConnectionString)];
                    case 1:
                        _a.sent();
                        this.model = Mongoose.model("Trips", this.schema);
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
    // Create trip
    TripModel.prototype.createTrip = function (response, tripData) {
        return __awaiter(this, void 0, void 0, function () {
            var newTrip, result, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        newTrip = new this.model({
                            name: tripData.name,
                            description: tripData.description,
                            tripId: tripData.tripId,
                            isPublic: tripData.isPublic || false
                        });
                        return [4 /*yield*/, newTrip.save()];
                    case 1:
                        result = _a.sent();
                        response.status(201).json(result);
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        console.error(e_2);
                        response.status(500).send(e_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Update trip
    TripModel.prototype.updateTrip = function (response, tripId, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedTrip, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.findOneAndUpdate({ tripId: tripId }, { $set: updateData }, { new: true, runValidators: true })];
                    case 1:
                        updatedTrip = _a.sent();
                        if (!updatedTrip) {
                            return [2 /*return*/, response.status(404).json({ error: "Trip not found" })];
                        }
                        response.json(updatedTrip);
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        console.error(e_3);
                        response.status(500).send(e_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Retrieves all trips
    TripModel.prototype.retrieveAllTrips = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var query, itemArray, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.model.find({});
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.exec()];
                    case 2:
                        itemArray = _a.sent();
                        response.json(itemArray);
                        return [3 /*break*/, 4];
                    case 3:
                        e_4 = _a.sent();
                        console.error(e_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Retrieve specific trip by tripId
    TripModel.prototype.retrieveTrip = function (response, value) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.model.findOne({ tripId: value });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.exec()];
                    case 2:
                        result = _a.sent();
                        response.json(result);
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
    // Retrieves total trip count
    TripModel.prototype.retrieveTripCount = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var query, numberOfTrips, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("retrieve Trip Count ...");
                        query = this.model.estimatedDocumentCount();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.exec()];
                    case 2:
                        numberOfTrips = _a.sent();
                        console.log("numberOfTrips: " + numberOfTrips);
                        response.json(numberOfTrips);
                        return [3 /*break*/, 4];
                    case 3:
                        e_6 = _a.sent();
                        console.error(e_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return TripModel;
}());
exports.TripModel = TripModel;
