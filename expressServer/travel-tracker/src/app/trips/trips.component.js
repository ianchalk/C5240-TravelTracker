"use strict";
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
exports.TripsComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/common/http");
var TripsComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-trips',
            standalone: true,
            imports: [common_1.CommonModule, http_1.HttpClientModule, forms_1.FormsModule],
            templateUrl: './trips.component.html',
            styleUrls: ['./trips.component.css']
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TripsComponent = _classThis = /** @class */ (function () {
        function TripsComponent_1(router, route, tripProxy, http, authService) {
            this.router = router;
            this.route = route;
            this.tripProxy = tripProxy;
            this.http = http;
            this.authService = authService;
            // Will hold trips from MongoDB
            this.trips = [];
            this.allTrips = []; // Store all trips for search filtering
            this.loading = true;
            this.error = false;
            this.totalAmountSpent = 0;
            this.visitedCountries = new Set();
            // Search properties
            this.searchQuery = '';
            this.isSearching = false;
            // Authentication properties
            this.isAuthenticated = false;
            this.currentUser = null;
            this.authSubscriptions = [];
        }
        TripsComponent_1.prototype.ngOnInit = function () {
            var _this = this;
            console.log("TripsComponent initialized!");
            console.log("Current environment:", window.location.origin);
            console.log("Backend URL:", this.tripProxy);
            // Subscribe to authentication status
            var authSub = this.authService.isAuthenticated$.subscribe(function (isAuth) {
                _this.isAuthenticated = isAuth;
                console.log('Authentication status updated in TripsComponent:', isAuth);
            });
            this.authSubscriptions.push(authSub);
            var userSub = this.authService.currentUser$.subscribe(function (user) {
                _this.currentUser = user;
                console.log('Current user updated in TripsComponent:', user);
            });
            this.authSubscriptions.push(userSub);
            // Check for search query from URL parameters
            this.route.queryParams.subscribe(function (params) {
                if (params['search']) {
                    _this.searchQuery = params['search'];
                    console.log('Search query from URL:', _this.searchQuery);
                }
            });
            this.fetchTrips();
        };
        TripsComponent_1.prototype.ngOnDestroy = function () {
            // Clean up subscriptions
            this.authSubscriptions.forEach(function (sub) { return sub.unsubscribe(); });
        };
        TripsComponent_1.prototype.fetchTrips = function () {
            var _this = this;
            this.loading = true;
            this.error = false;
            this.totalAmountSpent = 0; // Reset total amount
            this.visitedCountries.clear(); // Reset countries set
            console.log("=== STARTING fetchTrips (PUBLIC ONLY) ===");
            // Now we only fetch PUBLIC trips via the modified backend endpoint
            // The backend TripModel.retrieveAllTrips() now filters by isPublic: true
            this.tripProxy.getListsIndex().subscribe({
                next: function (result) {
                    console.log("=== TripProxy SUCCESS (PUBLIC TRIPS) ===");
                    console.log("Public trips response received:", result);
                    console.log("Result type:", typeof result);
                    console.log("Result is array:", Array.isArray(result));
                    console.log("Result length:", result ? result.length : 'null/undefined');
                    _this.processTripsData(result);
                },
                error: function (err) {
                    console.log("=== TripProxy ERROR ===");
                    console.error("Error fetching public trips:", err);
                    console.error("Error details:", err.message || err.toString());
                    console.error("Error status:", err.status);
                    console.error("Error statusText:", err.statusText);
                    console.error("Full error object:", err);
                    // Try direct HTTP call as fallback
                    console.log("=== TRYING DIRECT HTTP FALLBACK ===");
                    _this.http.get('http://localhost:8080/trip').subscribe({
                        next: function (directResult) {
                            console.log("=== DIRECT HTTP SUCCESS (PUBLIC TRIPS) ===");
                            console.log("Direct HTTP call success:", directResult);
                            _this.processTripsData(directResult);
                        },
                        error: function (directError) {
                            console.log("=== DIRECT HTTP ERROR ===");
                            console.error("Direct HTTP call also failed:", directError);
                            console.error("Direct error status:", directError.status);
                            console.error("Direct error statusText:", directError.statusText);
                            _this.trips = [];
                            _this.loading = false;
                            _this.error = true;
                        }
                    });
                }
            });
        };
        TripsComponent_1.prototype.processTripsData = function (result) {
            return __awaiter(this, void 0, void 0, function () {
                var processedTrips;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(result && result.length > 0)) return [3 /*break*/, 2];
                            console.log("Processing trips data:", result);
                            return [4 /*yield*/, Promise.all(result.map(function (trip) { return __awaiter(_this, void 0, void 0, function () {
                                    var randomImage;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                // Calculate total amount spent
                                                if (trip.amount_spent && !isNaN(parseFloat(trip.amount_spent))) {
                                                    this.totalAmountSpent += parseFloat(trip.amount_spent);
                                                }
                                                // Add country to visited countries set (converted to lowercase)
                                                if (trip.country) {
                                                    this.visitedCountries.add(trip.country.toLowerCase());
                                                }
                                                return [4 /*yield*/, this.getRandomImageFromTrip(trip.tripId || trip._id || trip.id)];
                                            case 1:
                                                randomImage = _a.sent();
                                                // Map MongoDB trips to the format our UI expects
                                                return [2 /*return*/, {
                                                        id: trip._id || trip.tripId || trip.id || '',
                                                        tripId: trip.tripId || trip._id || trip.id || '', // Keep track of the actual tripId
                                                        name: trip.name || 'Unnamed Trip',
                                                        location: trip.location || trip.description || 'Unknown Location',
                                                        image: randomImage || 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
                                                        amount_spent: trip.amount_spent || 0,
                                                        country: trip.country || '',
                                                        userId: trip.userId // Include user data if populated
                                                    }];
                                        }
                                    });
                                }); }))];
                        case 1:
                            processedTrips = _a.sent();
                            this.allTrips = processedTrips; // Store all trips
                            this.trips = processedTrips; // Initially show all trips
                            // If there's a search query from URL, apply it
                            if (this.searchQuery) {
                                this.performSearch();
                            }
                            console.log("Successfully processed trips:", this.trips);
                            console.log("Total amount spent:", this.totalAmountSpent);
                            console.log("Total countries visited:", this.visitedCountries.size);
                            return [3 /*break*/, 3];
                        case 2:
                            // No data returned
                            console.log("No trips found in response.");
                            this.allTrips = [];
                            this.trips = [];
                            this.error = true;
                            _a.label = 3;
                        case 3:
                            this.loading = false;
                            return [2 /*return*/];
                    }
                });
            });
        };
        // Search Methods
        TripsComponent_1.prototype.onSearchInput = function () {
            // Debounce search as user types
            if (this.searchQuery.trim() === '') {
                this.clearSearch();
            }
        };
        TripsComponent_1.prototype.performSearch = function () {
            var _this = this;
            if (!this.searchQuery || this.searchQuery.trim() === '') {
                this.trips = this.allTrips;
                return;
            }
            this.isSearching = true;
            var query = this.searchQuery.toLowerCase().trim();
            // First try to search via backend API
            this.tripProxy.searchPublicTrips(query).subscribe({
                next: function (result) {
                    console.log('Backend search result:', result);
                    if (result && result.length > 0) {
                        _this.processSearchResults(result);
                    }
                    else {
                        // If no backend results, fallback to client-side filtering
                        _this.performClientSideSearch(query);
                    }
                    _this.isSearching = false;
                },
                error: function (err) {
                    console.error('Backend search error:', err);
                    // Fallback to client-side search
                    _this.performClientSideSearch(query);
                    _this.isSearching = false;
                }
            });
        };
        TripsComponent_1.prototype.performClientSideSearch = function (query) {
            console.log('Performing client-side search for:', query);
            this.trips = this.allTrips.filter(function (trip) {
                return trip.name.toLowerCase().includes(query) ||
                    trip.location.toLowerCase().includes(query);
            });
            console.log('Filtered trips:', this.trips.length);
        };
        TripsComponent_1.prototype.processSearchResults = function (result) {
            return __awaiter(this, void 0, void 0, function () {
                var processedTrips;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(result && result.length > 0)) return [3 /*break*/, 2];
                            return [4 /*yield*/, Promise.all(result.map(function (trip) { return __awaiter(_this, void 0, void 0, function () {
                                    var randomImage;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.getRandomImageFromTrip(trip.tripId || trip._id || trip.id)];
                                            case 1:
                                                randomImage = _a.sent();
                                                return [2 /*return*/, {
                                                        id: trip._id || trip.tripId || trip.id || '',
                                                        tripId: trip.tripId || trip._id || trip.id || '',
                                                        name: trip.name || 'Unnamed Trip',
                                                        location: trip.location || trip.description || 'Unknown Location',
                                                        image: randomImage || 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
                                                        amount_spent: trip.amount_spent || 0,
                                                        country: trip.country || '',
                                                        userId: trip.userId // Include user data if populated
                                                    }];
                                        }
                                    });
                                }); }))];
                        case 1:
                            processedTrips = _a.sent();
                            this.trips = processedTrips;
                            console.log("Search results processed:", this.trips.length);
                            return [3 /*break*/, 3];
                        case 2:
                            this.trips = [];
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        TripsComponent_1.prototype.clearSearch = function () {
            this.searchQuery = '';
            this.trips = this.allTrips;
            this.isSearching = false;
            // Update URL to remove search parameter
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {},
                replaceUrl: true
            });
        };
        TripsComponent_1.prototype.viewTripDetail = function (index) {
            // Use tripId (not the MongoDB _id) for navigation since the backend expects tripId for locations
            if (this.trips && this.trips.length > index) {
                var trip = this.trips[index];
                var navigationId = trip.tripId || trip.id; // Prefer tripId over id
                console.log("Navigating to trip detail for index ".concat(index));
                console.log("Trip data:", trip);
                console.log("Using navigation ID: ".concat(navigationId));
                // Navigate with source parameter to indicate this is from public trips (read-only)
                this.router.navigate(['/tripdetail', navigationId], {
                    queryParams: { source: 'public' }
                });
            }
        };
        TripsComponent_1.prototype.goToAddTrip = function () {
            if (!this.isAuthenticated) {
                console.log('User not authenticated, redirecting to login');
                alert('Please sign in to add a new trip.');
                // Optionally redirect to login or show a login modal
                return;
            }
            console.log('Navigating to add trip page');
            this.router.navigate(['/add-trips']);
        };
        TripsComponent_1.prototype.goToYourTrips = function () {
            this.router.navigate(['/your-trips']);
        };
        // Add a manual test method
        TripsComponent_1.prototype.testApiDirect = function () {
            console.log("Testing direct API call...");
            this.http.get('http://localhost:8080/trip').subscribe({
                next: function (result) {
                    console.log("Direct API test SUCCESS:", result);
                    alert("Direct API test successful! Got " + result.length + " trips");
                },
                error: function (err) {
                    console.error("Direct API test FAILED:", err);
                    alert("Direct API test failed: " + err.message);
                }
            });
        };
        // Get random image from trip locations
        TripsComponent_1.prototype.getRandomImageFromTrip = function (tripId) {
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
        return TripsComponent_1;
    }());
    __setFunctionName(_classThis, "TripsComponent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TripsComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TripsComponent = _classThis;
}();
exports.TripsComponent = TripsComponent;
//# sourceMappingURL=trips.component.js.map