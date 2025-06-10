"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
                    address: {
                        formattedAddress: { type: String, required: true },
                        streetNumber: String,
                        streetName: String,
                        city: { type: String, required: true },
                        state: String,
                        country: { type: String, required: true },
                        postalCode: String,
                        coordinates: {
                            latitude: Number,
                            longitude: Number
                        },
                        placeId: String, // Google Places API Place ID
                        types: [String] // Google Places types array
                    },
                    description: String,
                    startDate: Date,
                    endDate: Date,
                    duration: Number, // calculated field in days
                    notes: String, // separate from description for user notes
                    photos: [String], // array of photo URLs/paths
                    dates: [Date], // keeping for backward compatibility
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
            var duration, start, end, normalizedAddress, result, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('=== CREATE LOCATION DEBUG ===');
                        console.log('Input locationData:', JSON.stringify(locationData, null, 2));
                        if (!locationData.tripId) {
                            return [2 /*return*/, response.status(400).json({ error: "tripId is required" })];
                        }
                        duration = 0;
                        if (locationData.startDate && locationData.endDate) {
                            start = new Date(locationData.startDate);
                            end = new Date(locationData.endDate);
                            duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                        }
                        console.log('Raw address data:', JSON.stringify(locationData.address, null, 2));
                        normalizedAddress = this.normalizeAddressInput(locationData.address);
                        console.log('Normalized address result:', JSON.stringify(normalizedAddress, null, 2));
                        if (!normalizedAddress) {
                            console.log('ERROR: normalizeAddressInput returned null/undefined');
                            return [2 /*return*/, response.status(400).json({ error: "Invalid address format" })];
                        }
                        // Validate required fields
                        if (!normalizedAddress.formattedAddress) {
                            console.log('ERROR: Missing formattedAddress');
                            return [2 /*return*/, response.status(400).json({ error: "formattedAddress is required" })];
                        }
                        if (!normalizedAddress.city) {
                            console.log('ERROR: Missing city');
                            return [2 /*return*/, response.status(400).json({ error: "city is required" })];
                        }
                        if (!normalizedAddress.country) {
                            console.log('ERROR: Missing country');
                            return [2 /*return*/, response.status(400).json({ error: "country is required" })];
                        }
                        return [4 /*yield*/, this.model.findOneAndUpdate({ tripId: locationData.tripId }, {
                                $push: {
                                    locations: {
                                        name: locationData.name,
                                        address: normalizedAddress,
                                        description: locationData.description,
                                        startDate: locationData.startDate,
                                        endDate: locationData.endDate,
                                        duration: duration,
                                        notes: locationData.notes,
                                        photos: locationData.photos || [],
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
    // Create location without sending HTTP response (for use in composite operations)
    LocationModel.prototype.createLocationWithoutResponse = function (locationData) {
        return __awaiter(this, void 0, void 0, function () {
            var duration, start, end, normalizedAddress, result, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('=== CREATE LOCATION WITHOUT RESPONSE DEBUG ===');
                        console.log('Input locationData:', JSON.stringify(locationData, null, 2));
                        if (!locationData.tripId) {
                            return [2 /*return*/, { success: false, error: "tripId is required" }];
                        }
                        duration = 0;
                        if (locationData.startDate && locationData.endDate) {
                            start = new Date(locationData.startDate);
                            end = new Date(locationData.endDate);
                            duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                        }
                        console.log('Raw address data:', JSON.stringify(locationData.address, null, 2));
                        normalizedAddress = this.normalizeAddressInput(locationData.address);
                        console.log('Normalized address result:', JSON.stringify(normalizedAddress, null, 2));
                        if (!normalizedAddress) {
                            console.log('ERROR: normalizeAddressInput returned null/undefined');
                            return [2 /*return*/, { success: false, error: "Invalid address format" }];
                        }
                        // Validate required fields
                        if (!normalizedAddress.formattedAddress) {
                            console.log('ERROR: Missing formattedAddress');
                            return [2 /*return*/, { success: false, error: "formattedAddress is required" }];
                        }
                        if (!normalizedAddress.city) {
                            console.log('ERROR: Missing city');
                            return [2 /*return*/, { success: false, error: "city is required" }];
                        }
                        if (!normalizedAddress.country) {
                            console.log('ERROR: Missing country');
                            return [2 /*return*/, { success: false, error: "country is required" }];
                        }
                        return [4 /*yield*/, this.model.findOneAndUpdate({ tripId: locationData.tripId }, {
                                $push: {
                                    locations: {
                                        name: locationData.name,
                                        address: normalizedAddress,
                                        description: locationData.description,
                                        startDate: locationData.startDate,
                                        endDate: locationData.endDate,
                                        duration: duration,
                                        notes: locationData.notes,
                                        photos: locationData.photos || [],
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
                        return [2 /*return*/, { success: true, data: result }];
                    case 2:
                        e_3 = _a.sent();
                        console.error(e_3);
                        return [2 /*return*/, {
                                success: false,
                                error: "Failed to save location",
                                details: e_3 instanceof Error ? e_3.message : "Unknown error"
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Retrieve all locations for a trip
    LocationModel.prototype.retrieveLocationsDetails = function (response, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var query, itemArray, e_4;
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
                        e_4 = _a.sent();
                        console.error(e_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Retrieve a specific location within a trip
    LocationModel.prototype.retrieveSingleLocationDetail = function (response, tripId, locationName) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_5;
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
                        e_5 = _a.sent();
                        console.error(e_5);
                        response.status(500).json({ error: "Server error" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LocationModel.prototype.retrieveLocationsCount = function (response, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var query, innerLocationList, e_6;
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
                        e_6 = _a.sent();
                        console.error(e_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Delete a location from a trip by index
    LocationModel.prototype.deleteLocation = function (response, tripId, locationIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var tripData, result, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.model.findOne({ tripId: tripId })];
                    case 1:
                        tripData = _a.sent();
                        if (!tripData) {
                            return [2 /*return*/, response.status(404).json({ error: "Trip not found" })];
                        }
                        if (!tripData.locations || tripData.locations.length === 0) {
                            return [2 /*return*/, response.status(404).json({ error: "No locations found for this trip" })];
                        }
                        if (locationIndex >= tripData.locations.length || locationIndex < 0) {
                            return [2 /*return*/, response.status(400).json({ error: "Invalid location index" })];
                        }
                        // Remove the location at the specified index
                        tripData.locations.splice(locationIndex, 1);
                        return [4 /*yield*/, this.model.findOneAndUpdate({ tripId: tripId }, { $set: { locations: tripData.locations } }, { new: true })];
                    case 2:
                        result = _a.sent();
                        response.json({
                            success: true,
                            message: "Location deleted successfully",
                            remainingLocations: result.locations.length
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        e_7 = _a.sent();
                        console.error('Error deleting location:', e_7);
                        response.status(500).json({
                            error: "Failed to delete location",
                            details: e_7 instanceof Error ? e_7.message : "Unknown error"
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Delete all locations for a specific trip
    LocationModel.prototype.deleteAllLocationsForTrip = function (response, tripId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("Deleting all locations for trip:", tripId);
                        return [4 /*yield*/, this.model.deleteMany({ tripId: tripId })];
                    case 1:
                        result = _a.sent();
                        console.log("All locations deleted for trip:", tripId, "Count:", result.deletedCount);
                        response.json({
                            success: true,
                            message: "All locations deleted for trip ".concat(tripId),
                            deletedCount: result.deletedCount
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        e_8 = _a.sent();
                        console.error('Error deleting all locations for trip:', e_8);
                        response.status(500).json({
                            error: "Failed to delete locations for trip",
                            details: e_8 instanceof Error ? e_8.message : "Unknown error"
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Helper method that doesn't send response - for use in composite operations
    LocationModel.prototype.deleteAllLocationsForTripNoResponse = function (tripId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("Deleting all locations for trip:", tripId);
                        return [4 /*yield*/, this.model.deleteMany({ tripId: tripId })];
                    case 1:
                        result = _a.sent();
                        console.log("All locations deleted for trip:", tripId, "Count:", result.deletedCount);
                        return [2 /*return*/, {
                                success: true,
                                message: "All locations deleted for trip ".concat(tripId),
                                deletedCount: result.deletedCount
                            }];
                    case 2:
                        e_9 = _a.sent();
                        console.error('Error deleting all locations for trip:', e_9);
                        throw e_9;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Migration helper method to convert string addresses to new format
    LocationModel.prototype.migrateStringAddresses = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allLocations, migratedCount, _i, allLocations_1, locationDoc, hasStringAddresses, _a, _b, location_1, stringAddress, e_10;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        console.log('Starting address migration...');
                        return [4 /*yield*/, this.model.find({})];
                    case 1:
                        allLocations = _c.sent();
                        migratedCount = 0;
                        _i = 0, allLocations_1 = allLocations;
                        _c.label = 2;
                    case 2:
                        if (!(_i < allLocations_1.length)) return [3 /*break*/, 5];
                        locationDoc = allLocations_1[_i];
                        hasStringAddresses = false;
                        // Check if any location has a string address
                        for (_a = 0, _b = locationDoc.locations; _a < _b.length; _a++) {
                            location_1 = _b[_a];
                            if (typeof location_1.address === 'string') {
                                hasStringAddresses = true;
                                stringAddress = location_1.address;
                                location_1.address = {
                                    formattedAddress: stringAddress,
                                    city: this.extractCityFromString(stringAddress),
                                    country: this.extractCountryFromString(stringAddress),
                                    // coordinates will be null until geocoded
                                    coordinates: null,
                                    placeId: null,
                                    types: []
                                };
                            }
                        }
                        if (!hasStringAddresses) return [3 /*break*/, 4];
                        return [4 /*yield*/, locationDoc.save()];
                    case 3:
                        _c.sent();
                        migratedCount++;
                        console.log("Migrated addresses for trip: ".concat(locationDoc.tripId));
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        console.log("Migration complete. ".concat(migratedCount, " documents updated."));
                        return [2 /*return*/, { success: true, migratedCount: migratedCount }];
                    case 6:
                        e_10 = _c.sent();
                        console.error('Error during address migration:', e_10);
                        throw e_10;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // Helper method to extract city from string address
    LocationModel.prototype.extractCityFromString = function (address) {
        // Simple heuristic - if it's just a country name, use it as city
        var trimmed = address.trim();
        if (trimmed.length < 50 && !trimmed.includes(',')) {
            return trimmed; // Likely just a country/city name
        }
        // For complex addresses, extract city (this could be enhanced with a geocoding service)
        var parts = trimmed.split(',');
        return parts.length > 1 ? parts[parts.length - 2].trim() : trimmed;
    };
    // Helper method to extract country from string address
    LocationModel.prototype.extractCountryFromString = function (address) {
        var trimmed = address.trim();
        if (trimmed.length < 50 && !trimmed.includes(',')) {
            return trimmed; // Likely just a country name
        }
        // For complex addresses, assume last part is country
        var parts = trimmed.split(',');
        return parts[parts.length - 1].trim();
    };
    // Helper method to normalize address input for API calls
    LocationModel.prototype.normalizeAddressInput = function (addressInput) {
        console.log('Normalizing address input:', addressInput);
        // If it's a string, convert to new format
        if (typeof addressInput === 'string') {
            return {
                formattedAddress: addressInput,
                city: this.extractCityFromString(addressInput),
                country: this.extractCountryFromString(addressInput)
            };
        }
        // If it's already an object, ensure required fields are present
        if (typeof addressInput === 'object' && addressInput !== null) {
            // Handle the case where we have coordinates in a different format
            var coordinates = null;
            if (addressInput.coordinates) {
                coordinates = {
                    latitude: addressInput.coordinates.latitude || addressInput.coordinates.lat || 0,
                    longitude: addressInput.coordinates.longitude || addressInput.coordinates.lng || 0
                };
            }
            var normalizedAddress = {
                formattedAddress: addressInput.formattedAddress || addressInput.formatted_address || '',
                streetNumber: addressInput.streetNumber || '',
                streetName: addressInput.streetName || addressInput.street_address || '',
                city: addressInput.city || this.extractCityFromString(addressInput.formattedAddress || addressInput.formatted_address || ''),
                state: addressInput.state || '',
                country: addressInput.country || this.extractCountryFromString(addressInput.formattedAddress || addressInput.formatted_address || ''),
                postalCode: addressInput.postalCode || addressInput.postal_code || '',
                coordinates: coordinates,
                placeId: addressInput.placeId || addressInput.place_id || '',
                types: addressInput.types || []
            };
            // Ensure required fields have values
            if (!normalizedAddress.city)
                normalizedAddress.city = 'Unknown';
            if (!normalizedAddress.country)
                normalizedAddress.country = 'Unknown';
            console.log('Normalized address:', normalizedAddress);
            return normalizedAddress;
        }
        // If all else fails, return a basic valid address object
        return {
            formattedAddress: '',
            city: 'Unknown',
            country: 'Unknown'
        };
    };
    // Geocode addresses for a specific trip
    LocationModel.prototype.geocodeAddressesForTrip = function (tripId, googleMapsApiKey) {
        return __awaiter(this, void 0, void 0, function () {
            var GoogleMapsService, mapsService, tripData, geocodedCount, _i, _a, location_2, formattedAddress, geocodingResult, error_1;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 9, , 10]);
                        if (!googleMapsApiKey) {
                            throw new Error('Google Maps API key is required for geocoding');
                        }
                        GoogleMapsService = require('../services/GoogleMapsService').GoogleMapsService;
                        mapsService = new GoogleMapsService(googleMapsApiKey);
                        return [4 /*yield*/, this.model.findOne({ tripId: tripId })];
                    case 1:
                        tripData = _f.sent();
                        if (!tripData) {
                            return [2 /*return*/, { success: false, message: 'Trip not found' }];
                        }
                        geocodedCount = 0;
                        _i = 0, _a = tripData.locations;
                        _f.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        location_2 = _a[_i];
                        // Skip if already has coordinates
                        if (((_c = (_b = location_2.address) === null || _b === void 0 ? void 0 : _b.coordinates) === null || _c === void 0 ? void 0 : _c.latitude) && ((_e = (_d = location_2.address) === null || _d === void 0 ? void 0 : _d.coordinates) === null || _e === void 0 ? void 0 : _e.longitude)) {
                            return [3 /*break*/, 5];
                        }
                        formattedAddress = location_2.address.formattedAddress ||
                            "".concat(location_2.address.city, ", ").concat(location_2.address.country);
                        return [4 /*yield*/, mapsService.geocodeAddress(formattedAddress)];
                    case 3:
                        geocodingResult = _f.sent();
                        if (!geocodingResult) return [3 /*break*/, 5];
                        // Update address with geocoding results
                        location_2.address = __assign(__assign({}, location_2.address), geocodingResult);
                        geocodedCount++;
                        // Add a small delay to respect API rate limits
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                    case 4:
                        // Add a small delay to respect API rate limits
                        _f.sent();
                        _f.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6:
                        if (!(geocodedCount > 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, tripData.save()];
                    case 7:
                        _f.sent();
                        _f.label = 8;
                    case 8: return [2 /*return*/, {
                            success: true,
                            message: "Successfully geocoded ".concat(geocodedCount, " locations"),
                            geocodedCount: geocodedCount
                        }];
                    case 9:
                        error_1 = _f.sent();
                        console.error('Error geocoding addresses:', error_1);
                        throw error_1;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    // Get static map URL for a trip
    LocationModel.prototype.getMapUrlForTrip = function (tripId, googleMapsApiKey, width, height) {
        var _this = this;
        if (width === void 0) { width = 600; }
        if (height === void 0) { height = 400; }
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var GoogleMapsService, mapsService, tripData, addresses, mapUrl, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!googleMapsApiKey) {
                            resolve("https://via.placeholder.com/".concat(width, "x").concat(height, "?text=Map+Not+Available"));
                            return [2 /*return*/];
                        }
                        GoogleMapsService = require('../services/GoogleMapsService').GoogleMapsService;
                        mapsService = new GoogleMapsService(googleMapsApiKey);
                        return [4 /*yield*/, this.model.findOne({ tripId: tripId })];
                    case 1:
                        tripData = _a.sent();
                        if (!tripData || !tripData.locations || tripData.locations.length === 0) {
                            resolve("https://via.placeholder.com/".concat(width, "x").concat(height, "?text=No+Locations"));
                            return [2 /*return*/];
                        }
                        addresses = tripData.locations.map(function (loc) { return ({
                            coordinates: loc.address.coordinates,
                            formattedAddress: loc.address.formattedAddress
                        }); });
                        mapUrl = mapsService.getStaticMapUrl(addresses, width, height);
                        resolve(mapUrl);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error generating map URL:', error_2);
                        reject(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return LocationModel;
}());
exports.LocationModel = LocationModel;
//# sourceMappingURL=LocationModel.js.map