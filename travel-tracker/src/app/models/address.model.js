"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressHelper = void 0;
// Helper functions for address handling
var AddressHelper = /** @class */ (function () {
    function AddressHelper() {
    }
    /**
     * Get formatted address string from address object or string
     */
    AddressHelper.getFormattedAddress = function (address) {
        if (typeof address === 'string') {
            return address;
        }
        return address.formattedAddress || '';
    };
    /**
     * Get coordinates from address if available
     */
    AddressHelper.getCoordinates = function (address) {
        if (typeof address === 'string') {
            return null;
        }
        return address.coordinates || null;
    };
    /**
     * Check if address has coordinates
     */
    AddressHelper.hasCoordinates = function (address) {
        var coords = this.getCoordinates(address);
        return coords !== null && coords.latitude !== 0 && coords.longitude !== 0;
    };
    /**    /**
     * Convert string address to Address object for API compatibility
     */
    AddressHelper.normalizeAddressForApi = function (address) {
        if (typeof address === 'string') {
            return {
                formattedAddress: address,
                city: this.extractCityFromString(address),
                country: this.extractCountryFromString(address)
            };
        }
        return address;
    };
    /**
     * Convert Google Places result to our Address format
     */
    AddressHelper.fromGooglePlace = function (placeResult) {
        if (!placeResult) {
            return {
                formattedAddress: '',
                city: 'Unknown',
                country: 'Unknown'
            };
        }
        var address = {
            formattedAddress: placeResult.formatted_address || '',
            city: 'Unknown', // Default value
            country: 'Unknown', // Default value
            placeId: placeResult.place_id || '',
            types: placeResult.types || []
        };
        // Add coordinates if available
        if (placeResult.coordinates && placeResult.coordinates.lat !== undefined) {
            address.coordinates = {
                latitude: placeResult.coordinates.lat,
                longitude: placeResult.coordinates.lng
            };
        }
        // Parse address components
        if (placeResult.street_address) {
            // Split into number and street if possible
            var match = placeResult.street_address.match(/^(\d+)\s+(.+)$/);
            if (match) {
                address.streetNumber = match[1];
                address.streetName = match[2];
            }
            else {
                address.streetName = placeResult.street_address;
            }
        }
        // Set city, state, etc.
        if (placeResult.city)
            address.city = placeResult.city;
        if (placeResult.state)
            address.state = placeResult.state;
        if (placeResult.country)
            address.country = placeResult.country;
        if (placeResult.postal_code)
            address.postalCode = placeResult.postal_code;
        // Ensure required fields have values (per server IAddress interface requirements)
        if (!address.city)
            address.city = 'Unknown';
        if (!address.country)
            address.country = 'Unknown';
        if (!address.formattedAddress) {
            address.formattedAddress = [
                address.streetNumber,
                address.streetName,
                address.city,
                address.state,
                address.country
            ].filter(Boolean).join(', ');
        }
        return address;
    }; /**
     * Extract city from address string (simple heuristic)
     */
    AddressHelper.extractCityFromString = function (address) {
        var trimmed = address.trim();
        if (trimmed.length < 50 && !trimmed.includes(',')) {
            return trimmed;
        }
        var parts = trimmed.split(',');
        return parts.length > 1 ? parts[parts.length - 2].trim() : trimmed;
    };
    /**
     * Extract country from address string (simple heuristic)
     */
    AddressHelper.extractCountryFromString = function (address) {
        var trimmed = address.trim();
        if (trimmed.length < 50 && !trimmed.includes(',')) {
            return trimmed;
        }
        var parts = trimmed.split(',');
        return parts[parts.length - 1].trim();
    };
    /**
     * Generate Google Maps URL for coordinates
     */
    AddressHelper.getGoogleMapsUrl = function (address) {
        var coords = this.getCoordinates(address);
        if (coords) {
            return "https://www.google.com/maps?q=".concat(coords.latitude, ",").concat(coords.longitude);
        }
        var formattedAddress = this.getFormattedAddress(address);
        if (formattedAddress) {
            return "https://www.google.com/maps/search/?api=1&query=".concat(encodeURIComponent(formattedAddress));
        }
        return null;
    };
    /**
     * Get display address for UI components
     */
    AddressHelper.getDisplayAddress = function (address) {
        if (typeof address === 'string') {
            return address;
        }
        // Build a nice display format
        var parts = [];
        if (address.streetNumber && address.streetName) {
            parts.push("".concat(address.streetNumber, " ").concat(address.streetName));
        }
        if (address.city) {
            parts.push(address.city);
        }
        if (address.state) {
            parts.push(address.state);
        }
        if (address.country) {
            parts.push(address.country);
        }
        return parts.length > 0 ? parts.join(', ') : address.formattedAddress || '';
    };
    return AddressHelper;
}());
exports.AddressHelper = AddressHelper;
//# sourceMappingURL=address.model.js.map