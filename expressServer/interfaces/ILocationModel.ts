import Mongoose = require("mongoose");

// Enhanced address interface for Google Maps compatibility
interface IAddress {
    formattedAddress: string;        // Full formatted address string
    streetNumber?: string;           // Street number
    streetName?: string;             // Street name
    city: string;                    // City name
    state?: string;                  // State/province
    country: string;                 // Country name
    postalCode?: string;             // Postal/ZIP code
    coordinates?: {                  // GPS coordinates
        latitude: number;
        longitude: number;
    };
    placeId?: string;               // Google Places API Place ID
    types?: string[];               // Google Places types array
}

interface ILocationModel extends Mongoose.Document {
    tripId: string;
    locations: [ {
        name: string;
        address: IAddress;              // Enhanced address structure
        description: string;
        startDate: Date;
        endDate: Date;
        duration: number;
        notes: string;
        photos: string[];
        dates: Date[];                  // Keeping for backward compatibility
        cost: number;
    }];
}
export {ILocationModel, IAddress};