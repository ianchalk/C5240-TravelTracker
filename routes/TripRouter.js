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
        // Retrieves all public trips (default behavior)
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
        // NEW: Retrieves trips for a specific user (both public and private)
        this.router.get('/user/:userId', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var userId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.params.userId;
                        return [4 /*yield*/, this.Trips.retrieveUserTrips(res, userId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // NEW: Retrieves trips for currently authenticated user
        this.router.get('/my-trips', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var userId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.query.userId;
                        if (!userId) {
                            res.status(400).json({ error: "User ID is required" });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.Trips.retrieveUserTrips(res, userId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Search public trips by name
        this.router.get('/search', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var searchQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchQuery = req.query.q;
                        if (!searchQuery) {
                            res.status(400).json({ error: "Search query is required" });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.Trips.searchPublicTrips(res, searchQuery)];
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
            var id, isValidObjectId, tripQuery, numericTripId, locationData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        id = req.params.tripId;
                        console.log('Creating location for trip ID:', id);
                        isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
                        tripQuery = void 0;
                        if (!isValidObjectId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.Trips.model.findOne({ _id: id })];
                    case 1:
                        // If it's a valid ObjectId, search by _id
                        tripQuery = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.Trips.model.findOne({ tripId: id })];
                    case 3:
                        // If it's not a valid ObjectId, search by tripId field
                        tripQuery = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!tripQuery) {
                            res.status(404).json({ error: "Trip not found" });
                            return [2 /*return*/];
                        }
                        numericTripId = tripQuery.tripId;
                        console.log('Found trip with numeric tripId:', numericTripId);
                        locationData = {
                            tripId: numericTripId, // Use the numeric tripId, not the MongoDB _id
                            name: req.body.name,
                            address: req.body.address,
                            description: req.body.description,
                            startDate: req.body.startDate,
                            endDate: req.body.endDate,
                            notes: req.body.notes,
                            photos: req.body.photos || [],
                            dates: req.body.dates,
                            cost: req.body.cost
                        };
                        console.log('Creating location with data:', locationData);
                        return [4 /*yield*/, this.Locations.createLocation(res, locationData)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        console.error('Error creating location:', error_1);
                        res.status(500).json({ error: "Internal server error" });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
        // Alternative endpoint for creating locations (simplified path)
        this.router.post('/:tripId/locations', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var id, isValidObjectId, tripQuery, numericTripId, locationData, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        id = req.params.tripId;
                        console.log('Creating location (alternative endpoint) for trip ID:', id);
                        isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
                        tripQuery = void 0;
                        if (!isValidObjectId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.Trips.model.findOne({ _id: id })];
                    case 1:
                        // If it's a valid ObjectId, search by _id
                        tripQuery = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.Trips.model.findOne({ tripId: id })];
                    case 3:
                        // If it's not a valid ObjectId, search by tripId field
                        tripQuery = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!tripQuery) {
                            res.status(404).json({ error: "Trip not found" });
                            return [2 /*return*/];
                        }
                        numericTripId = tripQuery.tripId;
                        console.log('Found trip with numericTripId:', numericTripId);
                        locationData = {
                            tripId: numericTripId, // Use the numeric tripId, not the MongoDB _id
                            name: req.body.name,
                            address: req.body.address,
                            description: req.body.description,
                            startDate: req.body.startDate,
                            endDate: req.body.endDate,
                            notes: req.body.notes,
                            photos: req.body.photos || [],
                            dates: req.body.dates,
                            cost: req.body.cost
                        };
                        console.log('Creating location with data:', locationData);
                        return [4 /*yield*/, this.Locations.createLocation(res, locationData)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        console.error('Error creating location:', error_2);
                        res.status(500).json({ error: "Internal server error" });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
        // Delete a specific location from a trip by index
        this.router.delete('/:tripId/locations/:locationIndex', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var tripId, locationIndex, isValidObjectId, tripQuery, numericTripId, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        tripId = req.params.tripId;
                        locationIndex = parseInt(req.params.locationIndex);
                        console.log('Deleting location at index', locationIndex, 'from trip ID:', tripId);
                        if (isNaN(locationIndex) || locationIndex < 0) {
                            res.status(404).json({ error: "Invalid location index" });
                            return [2 /*return*/];
                        }
                        isValidObjectId = /^[0-9a-fA-F]{24}$/.test(tripId);
                        tripQuery = void 0;
                        if (!isValidObjectId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.Trips.model.findOne({ _id: tripId })];
                    case 1:
                        // If it's a valid ObjectId, search by _id
                        tripQuery = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.Trips.model.findOne({ tripId: tripId })];
                    case 3:
                        // If it's not a valid ObjectId, search by tripId field
                        tripQuery = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!tripQuery) {
                            res.status(404).json({ error: "Trip not found" });
                            return [2 /*return*/];
                        }
                        numericTripId = tripQuery.tripId;
                        console.log('Found trip with numeric tripId:', numericTripId);
                        return [4 /*yield*/, this.Locations.deleteLocation(res, numericTripId, locationIndex)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_3 = _a.sent();
                        console.error('Error deleting location:', error_3);
                        res.status(500).json({ error: "Internal server error" });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
        // Creates a new trip with initial places
        this.router.post('/create-with-places', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var tripId, tripData, tripResult, createdPlaces, hasErrors, _i, _a, place, locationData, locationResult, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        tripId = Date.now().toString();
                        tripData = {
                            name: req.body.name,
                            description: req.body.description,
                            tripId: tripId,
                            userId: req.body.userId,
                            isPublic: req.body.isPublic || false,
                            amount_spent: req.body.amount_spent || 0
                        };
                        return [4 /*yield*/, this.Trips.createTripWithoutResponse(tripData)];
                    case 1:
                        tripResult = _b.sent();
                        if (!tripResult.success) {
                            console.error('Error creating trip:', tripResult.error);
                            res.status(500).json({
                                success: false,
                                message: 'Error creating trip',
                                error: tripResult.error
                            });
                            return [2 /*return*/];
                        }
                        createdPlaces = [];
                        hasErrors = false;
                        if (!(req.body.places && req.body.places.length > 0)) return [3 /*break*/, 5];
                        _i = 0, _a = req.body.places;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        place = _a[_i];
                        locationData = {
                            tripId: tripId,
                            name: place.name,
                            address: place.address || '',
                            description: place.description || '',
                            startDate: place.startDate,
                            endDate: place.endDate,
                            notes: place.notes || '',
                            photos: place.photos || [],
                            cost: place.cost || 0
                        };
                        return [4 /*yield*/, this.Locations.createLocationWithoutResponse(locationData)];
                    case 3:
                        locationResult = _b.sent();
                        if (locationResult.success) {
                            createdPlaces.push(locationResult.data);
                        }
                        else {
                            console.error('Error creating location:', locationResult.error);
                            hasErrors = true;
                            // Continue with other places even if one fails
                        }
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        // Return success response with trip ID and created places info
                        res.status(201).json({
                            success: true,
                            message: hasErrors ? 'Trip created successfully with some place creation errors' : 'Trip created successfully with places',
                            tripId: tripId,
                            trip: tripResult.data,
                            placesCreated: createdPlaces.length,
                            totalPlaces: req.body.places ? req.body.places.length : 0
                        });
                        return [3 /*break*/, 7];
                    case 6:
                        error_4 = _b.sent();
                        console.error('Error creating trip with places:', error_4);
                        res.status(500).json({
                            success: false,
                            message: 'Error creating trip with places',
                            error: error_4 instanceof Error ? error_4.message : 'Unknown error'
                        });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
        // Update trip privacy status
        this.router.patch('/:tripId/privacy', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var tripId, _a, isPublic, userId, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        tripId = req.params.tripId;
                        _a = req.body, isPublic = _a.isPublic, userId = _a.userId;
                        // Validate required parameters
                        if (typeof isPublic !== 'boolean') {
                            res.status(400).json({ error: "isPublic must be a boolean value" });
                            return [2 /*return*/];
                        }
                        console.log("Updating privacy for trip ".concat(tripId, " to ").concat(isPublic ? 'public' : 'private'));
                        // Update the trip privacy (optionally check userId for security)
                        return [4 /*yield*/, this.Trips.updateTripPrivacy(res, tripId, isPublic, userId)];
                    case 1:
                        // Update the trip privacy (optionally check userId for security)
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _b.sent();
                        console.error('Error updating trip privacy:', error_5);
                        if (!res.headersSent) {
                            res.status(500).json({
                                error: "Failed to update trip privacy",
                                details: error_5 instanceof Error ? error_5.message : "Unknown error"
                            });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // Update photos for a specific location (direct photo update endpoint)
        this.router.put('/:tripId/locations/:placeIndex/photos', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var tripId, placeIndex, photos, tripData, result, error_6;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        tripId = req.params.tripId;
                        placeIndex = parseInt(req.params.placeIndex);
                        photos = req.body.photos;
                        if (isNaN(placeIndex) || placeIndex < 0) {
                            res.status(400).json({ error: "Invalid place index" });
                            return [2 /*return*/];
                        }
                        if (!Array.isArray(photos)) {
                            res.status(400).json({ error: "Photos must be an array" });
                            return [2 /*return*/];
                        }
                        console.log("Updating photos for trip ".concat(tripId, ", location ").concat(placeIndex));
                        return [4 /*yield*/, this.Locations.model.findOne({ tripId: tripId })];
                    case 1:
                        tripData = _b.sent();
                        if (!tripData) {
                            res.status(404).json({ error: "Trip not found" });
                            return [2 /*return*/];
                        }
                        if (!tripData.locations || placeIndex >= tripData.locations.length) {
                            res.status(404).json({ error: "Location not found at specified index" });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.Locations.model.findOneAndUpdate({ tripId: tripId }, { $set: (_a = {}, _a["locations.".concat(placeIndex, ".photos")] = photos, _a) }, { new: true, runValidators: true })];
                    case 2:
                        result = _b.sent();
                        res.json({
                            success: true,
                            message: "Photos updated successfully",
                            location: result.locations[placeIndex]
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _b.sent();
                        console.error('Error updating location photos:', error_6);
                        if (!res.headersSent) {
                            res.status(500).json({
                                error: "Failed to update photos",
                                details: error_6 instanceof Error ? error_6.message : "Unknown error"
                            });
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Update entire location (including photos)
        this.router.put('/:tripId/locations/:placeIndex', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var tripId, placeIndex, locationData, tripData, normalizedAddress, duration, start, end, updateData, result, error_7;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        tripId = req.params.tripId;
                        placeIndex = parseInt(req.params.placeIndex);
                        locationData = req.body;
                        if (isNaN(placeIndex) || placeIndex < 0) {
                            res.status(400).json({ error: "Invalid place index" });
                            return [2 /*return*/];
                        }
                        console.log("Updating entire location for trip ".concat(tripId, ", location ").concat(placeIndex));
                        return [4 /*yield*/, this.Locations.model.findOne({ tripId: tripId })];
                    case 1:
                        tripData = _b.sent();
                        if (!tripData) {
                            res.status(404).json({ error: "Trip not found" });
                            return [2 /*return*/];
                        }
                        if (!tripData.locations || placeIndex >= tripData.locations.length) {
                            res.status(404).json({ error: "Location not found at specified index" });
                            return [2 /*return*/];
                        }
                        normalizedAddress = tripData.locations[placeIndex].address;
                        if (locationData.address) {
                            normalizedAddress = this.Locations.normalizeAddressInput(locationData.address);
                        }
                        duration = tripData.locations[placeIndex].duration;
                        if (locationData.startDate && locationData.endDate) {
                            start = new Date(locationData.startDate);
                            end = new Date(locationData.endDate);
                            duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                        }
                        updateData = (_a = {},
                            _a["locations.".concat(placeIndex, ".name")] = locationData.name || tripData.locations[placeIndex].name,
                            _a["locations.".concat(placeIndex, ".address")] = normalizedAddress,
                            _a["locations.".concat(placeIndex, ".description")] = locationData.description || tripData.locations[placeIndex].description,
                            _a["locations.".concat(placeIndex, ".startDate")] = locationData.startDate || tripData.locations[placeIndex].startDate,
                            _a["locations.".concat(placeIndex, ".endDate")] = locationData.endDate || tripData.locations[placeIndex].endDate,
                            _a["locations.".concat(placeIndex, ".duration")] = duration,
                            _a["locations.".concat(placeIndex, ".notes")] = locationData.notes || tripData.locations[placeIndex].notes,
                            _a["locations.".concat(placeIndex, ".photos")] = locationData.photos || tripData.locations[placeIndex].photos || [],
                            _a["locations.".concat(placeIndex, ".cost")] = locationData.cost !== undefined ? locationData.cost : tripData.locations[placeIndex].cost,
                            _a);
                        return [4 /*yield*/, this.Locations.model.findOneAndUpdate({ tripId: tripId }, { $set: updateData }, { new: true, runValidators: true })];
                    case 2:
                        result = _b.sent();
                        res.json({
                            success: true,
                            message: "Location updated successfully",
                            location: result.locations[placeIndex]
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_7 = _b.sent();
                        console.error('Error updating location:', error_7);
                        if (!res.headersSent) {
                            res.status(500).json({
                                error: "Failed to update location",
                                details: error_7 instanceof Error ? error_7.message : "Unknown error"
                            });
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Delete an entire trip and all its locations
        this.router.delete('/:tripId', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var tripId, locationsResult, tripResult, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        tripId = req.params.tripId;
                        console.log('Deleting entire trip with ID:', tripId);
                        return [4 /*yield*/, this.Locations.deleteAllLocationsForTripNoResponse(tripId)];
                    case 1:
                        locationsResult = _a.sent();
                        return [4 /*yield*/, this.Trips.deleteTripNoResponse(tripId)];
                    case 2:
                        tripResult = _a.sent();
                        // Send a single success response
                        res.json({
                            success: true,
                            message: 'Trip and all locations deleted successfully',
                            locationsDeleted: locationsResult.deletedCount,
                            tripDeleted: tripResult.deletedCount
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_8 = _a.sent();
                        console.error('Error deleting trip:', error_8);
                        if (!res.headersSent) {
                            res.status(500).json({
                                success: false,
                                message: 'Error deleting trip',
                                error: error_8 instanceof Error ? error_8.message : 'Unknown error'
                            });
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    return TripRouter;
}());
exports.TripRouter = TripRouter;
//# sourceMappingURL=TripRouter.js.map