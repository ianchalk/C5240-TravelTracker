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
exports.GoogleMapsService = void 0;
var https = require("https");
var GoogleMapsService = /** @class */ (function () {
    function GoogleMapsService(apiKey) {
        this.apiKey = apiKey;
    }
    /**
     * Geocode an address using Google Maps Geocoding API
     * @param address - The address string to geocode
     * @returns Promise with geocoding result
     */
    GoogleMapsService.prototype.geocodeAddress = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var encodedAddress, url, response, data, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.apiKey) {
                            console.warn('Google Maps API key not configured. Skipping geocoding.');
                            return [2 /*return*/, null];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        encodedAddress = encodeURIComponent(address);
                        url = "https://maps.googleapis.com/maps/api/geocode/json?address=".concat(encodedAddress, "&key=").concat(this.apiKey);
                        return [4 /*yield*/, this.makeHttpsRequest(url)];
                    case 2:
                        response = _a.sent();
                        data = JSON.parse(response);
                        if (data.status === 'OK' && data.results && data.results.length > 0) {
                            result = data.results[0];
                            return [2 /*return*/, this.parseGeocodingResult(result)];
                        }
                        else {
                            console.warn("Geocoding failed for address: ".concat(address, ". Status: ").concat(data.status));
                            return [2 /*return*/, null];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error geocoding address:', error_1);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Reverse geocode coordinates to get address information
     * @param latitude - Latitude coordinate
     * @param longitude - Longitude coordinate
     * @returns Promise with geocoding result
     */
    GoogleMapsService.prototype.reverseGeocode = function (latitude, longitude) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response, data, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.apiKey) {
                            console.warn('Google Maps API key not configured. Skipping reverse geocoding.');
                            return [2 /*return*/, null];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=".concat(latitude, ",").concat(longitude, "&key=").concat(this.apiKey);
                        return [4 /*yield*/, this.makeHttpsRequest(url)];
                    case 2:
                        response = _a.sent();
                        data = JSON.parse(response);
                        if (data.status === 'OK' && data.results && data.results.length > 0) {
                            result = data.results[0];
                            return [2 /*return*/, this.parseGeocodingResult(result)];
                        }
                        else {
                            console.warn("Reverse geocoding failed for coordinates: ".concat(latitude, ", ").concat(longitude, ". Status: ").concat(data.status));
                            return [2 /*return*/, null];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error reverse geocoding coordinates:', error_2);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Parse Google Maps API geocoding result into our standard format
     */
    GoogleMapsService.prototype.parseGeocodingResult = function (result) {
        var addressComponents = result.address_components || [];
        var geometry = result.geometry || {};
        var location = geometry.location || {};
        // Extract address components
        var getComponent = function (types) {
            var component = addressComponents.find(function (comp) {
                return comp.types.some(function (type) { return types.includes(type); });
            });
            return component ? component.long_name : '';
        };
        var getShortComponent = function (types) {
            var component = addressComponents.find(function (comp) {
                return comp.types.some(function (type) { return types.includes(type); });
            });
            return component ? component.short_name : '';
        };
        return {
            formattedAddress: result.formatted_address || '',
            streetNumber: getComponent(['street_number']),
            streetName: getComponent(['route']),
            city: getComponent(['locality', 'administrative_area_level_2']),
            state: getComponent(['administrative_area_level_1']),
            country: getComponent(['country']),
            postalCode: getComponent(['postal_code']),
            coordinates: {
                latitude: location.lat || 0,
                longitude: location.lng || 0
            },
            placeId: result.place_id || '',
            types: result.types || []
        };
    };
    /**
     * Make HTTPS request to Google Maps API
     */
    GoogleMapsService.prototype.makeHttpsRequest = function (url) {
        return new Promise(function (resolve, reject) {
            var request = https.get(url, function (response) {
                var data = '';
                response.on('data', function (chunk) {
                    data += chunk;
                });
                response.on('end', function () {
                    resolve(data);
                });
            });
            request.on('error', function (error) {
                reject(error);
            });
            request.setTimeout(10000, function () {
                request.destroy();
                reject(new Error('Request timeout'));
            });
        });
    };
    /**
     * Get static map image URL for displaying maps
     * @param addresses - Array of address objects with coordinates
     * @param width - Map width in pixels (default: 600)
     * @param height - Map height in pixels (default: 400)
     * @param zoom - Map zoom level (default: 10)
     * @returns Static map image URL
     */
    GoogleMapsService.prototype.getStaticMapUrl = function (addresses, width, height, zoom) {
        if (width === void 0) { width = 600; }
        if (height === void 0) { height = 400; }
        if (zoom === void 0) { zoom = 10; }
        if (!this.apiKey) {
            // Return a placeholder image if no API key
            return "https://via.placeholder.com/".concat(width, "x").concat(height, "?text=Map+Not+Available");
        }
        var url = "https://maps.googleapis.com/maps/api/staticmap?size=".concat(width, "x").concat(height, "&zoom=").concat(zoom, "&key=").concat(this.apiKey);
        // Add markers for each location with coordinates
        var markersWithCoords = addresses.filter(function (addr) { return addr.coordinates; });
        if (markersWithCoords.length > 0) {
            markersWithCoords.forEach(function (addr, index) {
                if (addr.coordinates) {
                    url += "&markers=color:red%7Clabel:".concat(index + 1, "%7C").concat(addr.coordinates.latitude, ",").concat(addr.coordinates.longitude);
                }
            });
        }
        else {
            // If no coordinates, try to use the first formatted address
            if (addresses.length > 0) {
                var encodedAddress = encodeURIComponent(addresses[0].formattedAddress);
                url += "&markers=color:red%7C".concat(encodedAddress);
            }
        }
        return url;
    };
    return GoogleMapsService;
}());
exports.GoogleMapsService = GoogleMapsService;
//# sourceMappingURL=GoogleMapsService.js.map