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
exports.WelcomepageComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var header_component_1 = require("../shared/header/header.component");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var interactive_map_component_1 = require("../components/interactive-map/interactive-map.component");
var environment_1 = require("../../environments/environment");
var WelcomepageComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-welcomepage',
            standalone: true,
            imports: [common_1.CommonModule, header_component_1.HeaderComponent, router_1.RouterModule, forms_1.FormsModule, interactive_map_component_1.InteractiveMapComponent],
            templateUrl: './welcomepage.component.html',
            styleUrls: ['./welcomepage.component.css']
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var WelcomepageComponent = _classThis = /** @class */ (function () {
        function WelcomepageComponent_1(authService, router, route, tripProxy) {
            this.authService = authService;
            this.router = router;
            this.route = route;
            this.tripProxy = tripProxy;
            this.isAuthenticated = false;
            this.currentUser = null;
            this.searchQuery = '';
            this.subscriptions = [];
            // Map-related properties
            this.allPublicPlaces = [];
            this.isLoadingMapData = false;
            this.mapError = '';
            this.googleMapsApiKey = environment_1.environment.googleMapsApiKey;
            // Top Places properties
            this.topPlaces = [];
            this.isLoadingTopPlaces = false;
            this.topPlacesError = '';
        }
        WelcomepageComponent_1.prototype.ngOnInit = function () {
            var _this = this;
            // Refresh authentication status when component loads
            this.authService.checkAuthStatus().subscribe();
            // Subscribe to authentication status
            var authSub = this.authService.isAuthenticated$.subscribe(function (isAuth) { return _this.isAuthenticated = isAuth; });
            // Subscribe to current user
            var userSub = this.authService.currentUser$.subscribe(function (user) { return _this.currentUser = user; });
            this.subscriptions.push(authSub, userSub);
            // Check if we should focus on the search input
            this.route.queryParams.subscribe(function (params) {
                if (params['focus'] === 'search') {
                    setTimeout(function () {
                        var searchInput = document.querySelector('input[placeholder*="Search"]');
                        if (searchInput) {
                            searchInput.focus();
                        }
                    }, 100);
                }
            });
            // Load public places for the map
            this.loadPublicPlacesForMap();
            // Load top places for the section
            this.loadTopPlaces();
        };
        WelcomepageComponent_1.prototype.ngOnDestroy = function () {
            this.subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
        };
        WelcomepageComponent_1.prototype.loginWithGoogle = function () {
            this.authService.loginWithGoogle();
        };
        WelcomepageComponent_1.prototype.onSearch = function () {
            if (this.searchQuery.trim()) {
                console.log('Searching for:', this.searchQuery);
                this.router.navigate(['/trips'], {
                    queryParams: { search: this.searchQuery.trim() }
                });
            }
        };
        WelcomepageComponent_1.prototype.onSearchKeyPress = function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.onSearch();
            }
        };
        WelcomepageComponent_1.prototype.loadPublicPlacesForMap = function () {
            var _this = this;
            this.isLoadingMapData = true;
            this.mapError = '';
            this.tripProxy.getListsIndex().subscribe({
                next: function (trips) {
                    console.log('Loaded public trips for map:', trips);
                    _this.extractPlacesFromTrips(trips);
                },
                error: function (error) {
                    console.error('Error loading public trips for map:', error);
                    _this.mapError = 'Failed to load map data';
                    _this.isLoadingMapData = false;
                }
            });
        };
        WelcomepageComponent_1.prototype.extractPlacesFromTrips = function (trips) {
            var _this = this;
            var places = [];
            var completedRequests = 0;
            var totalRequests = trips.filter(function (trip) { return trip.tripId; }).length;
            if (totalRequests === 0) {
                this.allPublicPlaces = places;
                this.isLoadingMapData = false;
                return;
            }
            trips.forEach(function (trip) {
                // Get locations for each trip
                if (trip.tripId) {
                    _this.tripProxy.getItems(trip.tripId).subscribe({
                        next: function (locations) {
                            if (locations && locations.locations) {
                                locations.locations.forEach(function (location) {
                                    var _a, _b;
                                    // Only include places that have valid coordinates
                                    if (location.address && _this.hasValidCoordinates(location.address)) {
                                        var place = {
                                            id: location._id || "".concat(trip.tripId, "-").concat(location.name),
                                            name: location.name || 'Unnamed Location',
                                            notes: location.notes || location.description || '',
                                            pictures: location.photos || location.pictures || [],
                                            location: ((_a = location.address) === null || _a === void 0 ? void 0 : _a.formattedAddress) || ((_b = location.address) === null || _b === void 0 ? void 0 : _b.address) || '',
                                            address: location.address,
                                            startDate: location.startDate,
                                            endDate: location.endDate,
                                            description: location.description,
                                            cost: location.cost
                                        };
                                        places.push(place);
                                    }
                                });
                            }
                            completedRequests++;
                            if (completedRequests === totalRequests) {
                                _this.allPublicPlaces = places;
                                console.log('Extracted places for map:', _this.allPublicPlaces.length);
                                _this.isLoadingMapData = false;
                            }
                        },
                        error: function (error) {
                            console.error("Error loading locations for trip ".concat(trip.tripId, ":"), error);
                            completedRequests++;
                            if (completedRequests === totalRequests) {
                                _this.allPublicPlaces = places;
                                console.log('Extracted places for map:', _this.allPublicPlaces.length);
                                _this.isLoadingMapData = false;
                            }
                        }
                    });
                }
            });
        };
        WelcomepageComponent_1.prototype.hasValidCoordinates = function (address) {
            if (!address)
                return false;
            // Check if address has coordinates
            if (address.coordinates) {
                var _a = address.coordinates, latitude = _a.latitude, longitude = _a.longitude;
                return typeof latitude === 'number' && typeof longitude === 'number' &&
                    latitude !== 0 && longitude !== 0;
            }
            // Check if address has lat/lng properties
            if (address.lat && address.lng) {
                return typeof address.lat === 'number' && typeof address.lng === 'number' &&
                    address.lat !== 0 && address.lng !== 0;
            }
            return false;
        };
        WelcomepageComponent_1.prototype.loadTopPlaces = function () {
            var _this = this;
            this.isLoadingTopPlaces = true;
            this.topPlacesError = '';
            // Fetch trips and get the first 3
            this.tripProxy.getListsIndex().subscribe({
                next: function (trips) {
                    console.log('Loaded trips for top places:', trips);
                    if (trips && trips.length > 0) {
                        // Take first 3 trips and transform them for display
                        var topTrips = trips.slice(0, 3);
                        _this.processTopPlaces(topTrips);
                    }
                    else {
                        _this.topPlaces = [];
                        _this.isLoadingTopPlaces = false;
                    }
                },
                error: function (error) {
                    console.error('Error loading trips for top places:', error);
                    _this.topPlacesError = 'Failed to load top places';
                    _this.isLoadingTopPlaces = false;
                }
            });
        };
        WelcomepageComponent_1.prototype.processTopPlaces = function (trips) {
            return __awaiter(this, void 0, void 0, function () {
                var processedPlaces, _i, trips_1, trip, image, location_1, topPlace, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            processedPlaces = [];
                            _i = 0, trips_1 = trips;
                            _a.label = 1;
                        case 1:
                            if (!(_i < trips_1.length)) return [3 /*break*/, 7];
                            trip = trips_1[_i];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 5, , 6]);
                            return [4 /*yield*/, this.getRepresentativeImageFromTrip(trip.tripId || trip._id || trip.id)];
                        case 3:
                            image = _a.sent();
                            return [4 /*yield*/, this.getLocationFromTrip(trip)];
                        case 4:
                            location_1 = _a.sent();
                            topPlace = {
                                id: trip.tripId || trip._id || trip.id || '',
                                name: trip.name || 'Unnamed Trip',
                                location: location_1,
                                image: image,
                                description: trip.description || ''
                            };
                            processedPlaces.push(topPlace);
                            return [3 /*break*/, 6];
                        case 5:
                            error_1 = _a.sent();
                            console.error('Error processing trip for top places:', error_1);
                            return [3 /*break*/, 6];
                        case 6:
                            _i++;
                            return [3 /*break*/, 1];
                        case 7:
                            this.topPlaces = processedPlaces;
                            this.isLoadingTopPlaces = false;
                            return [2 /*return*/];
                    }
                });
            });
        };
        WelcomepageComponent_1.prototype.getRepresentativeImageFromTrip = function (tripId) {
            return __awaiter(this, void 0, void 0, function () {
                var fallbackImages, locations, _i, _a, location_2, error_2, randomIndex;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            fallbackImages = [
                                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80',
                                'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80',
                                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80'
                            ];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.tripProxy.getItems(tripId).toPromise()];
                        case 2:
                            locations = _b.sent();
                            if (locations && locations.locations && locations.locations.length > 0) {
                                // Look for the first location with photos
                                for (_i = 0, _a = locations.locations; _i < _a.length; _i++) {
                                    location_2 = _a[_i];
                                    if (location_2.photos && location_2.photos.length > 0) {
                                        return [2 /*return*/, location_2.photos[0]];
                                    }
                                    if (location_2.pictures && location_2.pictures.length > 0) {
                                        return [2 /*return*/, location_2.pictures[0]];
                                    }
                                }
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _b.sent();
                            console.log('Could not get image from trip locations, using fallback');
                            return [3 /*break*/, 4];
                        case 4:
                            randomIndex = Math.floor(Math.random() * fallbackImages.length);
                            return [2 /*return*/, fallbackImages[randomIndex]];
                    }
                });
            });
        };
        WelcomepageComponent_1.prototype.getLocationFromTrip = function (trip) {
            return __awaiter(this, void 0, void 0, function () {
                var locations, location_3, parts, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.tripProxy.getItems(trip.tripId || trip._id || trip.id).toPromise()];
                        case 1:
                            locations = _a.sent();
                            if (locations && locations.locations && locations.locations.length > 0) {
                                location_3 = locations.locations[0];
                                // Try to extract location from address
                                if (location_3.address) {
                                    if (location_3.address.country) {
                                        return [2 /*return*/, location_3.address.country];
                                    }
                                    if (location_3.address.city) {
                                        return [2 /*return*/, location_3.address.city];
                                    }
                                    if (location_3.address.formattedAddress) {
                                        parts = location_3.address.formattedAddress.split(', ');
                                        return [2 /*return*/, parts[parts.length - 1] || 'Unknown Location'];
                                    }
                                }
                                // Fallback to location name or description
                                return [2 /*return*/, location_3.name || location_3.description || 'Unknown Location'];
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            console.log('Could not get location from trip, using fallback');
                            return [3 /*break*/, 3];
                        case 3: 
                        // Final fallback
                        return [2 /*return*/, trip.description || trip.location || 'Unknown Location'];
                    }
                });
            });
        };
        // Method to handle card hover effects
        WelcomepageComponent_1.prototype.onCardHover = function (event, isHovering) {
            var cardElement = event.currentTarget;
            if (cardElement) {
                if (isHovering) {
                    cardElement.style.transform = 'translateY(-3px)';
                    cardElement.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
                }
                else {
                    cardElement.style.transform = 'translateY(0)';
                    cardElement.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }
            }
        };
        return WelcomepageComponent_1;
    }());
    __setFunctionName(_classThis, "WelcomepageComponent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WelcomepageComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WelcomepageComponent = _classThis;
}();
exports.WelcomepageComponent = WelcomepageComponent;
//# sourceMappingURL=welcomepage.component.js.map