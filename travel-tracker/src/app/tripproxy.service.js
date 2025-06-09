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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripproxyService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var TripproxyService = function () {
    var _classDecorators = [(0, core_1.Injectable)({
            providedIn: 'root'
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TripproxyService = _classThis = /** @class */ (function () {
        function TripproxyService_1(httpClient) {
            this.httpClient = httpClient;
            // Allow switching between Azure and local development
            this.azureUrl = 'https://traveltracker2025.azurewebsites.net/';
            this.localUrl = 'http://localhost:8080/';
            this.hostUrl = this.localUrl; // Default to local since it's working
        }
        TripproxyService_1.prototype.getListsIndex = function () {
            console.log('TripproxyService: Getting list index from:', this.hostUrl + 'trip');
            return this.httpClient.get(this.hostUrl + 'trip')
                .pipe((0, operators_1.tap)(function (data) {
                console.log('TripproxyService: Raw response:', data);
                console.log('TripproxyService: Response type:', typeof data);
                console.log('TripproxyService: Is array:', Array.isArray(data));
                console.log('TripproxyService: Response length:', data ? data.length : 'null/undefined');
            }), (0, operators_1.catchError)(function (error) {
                console.error('Error fetching trips from primary endpoint:', error);
                console.error('Error status:', error.status);
                console.error('Error message:', error.message);
                console.error('Error statusText:', error.statusText);
                return (0, rxjs_1.of)([]);
            }));
        };
        // Get individual trip details by ID (works for both public and private trips)
        TripproxyService_1.prototype.getTripById = function (tripId) {
            console.log('TripproxyService: Getting trip details for ID:', tripId);
            var url = this.hostUrl + 'trip/' + tripId;
            console.log('TripproxyService: Request URL:', url);
            return this.httpClient.get(url)
                .pipe((0, operators_1.tap)(function (data) {
                console.log('TripproxyService: Trip details received:', data);
                console.log('TripproxyService: Trip type:', typeof data);
            }), (0, operators_1.catchError)(function (error) {
                console.error('TripproxyService: Error fetching trip details:', error);
                console.error('TripproxyService: Error status:', error.status);
                console.error('TripproxyService: Error message:', error.message);
                return (0, rxjs_1.throwError)(error);
            }));
        };
        TripproxyService_1.prototype.getItems = function (index) {
            var _this = this;
            console.log('TripproxyService: Getting items for tripId:', index);
            console.log('TripproxyService: Full URL:', this.hostUrl + 'trip/' + index + '/locations');
            return this.httpClient.get(this.hostUrl + 'trip/' + index + '/locations')
                .pipe((0, operators_1.tap)(function (data) { return console.log('TripproxyService: Fresh location data received:', data); }), (0, operators_1.catchError)(function (error) {
                console.error('Error fetching trip details from primary endpoint:', error);
                // Try the other endpoint if the first one fails
                if (_this.hostUrl === _this.azureUrl) {
                    console.log('Trying local endpoint instead...');
                    return _this.httpClient.get(_this.localUrl + 'trip/' + index + '/locations')
                        .pipe((0, operators_1.catchError)(function (localError) {
                        console.error('Error fetching trip details from backup endpoint:', localError);
                        return (0, rxjs_1.of)(null);
                    }));
                }
                return (0, rxjs_1.of)(null);
            }));
        };
        // Create a new trip with places
        TripproxyService_1.prototype.createTripWithPlaces = function (tripData) {
            console.log('TripproxyService: Creating trip with places:', tripData);
            return this.httpClient.post(this.hostUrl + 'trip/create-with-places', tripData)
                .pipe((0, operators_1.tap)(function (data) { return console.log('TripproxyService: Trip created successfully:', data); }), (0, operators_1.catchError)(function (error) {
                console.error('Error creating trip with places:', error);
                return (0, rxjs_1.of)({ success: false, error: error.message });
            }));
        };
        // Create a new place for an existing trip
        TripproxyService_1.prototype.createPlaceForTrip = function (placeData) {
            console.log('TripproxyService: Creating place for trip:', placeData);
            var url = this.hostUrl + 'trip/' + placeData.tripId + '/locations/create';
            console.log('TripproxyService: Request URL:', url);
            // Extract the tripId from the data since the backend gets it from URL parameter
            var tripId = placeData.tripId, locationData = __rest(placeData, ["tripId"]);
            console.log('TripproxyService: Request payload (without tripId):', JSON.stringify(locationData, null, 2));
            return this.httpClient.post(url, locationData)
                .pipe((0, operators_1.tap)(function (data) {
                console.log('TripproxyService: Place created successfully:', data);
                console.log('TripproxyService: Response type:', typeof data);
            }), (0, operators_1.catchError)(function (error) {
                console.error('TripproxyService: Error creating place for trip:', error);
                console.error('TripproxyService: Error status:', error.status);
                console.error('TripproxyService: Error statusText:', error.statusText);
                console.error('TripproxyService: Error error:', error.error);
                // Re-throw the error so the component can handle it
                throw error;
            }));
        };
        // Upload photos - convert File objects to Base64 strings for storage
        TripproxyService_1.prototype.uploadPhotos = function (photos) {
            if (!photos || photos.length === 0) {
                return (0, rxjs_1.of)([]);
            }
            // Convert File objects to Base64 strings
            var photoPromises = photos.map(function (file) {
                return new Promise(function (resolve, reject) {
                    var reader = new FileReader();
                    reader.onload = function () {
                        if (reader.result) {
                            resolve(reader.result);
                        }
                        else {
                            reject(new Error('Failed to read file'));
                        }
                    };
                    reader.onerror = function () { return reject(new Error('Error reading file')); };
                    reader.readAsDataURL(file);
                });
            });
            return new rxjs_1.Observable(function (observer) {
                Promise.all(photoPromises)
                    .then(function (base64Strings) {
                    console.log('TripproxyService: Photos converted to Base64 successfully');
                    observer.next(base64Strings);
                    observer.complete();
                })
                    .catch(function (error) {
                    console.error('TripproxyService: Error converting photos:', error);
                    observer.error(error);
                });
            });
        };
        // Upload single photo (placeholder for future implementation)
        TripproxyService_1.prototype.uploadPhoto = function (photo) {
            // This would typically use FormData and a file upload endpoint
            // For now, return a mock implementation
            console.log('TripproxyService: Photo upload requested for:', photo.name);
            return (0, rxjs_1.of)({ success: true, photoUrl: 'mock-photo-url' });
        };
        // Delete a location from a trip
        TripproxyService_1.prototype.deleteLocation = function (tripId, locationIndex) {
            console.log('TripproxyService: Deleting location at index', locationIndex, 'from trip:', tripId);
            var url = this.hostUrl + 'trip/' + tripId + '/locations/' + locationIndex;
            console.log('TripproxyService: DELETE URL:', url);
            return this.httpClient.delete(url)
                .pipe((0, operators_1.tap)(function (data) {
                console.log('TripproxyService: Location deleted successfully:', data);
            }), (0, operators_1.catchError)(function (error) {
                console.error('TripproxyService: Error deleting location:', error);
                console.error('TripproxyService: Error status:', error.status);
                console.error('TripproxyService: Error statusText:', error.statusText);
                console.error('TripproxyService: Error error:', error.error);
                // Re-throw the error so the component can handle it
                throw error;
            }));
        };
        // Delete an entire trip along with all its locations
        TripproxyService_1.prototype.deleteTrip = function (tripId) {
            console.log('TripproxyService: Deleting entire trip:', tripId);
            var url = this.hostUrl + 'trip/' + tripId;
            console.log('TripproxyService: DELETE URL:', url);
            return this.httpClient.delete(url)
                .pipe((0, operators_1.tap)(function (data) {
                console.log('TripproxyService: Trip deleted successfully:', data);
            }), (0, operators_1.catchError)(function (error) {
                console.error('TripproxyService: Error deleting trip:', error);
                console.error('TripproxyService: Error status:', error.status);
                console.error('TripproxyService: Error statusText:', error.statusText);
                console.error('TripproxyService: Error error:', error.error);
                // Re-throw the error so the component can handle it
                throw error;
            }));
        };
        // Add photos to an existing place
        TripproxyService_1.prototype.addPhotosToPlace = function (tripId, placeIndex, photos) {
            var _this = this;
            console.log('TripproxyService: Adding photos to place:', { tripId: tripId, placeIndex: placeIndex, photoCount: photos.length });
            // Get the current place data first
            return this.getItems(tripId).pipe((0, operators_1.switchMap)(function (tripData) {
                console.log('TripproxyService: Raw tripData received:', tripData);
                // Extract the current place data - handle different data structures
                var locations;
                if (tripData && tripData.locations) {
                    locations = tripData.locations;
                }
                else if (Array.isArray(tripData)) {
                    locations = tripData;
                }
                else {
                    console.error('TripproxyService: Unexpected data structure:', tripData);
                    return (0, rxjs_1.throwError)(function () { return new Error('Invalid trip data structure'); });
                }
                if (!locations || !Array.isArray(locations) || !locations[placeIndex]) {
                    console.error('TripproxyService: Place not found at index:', placeIndex, 'in locations:', locations);
                    return (0, rxjs_1.throwError)(function () { return new Error('Place not found'); });
                }
                var currentPlace = locations[placeIndex];
                var existingPhotos = currentPlace.photos || [];
                var updatedPhotos = __spreadArray(__spreadArray([], existingPhotos, true), photos, true);
                console.log('TripproxyService: Current place:', currentPlace);
                console.log('TripproxyService: Existing photos:', existingPhotos.length);
                console.log('TripproxyService: Adding photos:', photos.length);
                // Try to use a direct update endpoint if available
                var updatePayload = {
                    photos: updatedPhotos
                };
                console.log('TripproxyService: Attempting direct photo update with payload:', updatePayload);
                // First try to update photos directly
                return _this.httpClient.put("".concat(_this.hostUrl, "trip/").concat(tripId, "/locations/").concat(placeIndex, "/photos"), updatePayload)
                    .pipe((0, operators_1.tap)(function (data) {
                    console.log('TripproxyService: Photos updated successfully via direct endpoint:', data);
                }), (0, operators_1.catchError)(function (updateError) {
                    console.log('TripproxyService: Direct update failed, falling back to replace method:', updateError);
                    // Fallback: Replace the entire location
                    var locationData = {
                        name: currentPlace.name,
                        address: currentPlace.address || '',
                        description: currentPlace.description || '',
                        startDate: currentPlace.startDate,
                        endDate: currentPlace.endDate,
                        notes: currentPlace.notes || '',
                        photos: updatedPhotos,
                        cost: currentPlace.cost || 0
                    };
                    console.log('TripproxyService: Replacing location with data:', locationData);
                    // Use PUT to replace the location (safer than delete+create)
                    return _this.httpClient.put("".concat(_this.hostUrl, "trip/").concat(tripId, "/locations/").concat(placeIndex), locationData)
                        .pipe((0, operators_1.tap)(function (data) {
                        console.log('TripproxyService: Location replaced successfully:', data);
                    }), (0, operators_1.catchError)(function (replaceError) {
                        console.error('TripproxyService: Failed to replace location:', replaceError);
                        // Last resort: delete and recreate (original logic but with better error handling)
                        return _this.httpClient.delete("".concat(_this.hostUrl, "trip/").concat(tripId, "/locations/").concat(placeIndex))
                            .pipe((0, operators_1.switchMap)(function () {
                            var createData = __assign({ tripId: tripId }, locationData);
                            return _this.httpClient.post("".concat(_this.hostUrl, "trip/").concat(tripId, "/locations/create"), createData);
                        }), (0, operators_1.tap)(function (data) {
                            console.log('TripproxyService: Location recreated successfully:', data);
                        }), (0, operators_1.catchError)(function (recreateError) {
                            console.error('TripproxyService: Failed to recreate location:', recreateError);
                            return (0, rxjs_1.throwError)(function () { return recreateError; });
                        }));
                    }));
                }));
            }), (0, operators_1.catchError)(function (error) {
                console.error('TripproxyService: Error in addPhotosToPlace:', error);
                return (0, rxjs_1.throwError)(function () { return error; });
            }));
        };
        // Search public trips by name
        TripproxyService_1.prototype.searchPublicTrips = function (searchQuery) {
            console.log('TripproxyService: Searching public trips with query:', searchQuery);
            var url = "".concat(this.hostUrl, "trip/search?q=").concat(encodeURIComponent(searchQuery));
            console.log('TripproxyService: Search URL:', url);
            return this.httpClient.get(url)
                .pipe((0, operators_1.tap)(function (data) {
                console.log('TripproxyService: Search results received:', data);
                console.log('TripproxyService: Number of results:', data ? data.length : 0);
            }), (0, operators_1.catchError)(function (error) {
                console.error('TripproxyService: Error searching trips:', error);
                console.error('TripproxyService: Error status:', error.status);
                console.error('TripproxyService: Error message:', error.message);
                return (0, rxjs_1.of)([]);
            }));
        };
        return TripproxyService_1;
    }());
    __setFunctionName(_classThis, "TripproxyService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TripproxyService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TripproxyService = _classThis;
}();
exports.TripproxyService = TripproxyService;
//# sourceMappingURL=tripproxy.service.js.map