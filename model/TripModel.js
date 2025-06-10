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
            amount_spent: { type: Number, default: 0 }
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
                            userId: tripData.userId,
                            isPublic: tripData.isPublic || false,
                            amount_spent: tripData.amount_spent || 0
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
    // Create trip without sending HTTP response (for use in composite operations)
    TripModel.prototype.createTripWithoutResponse = function (tripData) {
        return __awaiter(this, void 0, void 0, function () {
            var newTrip, result, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        newTrip = new this.model({
                            name: tripData.name,
                            description: tripData.description,
                            tripId: tripData.tripId,
                            userId: tripData.userId,
                            isPublic: tripData.isPublic || false,
                            amount_spent: tripData.amount_spent || 0
                        });
                        return [4 /*yield*/, newTrip.save()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, { success: true, data: result }];
                    case 2:
                        e_3 = _a.sent();
                        console.error(e_3);
                        return [2 /*return*/, { success: false, error: e_3 }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Update trip
    TripModel.prototype.updateTrip = function (response, tripId, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedTrip, e_4;
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
                        e_4 = _a.sent();
                        console.error(e_4);
                        response.status(500).send(e_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Update trip privacy status
    TripModel.prototype.updateTripPrivacy = function (response, tripId, isPublic, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, updatedTrip, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("Updating trip privacy - tripId: ".concat(tripId, ", isPublic: ").concat(isPublic, ", userId: ").concat(userId));
                        query = { tripId: tripId };
                        if (userId) {
                            // Check if userId is a valid ObjectId format (24 hex characters)
                            if (/^[0-9a-fA-F]{24}$/.test(userId)) {
                                query.userId = userId;
                            }
                            else {
                                console.warn("Invalid userId format: ".concat(userId, ", proceeding without userId filter"));
                            }
                        }
                        return [4 /*yield*/, this.model.findOneAndUpdate(query, { $set: { isPublic: isPublic } }, { new: true, runValidators: true })];
                    case 1:
                        updatedTrip = _a.sent();
                        if (!updatedTrip) {
                            return [2 /*return*/, response.status(404).json({
                                    error: "Trip not found or you don't have permission to update this trip"
                                })];
                        }
                        console.log("Trip privacy updated successfully:", updatedTrip);
                        response.json({
                            success: true,
                            message: "Trip privacy updated successfully",
                            trip: updatedTrip
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        e_5 = _a.sent();
                        console.error("Error updating trip privacy:", e_5);
                        response.status(500).json({
                            error: "Failed to update trip privacy",
                            details: e_5 instanceof Error ? e_5.message : "Unknown error"
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Retrieves all trips (modified to return only public trips for public view)
    TripModel.prototype.retrieveAllTrips = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var query, itemArray, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.model.find({ isPublic: true }).populate('userId', 'name email picture');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.exec()];
                    case 2:
                        itemArray = _a.sent();
                        response.json(itemArray);
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
    // Retrieves only public trips (for public trips page)
    TripModel.prototype.retrievePublicTrips = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var query, itemArray, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.model.find({ isPublic: true }).populate('userId', 'name email picture');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.exec()];
                    case 2:
                        itemArray = _a.sent();
                        response.json(itemArray);
                        return [3 /*break*/, 4];
                    case 3:
                        e_7 = _a.sent();
                        console.error(e_7);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Retrieves trips for a specific user (both public and private)
    TripModel.prototype.retrieveUserTrips = function (response, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, itemArray, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.model.find({ userId: userId });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.exec()];
                    case 2:
                        itemArray = _a.sent();
                        response.json(itemArray);
                        return [3 /*break*/, 4];
                    case 3:
                        e_8 = _a.sent();
                        console.error(e_8);
                        response.status(500).json({ error: "Failed to retrieve user trips" });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Retrieve specific trip by tripId
    TripModel.prototype.retrieveTrip = function (response, value) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.model.findOne({ tripId: value }).populate('userId', 'name email picture');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, query.exec()];
                    case 2:
                        result = _a.sent();
                        response.json(result);
                        return [3 /*break*/, 4];
                    case 3:
                        e_9 = _a.sent();
                        console.error(e_9);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Retrieves total trip count
    TripModel.prototype.retrieveTripCount = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var query, numberOfTrips, e_10;
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
                        e_10 = _a.sent();
                        console.error(e_10);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Delete a trip by tripId
    TripModel.prototype.deleteTrip = function (response, tripId) {
        return __awaiter(this, void 0, void 0, function () {
            var tripExists, result, e_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.log("Deleting trip with tripId:", tripId);
                        return [4 /*yield*/, this.model.findOne({ tripId: tripId })];
                    case 1:
                        tripExists = _a.sent();
                        if (!tripExists) {
                            return [2 /*return*/, response.status(404).json({ error: "Trip not found" })];
                        }
                        return [4 /*yield*/, this.model.deleteOne({ tripId: tripId })];
                    case 2:
                        result = _a.sent();
                        if (result.deletedCount === 0) {
                            return [2 /*return*/, response.status(404).json({ error: "Trip not found or already deleted" })];
                        }
                        console.log("Trip deleted successfully:", result);
                        response.json({
                            success: true,
                            message: "Trip deleted successfully",
                            deletedCount: result.deletedCount
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        e_11 = _a.sent();
                        console.error("Error deleting trip:", e_11);
                        response.status(500).json({
                            error: "Failed to delete trip",
                            details: e_11 instanceof Error ? e_11.message : "Unknown error"
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Helper method that doesn't send response - for use in composite operations
    TripModel.prototype.deleteTripNoResponse = function (tripId) {
        return __awaiter(this, void 0, void 0, function () {
            var tripExists, result, e_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.log("Deleting trip with tripId:", tripId);
                        return [4 /*yield*/, this.model.findOne({ tripId: tripId })];
                    case 1:
                        tripExists = _a.sent();
                        if (!tripExists) {
                            throw new Error("Trip not found");
                        }
                        return [4 /*yield*/, this.model.deleteOne({ tripId: tripId })];
                    case 2:
                        result = _a.sent();
                        if (result.deletedCount === 0) {
                            throw new Error("Trip not found or already deleted");
                        }
                        console.log("Trip deleted successfully:", result);
                        return [2 /*return*/, {
                                success: true,
                                message: "Trip deleted successfully",
                                deletedCount: result.deletedCount
                            }];
                    case 3:
                        e_12 = _a.sent();
                        console.error("Error deleting trip:", e_12);
                        throw e_12;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Helper method that doesn't send response - for use in composite operations
    TripModel.prototype.updateTripPrivacyNoResponse = function (tripId, isPublic, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, updatedTrip, e_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("Updating trip privacy - tripId: ".concat(tripId, ", isPublic: ").concat(isPublic, ", userId: ").concat(userId));
                        query = { tripId: tripId };
                        if (userId) {
                            query.userId = userId;
                        }
                        return [4 /*yield*/, this.model.findOneAndUpdate(query, { $set: { isPublic: isPublic } }, { new: true, runValidators: true })];
                    case 1:
                        updatedTrip = _a.sent();
                        if (!updatedTrip) {
                            throw new Error("Trip not found or you don't have permission to update this trip");
                        }
                        console.log("Trip privacy updated successfully:", updatedTrip);
                        return [2 /*return*/, {
                                success: true,
                                message: "Trip privacy updated successfully",
                                trip: updatedTrip
                            }];
                    case 2:
                        e_13 = _a.sent();
                        console.error("Error updating trip privacy:", e_13);
                        throw e_13;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Search public trips by name and places within trips
    TripModel.prototype.searchPublicTrips = function (response, searchQuery) {
        return __awaiter(this, void 0, void 0, function () {
            var aggregationPipeline, itemArray, e_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("Searching public trips with query:", searchQuery);
                        aggregationPipeline = [
                            // First, only include public trips
                            {
                                $match: {
                                    isPublic: true
                                }
                            },
                            // Left join with locations collection to get trip places
                            {
                                $lookup: {
                                    from: 'locations',
                                    localField: 'tripId',
                                    foreignField: 'tripId',
                                    as: 'locationData'
                                }
                            },
                            // Populate user data
                            {
                                $lookup: {
                                    from: 'users',
                                    localField: 'userId',
                                    foreignField: '_id',
                                    as: 'userInfo',
                                    pipeline: [
                                        { $project: { name: 1, email: 1, picture: 1 } }
                                    ]
                                }
                            },
                            // Add userId field from userInfo array
                            {
                                $addFields: {
                                    userId: { $arrayElemAt: ['$userInfo', 0] }
                                }
                            },
                            // Remove userInfo array since we've moved it to userId
                            {
                                $unset: 'userInfo'
                            },
                            // Flatten the locations array to get all individual locations
                            {
                                $addFields: {
                                    allLocations: {
                                        $reduce: {
                                            input: '$locationData',
                                            initialValue: [],
                                            in: {
                                                $concatArrays: ['$$value', { $ifNull: ['$$this.locations', []] }]
                                            }
                                        }
                                    }
                                }
                            },
                            // Create searchable fields array that includes trip name and all location data
                            {
                                $addFields: {
                                    searchableContent: {
                                        $concatArrays: [
                                            // Trip name as array
                                            [{ $toLower: { $ifNull: ['$name', ''] } }],
                                            // Trip description as array
                                            [{ $toLower: { $ifNull: ['$description', ''] } }],
                                            // Location names from flattened locations
                                            {
                                                $map: {
                                                    input: { $ifNull: ['$allLocations', []] },
                                                    as: 'location',
                                                    in: { $toLower: { $ifNull: ['$$location.name', ''] } }
                                                }
                                            },
                                            // Location addresses (formatted address)
                                            {
                                                $map: {
                                                    input: { $ifNull: ['$allLocations', []] },
                                                    as: 'location',
                                                    in: { $toLower: { $ifNull: ['$$location.address.formattedAddress', ''] } }
                                                }
                                            },
                                            // Location cities
                                            {
                                                $map: {
                                                    input: { $ifNull: ['$allLocations', []] },
                                                    as: 'location',
                                                    in: { $toLower: { $ifNull: ['$$location.address.city', ''] } }
                                                }
                                            },
                                            // Location countries
                                            {
                                                $map: {
                                                    input: { $ifNull: ['$allLocations', []] },
                                                    as: 'location',
                                                    in: { $toLower: { $ifNull: ['$$location.address.country', ''] } }
                                                }
                                            }
                                        ]
                                    }
                                }
                            },
                            // Filter trips that contain the search query in any searchable content
                            {
                                $match: {
                                    searchableContent: {
                                        $elemMatch: {
                                            $regex: searchQuery.toLowerCase(),
                                            $options: 'i'
                                        }
                                    }
                                }
                            },
                            // Remove the temporary fields
                            {
                                $unset: ['searchableContent', 'locationData', 'allLocations']
                            }
                        ];
                        return [4 /*yield*/, this.model.aggregate(aggregationPipeline).exec()];
                    case 1:
                        itemArray = _a.sent();
                        console.log("Found ".concat(itemArray.length, " trips matching search query (including places)"));
                        response.json(itemArray);
                        return [3 /*break*/, 3];
                    case 2:
                        e_14 = _a.sent();
                        console.error("Error searching trips:", e_14);
                        response.status(500).json({
                            error: "Failed to search trips",
                            details: e_14 instanceof Error ? e_14.message : "Unknown error"
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return TripModel;
}());
exports.TripModel = TripModel;
//# sourceMappingURL=TripModel.js.map