// Enhanced address interface for frontend components
export interface Address {
    formattedAddress: string;
    streetNumber?: string;
    streetName?: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    placeId?: string;
    types?: string[];
}

// Location interface with enhanced address
export interface Location {
    name: string;
    address: Address | string; // Support both formats for compatibility
    description: string;
    startDate: Date | string;
    endDate: Date | string;
    duration?: number;
    notes?: string;
    photos?: string[];
    dates?: Date[]; // Legacy field
    cost?: number;
}

// Trip interface with enhanced locations
export interface Trip {
    _id?: string;
    tripId: string;
    name: string;
    description: string;
    isPublic?: boolean;
    authorId?: string;
    authorName?: string;
    authorEmail?: string;
    locations: Location[];
}

// Helper functions for address handling
export class AddressHelper {
    /**
     * Get formatted address string from address object or string
     */
    static getFormattedAddress(address: Address | string): string {
        if (typeof address === 'string') {
            return address;
        }
        return address.formattedAddress || '';
    }

    /**
     * Get coordinates from address if available
     */
    static getCoordinates(address: Address | string): {latitude: number; longitude: number} | null {
        if (typeof address === 'string') {
            return null;
        }
        return address.coordinates || null;
    }

    /**
     * Check if address has coordinates
     */
    static hasCoordinates(address: Address | string): boolean {
        const coords = this.getCoordinates(address);
        return coords !== null && coords.latitude !== 0 && coords.longitude !== 0;
    }

    /**    /**
     * Convert string address to Address object for API compatibility
     */
    static normalizeAddressForApi(address: string | Address): Address {
        if (typeof address === 'string') {
            return {
                formattedAddress: address,
                city: this.extractCityFromString(address),
                country: this.extractCountryFromString(address)
            };
        }
        return address;
    }

    /**
     * Convert Google Places result to our Address format
     */
    static fromGooglePlace(placeResult: any): Address {
        if (!placeResult) {
            return {
                formattedAddress: '',
                city: 'Unknown',
                country: 'Unknown'
            };
        }

        const address: Address = {
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
            const match = placeResult.street_address.match(/^(\d+)\s+(.+)$/);
            if (match) {
                address.streetNumber = match[1];
                address.streetName = match[2];
            } else {
                address.streetName = placeResult.street_address;
            }
        }

        // Set city, state, etc.
        if (placeResult.city) address.city = placeResult.city;
        if (placeResult.state) address.state = placeResult.state;
        if (placeResult.country) address.country = placeResult.country;
        if (placeResult.postal_code) address.postalCode = placeResult.postal_code;

        // Ensure required fields have values (per server IAddress interface requirements)
        if (!address.city) address.city = 'Unknown';
        if (!address.country) address.country = 'Unknown';
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
    }    /**
     * Extract city from address string (simple heuristic)
     */
    static extractCityFromString(address: string): string {
        const trimmed = address.trim();
        if (trimmed.length < 50 && !trimmed.includes(',')) {
            return trimmed;
        }
        const parts = trimmed.split(',');
        return parts.length > 1 ? parts[parts.length - 2].trim() : trimmed;
    }

    /**
     * Extract country from address string (simple heuristic)
     */
    static extractCountryFromString(address: string): string {
        const trimmed = address.trim();
        if (trimmed.length < 50 && !trimmed.includes(',')) {
            return trimmed;
        }
        const parts = trimmed.split(',');
        return parts[parts.length - 1].trim();
    }

    /**
     * Generate Google Maps URL for coordinates
     */
    static getGoogleMapsUrl(address: Address | string): string | null {
        const coords = this.getCoordinates(address);
        if (coords) {
            return `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
        }
        
        const formattedAddress = this.getFormattedAddress(address);
        if (formattedAddress) {
            return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formattedAddress)}`;
        }
        
        return null;
    }

    /**
     * Get display address for UI components
     */
    static getDisplayAddress(address: Address | string): string {
        if (typeof address === 'string') {
            return address;
        }
        
        // Build a nice display format
        const parts: string[] = [];
        
        if (address.streetNumber && address.streetName) {
            parts.push(`${address.streetNumber} ${address.streetName}`);
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
    }
}
