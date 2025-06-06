"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.InteractiveMapComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var js_api_loader_1 = require("@googlemaps/js-api-loader");
var address_model_1 = require("./models/address.model");
var InteractiveMapComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-interactive-map',
            standalone: true,
            imports: [common_1.CommonModule], template: "\n    <div class=\"interactive-map-container\">\n      <div \n        #mapElement \n        class=\"map-container\"\n        [style.height.px]=\"mapHeight\">\n      </div>\n      \n      <div class=\"map-error\" *ngIf=\"errorMessage\">\n        <div class=\"error-content\">\n          <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\">\n            <path d=\"M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z\" fill=\"#ff6b6b\"/>\n          </svg>\n          <p>{{ errorMessage }}</p>\n          <small>Falling back to static map view</small>\n        </div>\n      </div>\n      \n      <div class=\"map-loading\" *ngIf=\"isLoading\">\n        <div class=\"loading-spinner\"></div>\n        <p>Loading interactive map...</p>\n      </div>\n    </div>\n  ", styles: ["    .interactive-map-container {\n      background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,255,248,0.95) 100%);\n      border-radius: 20px;\n      box-shadow: 0 8px 32px rgba(43, 158, 95, 0.15);\n      overflow: hidden;\n      border: 2px solid rgba(43, 158, 95, 0.1);\n      backdrop-filter: blur(10px);\n      position: relative;\n    }.map-container {\n      width: 100%;\n      min-height: 400px;\n      position: relative;\n      border-radius: 20px;\n      overflow: hidden;\n    }\n\n    .map-loading {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: center;\n      padding: 80px 20px;\n      background: linear-gradient(135deg, #f8fffe 0%, #f0f7f4 100%);\n      color: #2b9e5f;\n      font-weight: 500;\n    }\n\n    .loading-spinner {\n      width: 48px;\n      height: 48px;\n      border: 4px solid rgba(43, 158, 95, 0.1);\n      border-left-color:rgb(46, 165, 100);\n      border-top-color:rgb(43, 158, 95);\n      border-radius: 50%;\n      animation: spin 1s linear infinite;\n      margin-bottom: 20px;\n      box-shadow: 0 4px 12px rgba(43, 158, 95, 0.2);\n    }\n\n    @keyframes spin {\n      to {\n        transform: rotate(360deg);\n      }\n    }\n\n    .map-error {\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      padding: 80px 20px;\n      background: linear-gradient(135deg, #fff5f5 0%, #ffeaea 100%);\n      border: 2px solid #fed7d7;\n      margin: 20px;\n      border-radius: 16px;\n      box-shadow: 0 4px 16px rgba(220, 53, 69, 0.1);\n    }\n\n    .error-content {\n      text-align: center;\n      color: #c53030;\n    }\n\n    .error-content svg {\n      margin-bottom: 16px;\n      filter: drop-shadow(0 2px 4px rgba(220, 53, 69, 0.2));\n    }\n\n    .error-content p {\n      margin: 12px 0;\n      font-weight: 600;\n      font-size: 1.1rem;\n    }    .error-content small {\n      color: rgb(119, 131, 149);\n      font-size: 0.9rem;\n      font-weight: 500;\n    }\n\n    @media (max-width: 768px) {\n      .map-container {\n        min-height: 300px;\n      }\n    }\n  "]
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _mapElement_decorators;
    var _mapElement_initializers = [];
    var _mapElement_extraInitializers = [];
    var _places_decorators;
    var _places_initializers = [];
    var _places_extraInitializers = [];
    var _tripName_decorators;
    var _tripName_initializers = [];
    var _tripName_extraInitializers = [];
    var _mapHeight_decorators;
    var _mapHeight_initializers = [];
    var _mapHeight_extraInitializers = [];
    var _apiKey_decorators;
    var _apiKey_initializers = [];
    var _apiKey_extraInitializers = [];
    var _set_selectedPlaceIndex_decorators;
    var InteractiveMapComponent = _classThis = /** @class */ (function () {
        function InteractiveMapComponent_1() {
            this.mapElement = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _mapElement_initializers, void 0));
            this.places = (__runInitializers(this, _mapElement_extraInitializers), __runInitializers(this, _places_initializers, []));
            this.tripName = (__runInitializers(this, _places_extraInitializers), __runInitializers(this, _tripName_initializers, ''));
            this.mapHeight = (__runInitializers(this, _tripName_extraInitializers), __runInitializers(this, _mapHeight_initializers, 400));
            this.apiKey = (__runInitializers(this, _mapHeight_extraInitializers), __runInitializers(this, _apiKey_initializers, '')); // Will be passed from environment or config
            this._selectedPlaceIndex = (__runInitializers(this, _apiKey_extraInitializers), 0);
            this.markers = [];
            this.infoWindows = [];
            this.activePlace = 0;
            this.isLoading = true;
            this.errorMessage = '';
        }
        Object.defineProperty(InteractiveMapComponent_1.prototype, "selectedPlaceIndex", {
            get: function () {
                return this._selectedPlaceIndex;
            },
            set: function (index) {
                if (this._selectedPlaceIndex !== index) {
                    this._selectedPlaceIndex = index;
                    this.highlightSelectedPlace();
                }
            },
            enumerable: false,
            configurable: true
        });
        InteractiveMapComponent_1.prototype.ngOnInit = function () {
            // Initialize the Google Maps loader
            this.loader = new js_api_loader_1.Loader({
                apiKey: this.apiKey || 'YOUR_API_KEY_HERE', // Replace with actual API key
                version: 'weekly',
                libraries: ['places', 'geometry']
            });
        };
        InteractiveMapComponent_1.prototype.ngAfterViewInit = function () {
            this.initializeMap();
        };
        InteractiveMapComponent_1.prototype.ngOnDestroy = function () {
            // Clean up markers
            this.clearMarkers();
        };
        InteractiveMapComponent_1.prototype.initializeMap = function () {
            return __awaiter(this, void 0, void 0, function () {
                var placesWithCoords, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.isLoading = true;
                            this.errorMessage = '';
                            // Load Google Maps API
                            return [4 /*yield*/, this.loader.load()];
                        case 1:
                            // Load Google Maps API
                            _a.sent();
                            placesWithCoords = this.getPlacesWithCoordinates();
                            if (placesWithCoords.length === 0) {
                                // No coordinates available, show default view
                                this.initializeDefaultMap();
                            }
                            else {
                                // Initialize map with places
                                this.initializeMapWithPlaces(placesWithCoords);
                            }
                            this.isLoading = false;
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            console.error('Error loading Google Maps:', error_1);
                            this.errorMessage = 'Unable to load interactive map. Please check your internet connection.';
                            this.isLoading = false;
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        InteractiveMapComponent_1.prototype.getPlacesWithCoordinates = function () {
            var _this = this;
            return this.places
                .filter(function (place) {
                // Check if place has address with coordinates
                if (place.address && _this.hasCoordinates(place.address)) {
                    return true;
                }
                // If no address but has location string that might have coordinates
                if (place.location && place.location.includes(',')) {
                    // Try to parse as "lat,lng" format
                    var parts = place.location.split(',').map(function (part) { return parseFloat(part.trim()); });
                    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                        return true;
                    }
                }
                return false;
            })
                .map(function (place) { return ({
                place: place,
                coordinates: place.address ? _this.getCoordinates(place.address) : _this.parseLocationString(place.location)
            }); });
        };
        InteractiveMapComponent_1.prototype.parseLocationString = function (location) {
            if (!location || !location.includes(',')) {
                return { lat: 0, lng: 0 };
            }
            // Try to parse as "lat,lng" format
            var parts = location.split(',').map(function (part) { return parseFloat(part.trim()); });
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                return { lat: parts[0], lng: parts[1] };
            }
            return { lat: 0, lng: 0 };
        };
        InteractiveMapComponent_1.prototype.hasCoordinates = function (address) {
            if (typeof address === 'string')
                return false;
            return address_model_1.AddressHelper.hasCoordinates(address);
        };
        InteractiveMapComponent_1.prototype.getCoordinates = function (address) {
            if (typeof address === 'string')
                return { lat: 0, lng: 0 };
            var coords = address_model_1.AddressHelper.getCoordinates(address);
            return {
                lat: (coords === null || coords === void 0 ? void 0 : coords.latitude) || 0,
                lng: (coords === null || coords === void 0 ? void 0 : coords.longitude) || 0
            };
        };
        InteractiveMapComponent_1.prototype.initializeDefaultMap = function () {
            // Default to a world view
            var defaultCenter = { lat: 20, lng: 0 };
            var defaultZoom = 2;
            this.map = new google.maps.Map(this.mapElement.nativeElement, {
                center: defaultCenter,
                zoom: defaultZoom,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: [
                    {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'on' }]
                    }
                ]
            });
            // Add a message overlay
            var infoWindow = new google.maps.InfoWindow({
                content: "\n        <div style=\"text-align: center; padding: 10px;\">\n          <h4>\uD83D\uDCCD ".concat(this.tripName, "</h4>\n          <p>Add locations with addresses to see them on the map!</p>\n        </div>\n      ")
            });
            infoWindow.setPosition(defaultCenter);
            infoWindow.open(this.map);
        };
        InteractiveMapComponent_1.prototype.initializeMapWithPlaces = function (placesWithCoords) {
            var _this = this;
            // Calculate bounds to fit all markers
            var bounds = new google.maps.LatLngBounds();
            placesWithCoords.forEach(function (_a) {
                var coordinates = _a.coordinates;
                bounds.extend(new google.maps.LatLng(coordinates.lat, coordinates.lng));
            });
            // Initialize map with custom options for better visualization
            this.map = new google.maps.Map(this.mapElement.nativeElement, {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
                fullscreenControl: true,
                streetViewControl: true,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_CENTER
                },
                styles: [
                    {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'on' }]
                    },
                    {
                        featureType: 'transit',
                        elementType: 'labels',
                        stylers: [{ visibility: 'on' }]
                    }
                ]
            }); // Create markers for each place
            placesWithCoords.forEach(function (_a, index) {
                var place = _a.place, coordinates = _a.coordinates;
                _this.createMarker(place, coordinates, index + 1);
            });
            // Store reference to the currently active place for synchronization with carousel
            this.activePlace = 0;
            // Fit map to show all markers
            if (placesWithCoords.length === 1) {
                // Single location - center and zoom appropriately
                this.map.setCenter(placesWithCoords[0].coordinates);
                this.map.setZoom(14); // Good zoom level for single location
            }
            else if (placesWithCoords.length > 1) {
                // Multiple locations - fit bounds with appropriate padding
                this.map.fitBounds(bounds);
                // Better padding calculation based on the number of places
                var padding = {
                    top: 60,
                    right: 60,
                    bottom: 60,
                    left: 60
                };
                // Apply padding and make sure the zoom isn't too far out or too close
                this.map.fitBounds(bounds, padding);
                // Add a listener for when bounds change is complete
                google.maps.event.addListenerOnce(this.map, 'idle', function () {
                    // Check if zoom level is too high (too zoomed in)
                    var currentZoom = _this.map.getZoom();
                    if (currentZoom && currentZoom > 15) {
                        _this.map.setZoom(15); // Limit maximum zoom for multiple locations
                    }
                    // Check if zoom level is too low (too zoomed out)
                    if (currentZoom && currentZoom < 3 && placesWithCoords.length < 10) {
                        _this.map.setZoom(3); // Set minimum zoom for small sets of locations
                    }
                });
            }
            // Add trip info window
            this.addTripInfoWindow();
        };
        InteractiveMapComponent_1.prototype.createMarker = function (place, coordinates, index) {
            var _this = this;
            // Generate a unique color for each marker based on the index
            var colors = ['#dc3545', '#198754', '#0d6efd', '#6f42c1', '#fd7e14', '#20c997', '#0dcaf0', '#6610f2'];
            var color = colors[index % colors.length];
            // Create animated drop effect for markers
            var marker = new google.maps.Marker({
                position: coordinates,
                map: this.map,
                title: place.name,
                animation: google.maps.Animation.DROP,
                label: {
                    text: index.toString(),
                    color: 'white',
                    fontWeight: 'bold'
                },
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent("\n          <svg width=\"32\" height=\"40\" viewBox=\"0 0 32 40\" xmlns=\"http://www.w3.org/2000/svg\">\n            <path d=\"M16 0C7.2 0 0 7.2 0 16c0 8.8 16 24 16 24s16-15.2 16-24C32 7.2 24.8 0 16 0z\" fill=\"".concat(color, "\"/>\n            <circle cx=\"16\" cy=\"16\" r=\"8\" fill=\"white\"/>\n          </svg>\n        ")),
                    scaledSize: new google.maps.Size(32, 40),
                    anchor: new google.maps.Point(16, 40)
                },
                zIndex: 1000 - index // Higher indices show on top when overlapping
            });
            // Create info window for this marker
            var infoContent = this.createMarkerInfoContent(place, index);
            var infoWindow = new google.maps.InfoWindow({
                content: infoContent
            }); // Add click listener
            marker.addListener('click', function () {
                // Close any open info windows
                _this.closeAllInfoWindows();
                infoWindow.open(_this.map, marker);
                // Store this info window
                _this.infoWindows.push(infoWindow);
            });
            this.markers.push(marker);
        };
        InteractiveMapComponent_1.prototype.createMarkerInfoContent = function (place, index) {
            var address = this.getDisplayAddress(place);
            var photoUrl = place.pictures && place.pictures.length > 0 ? place.pictures[0] : null;
            // Generate a unique color for each marker based on the index
            var colors = ['#dc3545', '#198754', '#0d6efd', '#6f42c1', '#fd7e14', '#20c997', '#0dcaf0', '#6610f2'];
            var color = colors[index % colors.length];
            // Format dates if available
            var startDate = place.startDate ? new Date(place.startDate).toLocaleDateString() : null;
            var endDate = place.endDate ? new Date(place.endDate).toLocaleDateString() : null;
            return "\n      <div style=\"max-width: 320px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\">\n        <div style=\"display: flex; align-items: center; margin-bottom: 8px;\">\n          <span style=\"background: ".concat(color, "; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; margin-right: 8px;\">\n            ").concat(index, "\n          </span>\n          <h4 style=\"margin: 0; font-size: 18px; font-weight: 600; color: #333;\">").concat(place.name, "</h4>\n        </div>\n        \n        ").concat(photoUrl ? "\n          <div style=\"position: relative; overflow: hidden; border-radius: 8px; margin: 10px 0;\">\n            <img src=\"".concat(photoUrl, "\" \n                style=\"width: 100%; height: 140px; object-fit: cover;\"\n                onerror=\"this.style.display='none'\" />\n            ").concat(place.pictures && place.pictures.length > 1 ?
                "<div style=\"position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.6); color: white; font-size: 12px; padding: 4px 8px; border-radius: 12px;\">\n                +".concat(place.pictures.length - 1, " more photos\n              </div>") : '', "\n          </div>\n        ") : '', "\n        \n        <div style=\"margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid ").concat(color, ";\">\n          <p style=\"margin: 0; font-size: 13px; color: #495057; line-height: 1.5;\">\n            \uD83D\uDCCD ").concat(address, "\n          </p>\n        </div>\n        \n        ").concat((startDate || endDate) ? "\n          <div style=\"display: flex; margin: 8px 0; font-size: 13px; color: #495057;\">\n            <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" style=\"margin-right: 6px;\">\n              <path fill=\"currentColor\" d=\"M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zM5 7V5h14v2H5zm2 4h10v2H7v-2zm0 4h7v2H7v-2z\"/>\n            </svg>\n            <div>\n              ".concat(startDate ? "<div>Start: ".concat(startDate, "</div>") : '', "\n              ").concat(endDate ? "<div>End: ".concat(endDate, "</div>") : '', "\n            </div>\n          </div>\n        ") : '', "\n        \n        ").concat(place.notes ? "\n          <div style=\"margin: 12px 0;\">\n            <div style=\"font-size: 14px; font-weight: 500; color: #343a40; margin-bottom: 4px;\">Notes</div>\n            <p style=\"margin: 0; font-size: 13px; color: #495057; line-height: 1.5; max-height: 80px; overflow: hidden;\">\n              ".concat(place.notes.length > 150 ? place.notes.substring(0, 150) + '...' : place.notes, "\n            </p>\n          </div>\n        ") : '', "\n        \n        ").concat(place.cost ? "\n          <div style=\"margin: 12px 0 4px; display: flex; align-items: center; justify-content: flex-end;\">\n            <span style=\"font-size: 14px; font-weight: 600; color: #198754; background: #e9f7ef; padding: 4px 10px; border-radius: 16px;\">\n              \uD83D\uDCB0 $".concat(place.cost.toLocaleString(), "\n            </span>\n          </div>\n        ") : '', "\n      </div>\n    ");
        };
        InteractiveMapComponent_1.prototype.getDisplayAddress = function (place) {
            if (place.address) {
                if (typeof place.address === 'string') {
                    return place.address;
                }
                return address_model_1.AddressHelper.getDisplayAddress(place.address);
            }
            return place.location || 'No address available';
        };
        InteractiveMapComponent_1.prototype.addTripInfoWindow = function () {
            var _this = this;
            // Add a control button to show trip summary
            var controlDiv = document.createElement('div');
            controlDiv.style.backgroundColor = 'white';
            controlDiv.style.border = '2px solid #fff';
            controlDiv.style.borderRadius = '8px';
            controlDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
            controlDiv.style.cursor = 'pointer';
            controlDiv.style.marginBottom = '22px';
            controlDiv.style.textAlign = 'center';
            controlDiv.title = 'Trip Summary';
            var controlUI = document.createElement('div');
            controlUI.style.color = 'rgb(25,25,25)';
            controlUI.style.fontFamily = 'Roboto,Arial,sans-serif';
            controlUI.style.fontSize = '14px';
            controlUI.style.lineHeight = '40px';
            controlUI.style.paddingLeft = '5px';
            controlUI.style.paddingRight = '5px';
            controlUI.innerHTML = "\uD83D\uDCCD ".concat(this.tripName);
            controlDiv.appendChild(controlUI);
            // Add event listener
            controlDiv.addEventListener('click', function () {
                var tripInfoContent = "\n        <div style=\"text-align: center; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\">\n          <h3 style=\"margin: 0 0 12px 0; color: #333;\">\uD83D\uDDFA\uFE0F ".concat(_this.tripName, "</h3>\n          <p style=\"margin: 8px 0; color: #666;\">\n            <strong>").concat(_this.places.length, "</strong> location").concat(_this.places.length > 1 ? 's' : '', " on this trip\n          </p>\n          <div style=\"margin-top: 12px; font-size: 13px; color: #555;\">\n            Click on any marker to see location details\n          </div>\n        </div>\n      ");
                var tripInfoWindow = new google.maps.InfoWindow({
                    content: tripInfoContent
                });
                tripInfoWindow.setPosition(_this.map.getCenter());
                tripInfoWindow.open(_this.map);
            });
            this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
        };
        InteractiveMapComponent_1.prototype.closeAllInfoWindows = function () {
            // Close all info windows
            for (var _i = 0, _a = this.infoWindows; _i < _a.length; _i++) {
                var infoWindow = _a[_i];
                infoWindow.close();
            }
        };
        InteractiveMapComponent_1.prototype.highlightSelectedPlace = function () {
            if (!this.map || !this.markers.length || this._selectedPlaceIndex < 0) {
                return;
            }
            // Get places with valid coordinates
            var placesWithCoords = this.getPlacesWithCoordinates();
            if (!placesWithCoords.length) {
                return;
            }
            // Find marker that corresponds to the selected place
            // Note: marker indices are 1-based in our implementation
            if (this._selectedPlaceIndex < placesWithCoords.length) {
                // Close any open info windows first
                this.closeAllInfoWindows();
                // Focus on the selected place
                var marker_1 = this.markers[this._selectedPlaceIndex];
                if (marker_1) {
                    // Center the map on this marker
                    this.map.panTo(marker_1.getPosition());
                    // Create an info window for this marker if it doesn't exist
                    var place = this.places[this._selectedPlaceIndex];
                    var infoContent = this.createMarkerInfoContent(place, this._selectedPlaceIndex + 1);
                    var infoWindow = new google.maps.InfoWindow({
                        content: infoContent
                    });
                    // Add it to our list of info windows
                    this.infoWindows.push(infoWindow);
                    // Open the info window for this marker
                    infoWindow.open(this.map, marker_1);
                    // Animate the marker to bounce
                    marker_1.setAnimation(google.maps.Animation.BOUNCE);
                    // Stop animation after 2 bounces
                    setTimeout(function () {
                        marker_1.setAnimation(null);
                    }, 1400);
                }
            }
        };
        InteractiveMapComponent_1.prototype.clearMarkers = function () {
            // Clear all markers from the map
            this.markers.forEach(function (marker) {
                marker.setMap(null);
            });
            this.markers = [];
            // Close and clear all info windows
            this.closeAllInfoWindows();
            this.infoWindows = [];
        };
        // Public method to refresh the map when places change
        InteractiveMapComponent_1.prototype.refreshMap = function () {
            if (this.map) {
                this.clearMarkers();
                this.initializeMap();
            }
        };
        return InteractiveMapComponent_1;
    }());
    __setFunctionName(_classThis, "InteractiveMapComponent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _mapElement_decorators = [(0, core_1.ViewChild)('mapElement', { static: false })];
        _places_decorators = [(0, core_1.Input)()];
        _tripName_decorators = [(0, core_1.Input)()];
        _mapHeight_decorators = [(0, core_1.Input)()];
        _apiKey_decorators = [(0, core_1.Input)()];
        _set_selectedPlaceIndex_decorators = [(0, core_1.Input)()];
        __esDecorate(_classThis, null, _set_selectedPlaceIndex_decorators, { kind: "setter", name: "selectedPlaceIndex", static: false, private: false, access: { has: function (obj) { return "selectedPlaceIndex" in obj; }, set: function (obj, value) { obj.selectedPlaceIndex = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, null, _mapElement_decorators, { kind: "field", name: "mapElement", static: false, private: false, access: { has: function (obj) { return "mapElement" in obj; }, get: function (obj) { return obj.mapElement; }, set: function (obj, value) { obj.mapElement = value; } }, metadata: _metadata }, _mapElement_initializers, _mapElement_extraInitializers);
        __esDecorate(null, null, _places_decorators, { kind: "field", name: "places", static: false, private: false, access: { has: function (obj) { return "places" in obj; }, get: function (obj) { return obj.places; }, set: function (obj, value) { obj.places = value; } }, metadata: _metadata }, _places_initializers, _places_extraInitializers);
        __esDecorate(null, null, _tripName_decorators, { kind: "field", name: "tripName", static: false, private: false, access: { has: function (obj) { return "tripName" in obj; }, get: function (obj) { return obj.tripName; }, set: function (obj, value) { obj.tripName = value; } }, metadata: _metadata }, _tripName_initializers, _tripName_extraInitializers);
        __esDecorate(null, null, _mapHeight_decorators, { kind: "field", name: "mapHeight", static: false, private: false, access: { has: function (obj) { return "mapHeight" in obj; }, get: function (obj) { return obj.mapHeight; }, set: function (obj, value) { obj.mapHeight = value; } }, metadata: _metadata }, _mapHeight_initializers, _mapHeight_extraInitializers);
        __esDecorate(null, null, _apiKey_decorators, { kind: "field", name: "apiKey", static: false, private: false, access: { has: function (obj) { return "apiKey" in obj; }, get: function (obj) { return obj.apiKey; }, set: function (obj, value) { obj.apiKey = value; } }, metadata: _metadata }, _apiKey_initializers, _apiKey_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InteractiveMapComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InteractiveMapComponent = _classThis;
}();
exports.InteractiveMapComponent = InteractiveMapComponent;
//# sourceMappingURL=interactive-map.component.js.map