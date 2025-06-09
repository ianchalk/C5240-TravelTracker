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
exports.GooglePlacesAutocompleteService = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../environments/environment");
var GooglePlacesAutocompleteService = function () {
    var _classDecorators = [(0, core_1.Injectable)({
            providedIn: 'root'
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var GooglePlacesAutocompleteService = _classThis = /** @class */ (function () {
        function GooglePlacesAutocompleteService_1() {
            this.autocompleteService = null;
            this.placesService = null;
            this.isGoogleMapsLoaded = false;
            this.loadGoogleMapsAPI();
        }
        GooglePlacesAutocompleteService_1.prototype.loadGoogleMapsAPI = function () {
            return __awaiter(this, void 0, void 0, function () {
                var script_1, scriptPromise, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            // Check if Google Maps is already loaded
                            if (typeof google !== 'undefined' && google.maps) {
                                this.initializeServices();
                                return [2 /*return*/];
                            }
                            script_1 = document.createElement('script');
                            script_1.src = "https://maps.googleapis.com/maps/api/js?key=".concat(environment_1.environment.googleMapsApiKey, "&libraries=places");
                            script_1.async = true;
                            script_1.defer = true;
                            scriptPromise = new Promise(function (resolve, reject) {
                                script_1.onload = function () {
                                    console.log('Google Maps API loaded successfully');
                                    resolve();
                                };
                                script_1.onerror = function (error) {
                                    console.error('Failed to load Google Maps API:', error);
                                    reject(error);
                                };
                            });
                            // Add script to document
                            document.head.appendChild(script_1);
                            // Wait for script to load
                            return [4 /*yield*/, scriptPromise];
                        case 1:
                            // Wait for script to load
                            _a.sent();
                            this.initializeServices();
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            console.error('Error loading Google Maps API:', error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        GooglePlacesAutocompleteService_1.prototype.initializeServices = function () {
            try {
                if (typeof google !== 'undefined' && google.maps && google.maps.places) {
                    this.autocompleteService = new google.maps.places.AutocompleteService();
                    // Create a dummy div for PlacesService (required by Google Maps API)
                    var dummyDiv = document.createElement('div');
                    var map = new google.maps.Map(dummyDiv);
                    this.placesService = new google.maps.places.PlacesService(map);
                    this.isGoogleMapsLoaded = true;
                    console.log('Google Places services initialized successfully');
                }
                else {
                    console.error('Google Maps API loaded but places library is not available');
                }
            }
            catch (error) {
                console.error('Error initializing Google Places services:', error);
            }
        };
        /**
         * Get place predictions based on input text
         */
        GooglePlacesAutocompleteService_1.prototype.getPlacePredictions = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            if (!_this.isGoogleMapsLoaded || !_this.autocompleteService) {
                                console.warn('Google Maps not loaded yet');
                                resolve([]);
                                return;
                            }
                            if (!input || input.length < 2) {
                                resolve([]);
                                return;
                            }
                            var request = {
                                input: input,
                                types: ['geocode', 'establishment'],
                                componentRestrictions: undefined // Remove country restriction for global search
                            };
                            _this.autocompleteService.getPlacePredictions(request, function (predictions, status) {
                                if (status === 'OK' && predictions) {
                                    var formattedPredictions = predictions.map(function (prediction) { return ({
                                        description: prediction.description,
                                        place_id: prediction.place_id,
                                        structured_formatting: {
                                            main_text: prediction.structured_formatting.main_text,
                                            secondary_text: prediction.structured_formatting.secondary_text || ''
                                        },
                                        types: prediction.types
                                    }); });
                                    resolve(formattedPredictions);
                                }
                                else {
                                    console.warn('Places predictions failed:', status);
                                    resolve([]);
                                }
                            });
                        })];
                });
            });
        };
        /**
         * Get detailed place information by place ID
         */
        GooglePlacesAutocompleteService_1.prototype.getPlaceDetails = function (placeId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            if (!_this.isGoogleMapsLoaded || !_this.placesService) {
                                console.warn('Google Maps not loaded yet');
                                resolve(null);
                                return;
                            }
                            var request = {
                                placeId: placeId,
                                fields: [
                                    'formatted_address',
                                    'geometry',
                                    'name',
                                    'place_id',
                                    'types',
                                    'address_components'
                                ]
                            };
                            _this.placesService.getDetails(request, function (place, status) {
                                if (status === 'OK' && place) {
                                    resolve(place);
                                }
                                else {
                                    console.warn('Place details failed:', status);
                                    resolve(null);
                                }
                            });
                        })];
                });
            });
        };
        /**
         * Convert Google Place to our Address format
         */
        GooglePlacesAutocompleteService_1.prototype.convertPlaceToAddress = function (place) {
            var _a, _b, _c, _d;
            var addressComponents = place.address_components || [];
            // Extract address components
            var streetNumber = '';
            var streetName = '';
            var city = '';
            var state = '';
            var country = '';
            var postalCode = '';
            addressComponents.forEach(function (component) {
                var types = component.types;
                if (types.includes('street_number')) {
                    streetNumber = component.long_name;
                }
                else if (types.includes('route')) {
                    streetName = component.long_name;
                }
                else if (types.includes('locality') || types.includes('administrative_area_level_2')) {
                    city = component.long_name;
                }
                else if (types.includes('administrative_area_level_1')) {
                    state = component.short_name;
                }
                else if (types.includes('country')) {
                    country = component.long_name;
                }
                else if (types.includes('postal_code')) {
                    postalCode = component.long_name;
                }
            });
            var address = {
                formatted_address: place.formatted_address || '',
                street_address: "".concat(streetNumber, " ").concat(streetName).trim(),
                city: city,
                state: state,
                country: country,
                postal_code: postalCode,
                coordinates: {
                    lat: ((_b = (_a = place.geometry) === null || _a === void 0 ? void 0 : _a.location) === null || _b === void 0 ? void 0 : _b.lat()) || 0,
                    lng: ((_d = (_c = place.geometry) === null || _c === void 0 ? void 0 : _c.location) === null || _d === void 0 ? void 0 : _d.lng()) || 0
                },
                place_id: place.place_id || '',
                types: place.types || []
            };
            return address;
        };
        /**
         * Check if Google Maps is loaded and ready
         */
        GooglePlacesAutocompleteService_1.prototype.isLoaded = function () {
            return this.isGoogleMapsLoaded;
        };
        return GooglePlacesAutocompleteService_1;
    }());
    __setFunctionName(_classThis, "GooglePlacesAutocompleteService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GooglePlacesAutocompleteService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GooglePlacesAutocompleteService = _classThis;
}();
exports.GooglePlacesAutocompleteService = GooglePlacesAutocompleteService;
//# sourceMappingURL=google-places-autocomplete.service.js.map