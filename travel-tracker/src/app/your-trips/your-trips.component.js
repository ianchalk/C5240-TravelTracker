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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YourTripsComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var http_1 = require("@angular/common/http");
var YourTripsComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-your-trips',
            standalone: true,
            imports: [common_1.CommonModule, http_1.HttpClientModule],
            templateUrl: './your-trips.component.html',
            styleUrls: ['./your-trips.component.css']
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var YourTripsComponent = _classThis = /** @class */ (function () {
        function YourTripsComponent_1(router, tripProxy, http, authService) {
            this.router = router;
            this.tripProxy = tripProxy;
            this.http = http;
            this.authService = authService;
            // Will hold user's trips from MongoDB
            this.trips = [];
            this.publicTrips = [];
            this.privateTrips = [];
            this.loading = true;
            this.error = false;
            this.totalAmountSpent = 0;
            this.visitedCountries = new Set();
            // Authentication properties
            this.isAuthenticated = false;
            this.currentUser = null;
            this.authSubscriptions = [];
        }
        YourTripsComponent_1.prototype.ngOnInit = function () {
            var _this = this;
            console.log("YourTripsComponent initialized!");
            // Subscribe to authentication status
            var authSub = this.authService.isAuthenticated$.subscribe(function (isAuth) {
                _this.isAuthenticated = isAuth;
                console.log('Authentication status updated in YourTripsComponent:', isAuth);
                if (isAuth) {
                    _this.fetchUserTrips();
                }
                else {
                    // Redirect to login or show message if not authenticated
                    _this.router.navigate(['/']);
                }
            });
            this.authSubscriptions.push(authSub);
            var userSub = this.authService.currentUser$.subscribe(function (user) {
                _this.currentUser = user;
                console.log('Current user updated in YourTripsComponent:', user);
                if (user) {
                    _this.fetchUserTrips();
                }
            });
            this.authSubscriptions.push(userSub);
        };
        YourTripsComponent_1.prototype.ngOnDestroy = function () {
            // Clean up subscriptions
            this.authSubscriptions.forEach(function (sub) { return sub.unsubscribe(); });
        };
        YourTripsComponent_1.prototype.fetchUserTrips = function () {
            var _this = this;
            if (!this.currentUser || !this.currentUser._id) {
                console.log('No authenticated user available');
                this.loading = false;
                this.error = true;
                return;
            }
            this.loading = true;
            this.error = false;
            this.totalAmountSpent = 0;
            this.visitedCountries.clear();
            console.log("=== FETCHING USER TRIPS ===");
            console.log("Current user ID:", this.currentUser._id);
            // Call the new user-specific endpoint
            this.http.get("http://localhost:8080/trip/user/".concat(this.currentUser._id)).subscribe({
                next: function (result) {
                    console.log("=== USER TRIPS SUCCESS ===");
                    console.log("User trips response:", result);
                    _this.processTripsData(result);
                },
                error: function (err) {
                    console.log("=== USER TRIPS ERROR ===");
                    console.error("Error fetching user trips:", err);
                    _this.trips = [];
                    _this.publicTrips = [];
                    _this.privateTrips = [];
                    _this.loading = false;
                    _this.error = true;
                }
            });
        };
        YourTripsComponent_1.prototype.processTripsData = function (result) {
            return __awaiter(this, void 0, void 0, function () {
                var processedTrips;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(result && result.length > 0)) return [3 /*break*/, 3];
                            console.log("Processing user trips data:", result);
                            return [4 /*yield*/, Promise.all(result.map(function (trip) { return __awaiter(_this, void 0, void 0, function () {
                                    var randomImage;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                // Calculate total amount spent
                                                if (trip.amount_spent && !isNaN(parseFloat(trip.amount_spent))) {
                                                    this.totalAmountSpent += parseFloat(trip.amount_spent);
                                                }
                                                // Add country to visited countries set
                                                if (trip.country) {
                                                    this.visitedCountries.add(trip.country.toLowerCase());
                                                }
                                                return [4 /*yield*/, this.getRandomImageFromTrip(trip.tripId || trip._id || trip.id)];
                                            case 1:
                                                randomImage = _a.sent();
                                                // Map MongoDB trips to the format our UI expects
                                                return [2 /*return*/, __assign({ id: trip._id || trip.tripId || trip.id || '', tripId: trip.tripId || trip._id || trip.id || '', name: trip.name || 'Unnamed Trip', location: trip.location || trip.description || 'Unknown Location', image: randomImage || 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', amount_spent: trip.amount_spent || 0, country: trip.country || 'Unknown', isPublic: trip.isPublic || false, userId: trip.userId || '' }, trip)];
                                        }
                                    });
                                }); }))];
                        case 1:
                            processedTrips = _a.sent();
                            this.trips = processedTrips;
                            // Separate public and private trips
                            this.publicTrips = this.trips.filter(function (trip) { return trip.isPublic; });
                            this.privateTrips = this.trips.filter(function (trip) { return !trip.isPublic; });
                            console.log("Processed trips:", this.trips);
                            console.log("Public trips:", this.publicTrips);
                            console.log("Private trips:", this.privateTrips);
                            // Calculate and update trip costs from places
                            return [4 /*yield*/, this.calculateTripsCostFromPlaces(this.trips)];
                        case 2:
                            // Calculate and update trip costs from places
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            console.log("No trips found for user");
                            this.trips = [];
                            this.publicTrips = [];
                            this.privateTrips = [];
                            _a.label = 4;
                        case 4:
                            this.loading = false;
                            this.error = false;
                            return [2 /*return*/];
                    }
                });
            });
        };
        YourTripsComponent_1.prototype.getRandomImageFromTrip = function (tripId) {
            return __awaiter(this, void 0, void 0, function () {
                var tripData, allPhotos_1, randomIndex, selectedPhoto, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            console.log("Getting random image for trip: ".concat(tripId));
                            if (!tripId) {
                                console.log('No tripId provided, returning null');
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, this.tripProxy.getItems(tripId).toPromise()];
                        case 1:
                            tripData = _a.sent();
                            if (!tripData || !tripData.locations || tripData.locations.length === 0) {
                                console.log("No locations found for trip ".concat(tripId));
                                return [2 /*return*/, null];
                            }
                            console.log("Found ".concat(tripData.locations.length, " locations for trip ").concat(tripId));
                            allPhotos_1 = [];
                            tripData.locations.forEach(function (location, index) {
                                if (location.photos && Array.isArray(location.photos) && location.photos.length > 0) {
                                    console.log("Location ".concat(index, " (").concat(location.name, ") has ").concat(location.photos.length, " photos"));
                                    // Add all photos from this location to our collection
                                    allPhotos_1.push.apply(allPhotos_1, location.photos);
                                }
                                else {
                                    console.log("Location ".concat(index, " (").concat(location.name, ") has no photos"));
                                }
                            });
                            if (allPhotos_1.length === 0) {
                                console.log("No photos found in any location for trip ".concat(tripId));
                                return [2 /*return*/, null];
                            }
                            randomIndex = Math.floor(Math.random() * allPhotos_1.length);
                            selectedPhoto = allPhotos_1[randomIndex];
                            console.log("Selected random photo ".concat(randomIndex + 1, " of ").concat(allPhotos_1.length, " for trip ").concat(tripId));
                            return [2 /*return*/, selectedPhoto];
                        case 2:
                            error_1 = _a.sent();
                            console.error("Error getting random image for trip ".concat(tripId, ":"), error_1);
                            return [2 /*return*/, null];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        YourTripsComponent_1.prototype.goToTripDetail = function (trip) {
            console.log("Navigating to trip:", trip);
            var tripId = trip.tripId || trip.id;
            // Navigate with source parameter to indicate this is from personal trips (editable)
            this.router.navigate(['/tripdetail', tripId], {
                queryParams: { source: 'personal' }
            });
        };
        YourTripsComponent_1.prototype.goToAddTrip = function () {
            this.router.navigate(['/add-trips']);
        };
        YourTripsComponent_1.prototype.goToPublicTrips = function () {
            this.router.navigate(['/trips']);
        };
        YourTripsComponent_1.prototype.toggleTripPrivacy = function (trip) {
            var _this = this;
            console.log("Toggle privacy for trip:", trip);
            if (!this.currentUser) {
                console.error("No authenticated user found");
                return;
            }
            var newPrivacyStatus = !trip.isPublic;
            var tripId = trip.tripId || trip.id;
            // Call the backend API to update privacy
            var updateData = {
                isPublic: newPrivacyStatus,
                userId: this.currentUser._id // Include userId for security check
            };
            this.http.patch("http://localhost:8080/trip/".concat(tripId, "/privacy"), updateData).subscribe({
                next: function (response) {
                    console.log("Privacy updated successfully:", response);
                    // Update local state only if backend update was successful
                    trip.isPublic = newPrivacyStatus;
                    // Re-categorize trips
                    _this.publicTrips = _this.trips.filter(function (t) { return t.isPublic; });
                    _this.privateTrips = _this.trips.filter(function (t) { return !t.isPublic; });
                    // Show success message (optional)
                    alert("Trip \"".concat(trip.name, "\" is now ").concat(newPrivacyStatus ? 'public' : 'private'));
                },
                error: function (err) {
                    console.error("Error updating trip privacy:", err);
                    alert("Failed to update trip privacy. Please try again.");
                }
            });
        };
        YourTripsComponent_1.prototype.deleteTrip = function (trip) {
            var _this = this;
            if (confirm("Are you sure you want to delete the trip \"".concat(trip.name, "\"? This action cannot be undone."))) {
                console.log("Delete trip:", trip);
                if (!this.currentUser) {
                    console.error("No authenticated user found");
                    return;
                }
                var tripId = trip.tripId || trip.id;
                // Call the backend API to delete the trip
                this.http.delete("http://localhost:8080/trip/".concat(tripId)).subscribe({
                    next: function (response) {
                        console.log("Trip deleted successfully:", response);
                        // Remove from local state only if backend deletion was successful
                        _this.trips = _this.trips.filter(function (t) { return t.id !== trip.id && t.tripId !== trip.tripId; });
                        _this.publicTrips = _this.trips.filter(function (t) { return t.isPublic; });
                        _this.privateTrips = _this.trips.filter(function (t) { return !t.isPublic; });
                        // Recalculate statistics
                        _this.recalculateStatistics();
                        // Show success message
                        alert("Trip \"".concat(trip.name, "\" has been deleted successfully."));
                    },
                    error: function (err) {
                        console.error("Error deleting trip:", err);
                        alert("Failed to delete trip. Please try again.");
                    }
                });
            }
        };
        YourTripsComponent_1.prototype.recalculateStatistics = function () {
            // Recalculate total amount spent
            this.totalAmountSpent = 0;
            this.visitedCountries.clear();
            for (var _i = 0, _a = this.trips; _i < _a.length; _i++) {
                var trip = _a[_i];
                if (trip.amount_spent && !isNaN(parseFloat(trip.amount_spent.toString()))) {
                    this.totalAmountSpent += parseFloat(trip.amount_spent.toString());
                }
                if (trip.country) {
                    this.visitedCountries.add(trip.country.toLowerCase());
                }
            }
        };
        // Method to calculate actual cost from places for a trip
        YourTripsComponent_1.prototype.calculateTripCostFromPlaces = function (tripId) {
            return __awaiter(this, void 0, void 0, function () {
                var locationData, totalCost, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            console.log('Calculating cost from places for trip:', tripId);
                            return [4 /*yield*/, this.tripProxy.getItems(tripId).toPromise()];
                        case 1:
                            locationData = _a.sent();
                            if (!locationData || !locationData.locations || !Array.isArray(locationData.locations)) {
                                console.log('No locations found for trip:', tripId);
                                return [2 /*return*/, 0];
                            }
                            totalCost = locationData.locations
                                .filter(function (place) { return place.cost && place.cost > 0; })
                                .reduce(function (sum, place) { return sum + (place.cost || 0); }, 0);
                            console.log("Trip ".concat(tripId, " calculated cost from places: ").concat(totalCost));
                            return [2 /*return*/, totalCost];
                        case 2:
                            error_2 = _a.sent();
                            console.error('Error calculating trip cost from places:', error_2);
                            return [2 /*return*/, 0];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // Method to calculate costs from places for all trips
        YourTripsComponent_1.prototype.calculateTripsCostFromPlaces = function (trips) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, trips_1, trip, tripId, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log('Calculating costs from places for all trips...');
                            _i = 0, trips_1 = trips;
                            _b.label = 1;
                        case 1:
                            if (!(_i < trips_1.length)) return [3 /*break*/, 4];
                            trip = trips_1[_i];
                            tripId = trip.tripId || trip.id;
                            if (!tripId) return [3 /*break*/, 3];
                            _a = trip;
                            return [4 /*yield*/, this.calculateTripCostFromPlaces(tripId)];
                        case 2:
                            _a.calculatedCost = _b.sent();
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            // Recalculate total amount spent using the new calculated costs
                            this.recalculateStatisticsWithCalculatedCosts();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // Updated method to recalculate statistics using calculated costs instead of amount_spent
        YourTripsComponent_1.prototype.recalculateStatisticsWithCalculatedCosts = function () {
            this.totalAmountSpent = 0;
            this.visitedCountries.clear();
            for (var _i = 0, _a = this.trips; _i < _a.length; _i++) {
                var trip = _a[_i];
                // Use calculated cost instead of amount_spent
                var tripCost = this.getTripDisplayCost(trip);
                if (tripCost && !isNaN(tripCost)) {
                    this.totalAmountSpent += tripCost;
                }
                if (trip.country) {
                    this.visitedCountries.add(trip.country.toLowerCase());
                }
            }
            console.log('Updated total amount spent with calculated costs:', this.totalAmountSpent);
        };
        // Method to get the display cost for a trip (calculated cost or fallback to amount_spent)
        YourTripsComponent_1.prototype.getTripDisplayCost = function (trip) {
            return trip.calculatedCost !== undefined ? trip.calculatedCost : trip.amount_spent || 0;
        };
        return YourTripsComponent_1;
    }());
    __setFunctionName(_classThis, "YourTripsComponent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        YourTripsComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return YourTripsComponent = _classThis;
}();
exports.YourTripsComponent = YourTripsComponent;
//# sourceMappingURL=your-trips.component.js.map