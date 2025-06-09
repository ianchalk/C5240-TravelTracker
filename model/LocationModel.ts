import * as Mongoose from "mongoose";
import {ILocationModel} from '../interfaces/ILocationModel';

class LocationModel {
    public schema:any;
    public model:any;
    public dbConnectionString:string;

    public constructor(DB_CONNECTION_STRING:string) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }

    public createSchema() {
        this.schema = new Mongoose.Schema(
            {
                tripId: String,
                locations: [ {
                    name: String,
                    address: {
                        formattedAddress: { type: String, required: true },
                        streetNumber: String,
                        streetName: String,
                        city: { type: String, required: true },
                        state: String,
                        country: { type: String, required: true },
                        postalCode: String,
                        coordinates: {
                            latitude: Number,
                            longitude: Number
                        },
                        placeId: String,  // Google Places API Place ID
                        types: [String]   // Google Places types array
                    },
                    description: String,
                    startDate: Date,
                    endDate: Date,
                    duration: Number, // calculated field in days
                    notes: String, // separate from description for user notes
                    photos: [String], // array of photo URLs/paths
                    dates: [Date], // keeping for backward compatibility
                    cost: Number
                }]
            }, {collection: 'locations'}
        );    
    }

    public async createModel() {
        try {
            await Mongoose.connect(this.dbConnectionString);
            this.model = Mongoose.model<ILocationModel>("Locations", this.schema);
        }
        catch (e) {
            console.error(e);
        }
    }

    // Create location
    public async createLocation(response: any, locationData: any) {
        try {
            console.log('=== CREATE LOCATION DEBUG ===');
            console.log('Input locationData:', JSON.stringify(locationData, null, 2));
            
            if (!locationData.tripId) {
                return response.status(400).json({ error: "tripId is required" });
            }

            // Calculate duration if startDate and endDate are provided
            let duration = 0;
            if (locationData.startDate && locationData.endDate) {
                const start = new Date(locationData.startDate);
                const end = new Date(locationData.endDate);
                duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            }
    
            console.log('Raw address data:', JSON.stringify(locationData.address, null, 2));
            
            // Normalize address input to new format
            const normalizedAddress = this.normalizeAddressInput(locationData.address);
            console.log('Normalized address result:', JSON.stringify(normalizedAddress, null, 2));
            
            if (!normalizedAddress) {
                console.log('ERROR: normalizeAddressInput returned null/undefined');
                return response.status(400).json({ error: "Invalid address format" });
            }
            
            // Validate required fields
            if (!normalizedAddress.formattedAddress) {
                console.log('ERROR: Missing formattedAddress');
                return response.status(400).json({ error: "formattedAddress is required" });
            }
            if (!normalizedAddress.city) {
                console.log('ERROR: Missing city');
                return response.status(400).json({ error: "city is required" });
            }
            if (!normalizedAddress.country) {
                console.log('ERROR: Missing country');
                return response.status(400).json({ error: "country is required" });
            }
    
            // Try to find and update existing trip
            const result = await this.model.findOneAndUpdate(
                { tripId: locationData.tripId },
                {
                    $push: {
                        locations: {
                            name: locationData.name,
                            address: normalizedAddress,
                            description: locationData.description,
                            startDate: locationData.startDate,
                            endDate: locationData.endDate,
                            duration: duration,
                            notes: locationData.notes,
                            photos: locationData.photos || [],
                            dates: locationData.dates,
                            cost: locationData.cost || 0
                        }
                    }
                },
                {
                    new: true,       // Return updated document
                    upsert: true,     // Create if doesn't exist
                    runValidators: true, // Validate against schema
                    setDefaultsOnInsert: true
                }
            );
    
            // Send appropriate status code (201 for created, 200 for updated)
            response.status(result ? 200 : 201).json(result);
        } catch (e) {
            console.error(e);
            response.status(500).json({ 
                error: "Failed to save location",
                details: e instanceof Error ? e.message : "Unknown error"
            });
        }
    }

    // Create location without sending HTTP response (for use in composite operations)
    public async createLocationWithoutResponse(locationData: any) {
        try {
            console.log('=== CREATE LOCATION WITHOUT RESPONSE DEBUG ===');
            console.log('Input locationData:', JSON.stringify(locationData, null, 2));
            
            if (!locationData.tripId) {
                return { success: false, error: "tripId is required" };
            }

            // Calculate duration if startDate and endDate are provided
            let duration = 0;
            if (locationData.startDate && locationData.endDate) {
                const start = new Date(locationData.startDate);
                const end = new Date(locationData.endDate);
                duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            }
    
            console.log('Raw address data:', JSON.stringify(locationData.address, null, 2));
            
            // Normalize address input to new format
            const normalizedAddress = this.normalizeAddressInput(locationData.address);
            console.log('Normalized address result:', JSON.stringify(normalizedAddress, null, 2));
            
            if (!normalizedAddress) {
                console.log('ERROR: normalizeAddressInput returned null/undefined');
                return { success: false, error: "Invalid address format" };
            }
            
            // Validate required fields
            if (!normalizedAddress.formattedAddress) {
                console.log('ERROR: Missing formattedAddress');
                return { success: false, error: "formattedAddress is required" };
            }
            if (!normalizedAddress.city) {
                console.log('ERROR: Missing city');
                return { success: false, error: "city is required" };
            }
            if (!normalizedAddress.country) {
                console.log('ERROR: Missing country');
                return { success: false, error: "country is required" };
            }
    
            // Try to find and update existing trip
            const result = await this.model.findOneAndUpdate(
                { tripId: locationData.tripId },
                {
                    $push: {
                        locations: {
                            name: locationData.name,
                            address: normalizedAddress,
                            description: locationData.description,
                            startDate: locationData.startDate,
                            endDate: locationData.endDate,
                            duration: duration,
                            notes: locationData.notes,
                            photos: locationData.photos || [],
                            dates: locationData.dates,
                            cost: locationData.cost || 0
                        }
                    }
                },
                {
                    new: true,       // Return updated document
                    upsert: true,     // Create if doesn't exist
                    runValidators: true, // Validate against schema
                    setDefaultsOnInsert: true
                }
            );
    
            return { success: true, data: result };
        } catch (e) {
            console.error(e);
            return { 
                success: false, 
                error: "Failed to save location",
                details: e instanceof Error ? e.message : "Unknown error"
            };
        }
    }

    // Retrieve all locations for a trip
    public async retrieveLocationsDetails(response:any, filter:Object) {
        var query = this.model.findOne(filter);
        try {
            const itemArray = await query.exec();
            response.json(itemArray);
        }
        catch (e) {
            console.error(e);
        }
    }

    // Retrieve a specific location within a trip
    public async retrieveSingleLocationDetail(response: any, tripId: string, locationName: string) {
        try {
            const result = await this.model.findOne(
                { tripId: tripId, "locations.name": locationName },
                { "locations.$": 1 }
            );
    
            if (!result || !result.locations || result.locations.length === 0) {
                return response.status(404).json({ error: "Location not found" });
            }
    
            response.json(result.locations[0]);
        } catch (e) {
            console.error(e);
            response.status(500).json({ error: "Server error" });
        }
    }

    public async retrieveLocationsCount(response:any, filter:Object) {
        var query = this.model.findOne(filter);
        try {
            const innerLocationList = await query.exec();
            if (innerLocationList == null) {
                response.status(404);
                response.json('{count: -1}');
            }
            else {
                console.log('number of locations: ' + innerLocationList.locations.length);
                response.json('{count:' + innerLocationList.locations.length + '}');
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    // Delete a location from a trip by index
    public async deleteLocation(response: any, tripId: string, locationIndex: number) {
        try {
            // First, find the trip to get the current locations
            const tripData = await this.model.findOne({ tripId: tripId });
            
            if (!tripData) {
                return response.status(404).json({ error: "Trip not found" });
            }
            
            if (!tripData.locations || tripData.locations.length === 0) {
                return response.status(404).json({ error: "No locations found for this trip" });
            }
            
            if (locationIndex >= tripData.locations.length || locationIndex < 0) {
                return response.status(400).json({ error: "Invalid location index" });
            }
            
            // Remove the location at the specified index
            tripData.locations.splice(locationIndex, 1);
            
            // Save the updated document
            const result = await this.model.findOneAndUpdate(
                { tripId: tripId },
                { $set: { locations: tripData.locations } },
                { new: true }
            );
            
            response.json({ 
                success: true, 
                message: "Location deleted successfully",
                remainingLocations: result.locations.length
            });
            
        } catch (e) {
            console.error('Error deleting location:', e);
            response.status(500).json({ 
                error: "Failed to delete location",
                details: e instanceof Error ? e.message : "Unknown error"
            });
        }
    }

    // Delete all locations for a specific trip
    public async deleteAllLocationsForTrip(response: any, tripId: string) {
        try {
            console.log("Deleting all locations for trip:", tripId);
            
            // Delete all location documents where tripId matches
            const result = await this.model.deleteMany({ tripId: tripId });
            
            console.log("All locations deleted for trip:", tripId, "Count:", result.deletedCount);
            response.json({ 
                success: true, 
                message: `All locations deleted for trip ${tripId}`,
                deletedCount: result.deletedCount
            });
        } catch (e) {
            console.error('Error deleting all locations for trip:', e);
            response.status(500).json({ 
                error: "Failed to delete locations for trip",
                details: e instanceof Error ? e.message : "Unknown error"
            });
        }
    }

    // Helper method that doesn't send response - for use in composite operations
    public async deleteAllLocationsForTripNoResponse(tripId: string) {
        try {
            console.log("Deleting all locations for trip:", tripId);
            
            // Delete all location documents where tripId matches
            const result = await this.model.deleteMany({ tripId: tripId });
            
            console.log("All locations deleted for trip:", tripId, "Count:", result.deletedCount);
            return { 
                success: true, 
                message: `All locations deleted for trip ${tripId}`,
                deletedCount: result.deletedCount
            };
        } catch (e) {
            console.error('Error deleting all locations for trip:', e);
            throw e;
        }
    }

    // Migration helper method to convert string addresses to new format
    public async migrateStringAddresses() {
        try {
            console.log('Starting address migration...');
            
            // Find all locations with string addresses
            const allLocations = await this.model.find({});
            let migratedCount = 0;
            
            for (const locationDoc of allLocations) {
                let hasStringAddresses = false;
                
                // Check if any location has a string address
                for (const location of locationDoc.locations) {
                    if (typeof location.address === 'string') {
                        hasStringAddresses = true;
                        // Convert string address to new format
                        const stringAddress = location.address;
                        location.address = {
                            formattedAddress: stringAddress,
                            city: this.extractCityFromString(stringAddress),
                            country: this.extractCountryFromString(stringAddress),
                            // coordinates will be null until geocoded
                            coordinates: null,
                            placeId: null,
                            types: []
                        };
                    }
                }
                
                if (hasStringAddresses) {
                    await locationDoc.save();
                    migratedCount++;
                    console.log(`Migrated addresses for trip: ${locationDoc.tripId}`);
                }
            }
            
            console.log(`Migration complete. ${migratedCount} documents updated.`);
            return { success: true, migratedCount };
            
        } catch (e) {
            console.error('Error during address migration:', e);
            throw e;
        }
    }
    
    // Helper method to extract city from string address
    private extractCityFromString(address: string): string {
        // Simple heuristic - if it's just a country name, use it as city
        const trimmed = address.trim();
        if (trimmed.length < 50 && !trimmed.includes(',')) {
            return trimmed; // Likely just a country/city name
        }
        // For complex addresses, extract city (this could be enhanced with a geocoding service)
        const parts = trimmed.split(',');
        return parts.length > 1 ? parts[parts.length - 2].trim() : trimmed;
    }
    
    // Helper method to extract country from string address
    private extractCountryFromString(address: string): string {
        const trimmed = address.trim();
        if (trimmed.length < 50 && !trimmed.includes(',')) {
            return trimmed; // Likely just a country name
        }
        // For complex addresses, assume last part is country
        const parts = trimmed.split(',');
        return parts[parts.length - 1].trim();
    }
    
    // Helper method to normalize address input for API calls
    public normalizeAddressInput(addressInput: any): any {
        console.log('Normalizing address input:', addressInput);
        
        // If it's a string, convert to new format
        if (typeof addressInput === 'string') {
            return {
                formattedAddress: addressInput,
                city: this.extractCityFromString(addressInput),
                country: this.extractCountryFromString(addressInput)
            };
        }
        
        // If it's already an object, ensure required fields are present
        if (typeof addressInput === 'object' && addressInput !== null) {
            // Handle the case where we have coordinates in a different format
            let coordinates = null;
            if (addressInput.coordinates) {
                coordinates = {
                    latitude: addressInput.coordinates.latitude || addressInput.coordinates.lat || 0,
                    longitude: addressInput.coordinates.longitude || addressInput.coordinates.lng || 0
                };
            }
            
            const normalizedAddress = {
                formattedAddress: addressInput.formattedAddress || addressInput.formatted_address || '',
                streetNumber: addressInput.streetNumber || '',
                streetName: addressInput.streetName || addressInput.street_address || '',
                city: addressInput.city || this.extractCityFromString(addressInput.formattedAddress || addressInput.formatted_address || ''),
                state: addressInput.state || '',
                country: addressInput.country || this.extractCountryFromString(addressInput.formattedAddress || addressInput.formatted_address || ''),
                postalCode: addressInput.postalCode || addressInput.postal_code || '',
                coordinates: coordinates,
                placeId: addressInput.placeId || addressInput.place_id || '',
                types: addressInput.types || []
            };
            
            // Ensure required fields have values
            if (!normalizedAddress.city) normalizedAddress.city = 'Unknown';
            if (!normalizedAddress.country) normalizedAddress.country = 'Unknown';
            
            console.log('Normalized address:', normalizedAddress);
            return normalizedAddress;
        }
        
        // If all else fails, return a basic valid address object
        return {
            formattedAddress: '',
            city: 'Unknown',
            country: 'Unknown'
        };
    }

    // Geocode addresses for a specific trip
    public async geocodeAddressesForTrip(tripId: string, googleMapsApiKey: string): Promise<any> {
        try {
            if (!googleMapsApiKey) {
                throw new Error('Google Maps API key is required for geocoding');
            }
            
            // Import the GoogleMapsService
            const { GoogleMapsService } = require('../services/GoogleMapsService');
            const mapsService = new GoogleMapsService(googleMapsApiKey);
            
            // Find the trip
            const tripData = await this.model.findOne({ tripId: tripId });
            
            if (!tripData) {
                return { success: false, message: 'Trip not found' };
            }
            
            let geocodedCount = 0;
            
            // Process each location
            for (const location of tripData.locations) {
                // Skip if already has coordinates
                if (location.address?.coordinates?.latitude && location.address?.coordinates?.longitude) {
                    continue;
                }
                
                // Geocode the address
                const formattedAddress = location.address.formattedAddress || 
                    `${location.address.city}, ${location.address.country}`;
                    
                const geocodingResult = await mapsService.geocodeAddress(formattedAddress);
                
                if (geocodingResult) {
                    // Update address with geocoding results
                    location.address = {
                        ...location.address,
                        ...geocodingResult
                    };
                    geocodedCount++;
                    
                    // Add a small delay to respect API rate limits
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
            
            // Save the updated trip
            if (geocodedCount > 0) {
                await tripData.save();
            }
            
            return { 
                success: true, 
                message: `Successfully geocoded ${geocodedCount} locations`,
                geocodedCount 
            };
            
        } catch (error) {
            console.error('Error geocoding addresses:', error);
            throw error;
        }
    }
    
    // Get static map URL for a trip
    public getMapUrlForTrip(tripId: string, googleMapsApiKey: string, width = 600, height = 400): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!googleMapsApiKey) {
                    resolve(`https://via.placeholder.com/${width}x${height}?text=Map+Not+Available`);
                    return;
                }
                
                // Import the GoogleMapsService
                const { GoogleMapsService } = require('../services/GoogleMapsService');
                const mapsService = new GoogleMapsService(googleMapsApiKey);
                
                // Find the trip
                const tripData = await this.model.findOne({ tripId: tripId });
                
                if (!tripData || !tripData.locations || tripData.locations.length === 0) {
                    resolve(`https://via.placeholder.com/${width}x${height}?text=No+Locations`);
                    return;
                }
                
                // Create array of addresses for the map
                const addresses = tripData.locations.map(loc => ({
                    coordinates: loc.address.coordinates,
                    formattedAddress: loc.address.formattedAddress
                }));
                
                // Get map URL
                const mapUrl = mapsService.getStaticMapUrl(addresses, width, height);
                resolve(mapUrl);
                
            } catch (error) {
                console.error('Error generating map URL:', error);
                reject(error);
            }
        });
    }
}
export {LocationModel};