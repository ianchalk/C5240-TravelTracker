import * as https from 'https';

export interface GoogleMapsGeocodingResult {
    formattedAddress: string;
    streetNumber?: string;
    streetName?: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    placeId: string;
    types: string[];
}

export class GoogleMapsService {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    /**
     * Geocode an address using Google Maps Geocoding API
     * @param address - The address string to geocode
     * @returns Promise with geocoding result
     */
    public async geocodeAddress(address: string): Promise<GoogleMapsGeocodingResult | null> {
        if (!this.apiKey) {
            console.warn('Google Maps API key not configured. Skipping geocoding.');
            return null;
        }

        try {
            const encodedAddress = encodeURIComponent(address);
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${this.apiKey}`;

            const response = await this.makeHttpsRequest(url);
            const data = JSON.parse(response);

            if (data.status === 'OK' && data.results && data.results.length > 0) {
                const result = data.results[0];
                return this.parseGeocodingResult(result);
            } else {
                console.warn(`Geocoding failed for address: ${address}. Status: ${data.status}`);
                return null;
            }
        } catch (error) {
            console.error('Error geocoding address:', error);
            return null;
        }
    }

    /**
     * Reverse geocode coordinates to get address information
     * @param latitude - Latitude coordinate
     * @param longitude - Longitude coordinate
     * @returns Promise with geocoding result
     */
    public async reverseGeocode(latitude: number, longitude: number): Promise<GoogleMapsGeocodingResult | null> {
        if (!this.apiKey) {
            console.warn('Google Maps API key not configured. Skipping reverse geocoding.');
            return null;
        }

        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${this.apiKey}`;

            const response = await this.makeHttpsRequest(url);
            const data = JSON.parse(response);

            if (data.status === 'OK' && data.results && data.results.length > 0) {
                const result = data.results[0];
                return this.parseGeocodingResult(result);
            } else {
                console.warn(`Reverse geocoding failed for coordinates: ${latitude}, ${longitude}. Status: ${data.status}`);
                return null;
            }
        } catch (error) {
            console.error('Error reverse geocoding coordinates:', error);
            return null;
        }
    }

    /**
     * Parse Google Maps API geocoding result into our standard format
     */
    private parseGeocodingResult(result: any): GoogleMapsGeocodingResult {
        const addressComponents = result.address_components || [];
        const geometry = result.geometry || {};
        const location = geometry.location || {};

        // Extract address components
        const getComponent = (types: string[]) => {
            const component = addressComponents.find((comp: any) => 
                comp.types.some((type: string) => types.includes(type))
            );
            return component ? component.long_name : '';
        };

        const getShortComponent = (types: string[]) => {
            const component = addressComponents.find((comp: any) => 
                comp.types.some((type: string) => types.includes(type))
            );
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
    }

    /**
     * Make HTTPS request to Google Maps API
     */
    private makeHttpsRequest(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const request = https.get(url, (response) => {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    resolve(data);
                });
            });

            request.on('error', (error) => {
                reject(error);
            });

            request.setTimeout(10000, () => {
                request.destroy();
                reject(new Error('Request timeout'));
            });
        });
    }

    /**
     * Get static map image URL for displaying maps
     * @param addresses - Array of address objects with coordinates
     * @param width - Map width in pixels (default: 600)
     * @param height - Map height in pixels (default: 400)
     * @param zoom - Map zoom level (default: 10)
     * @returns Static map image URL
     */
    public getStaticMapUrl(
        addresses: Array<{coordinates?: {latitude: number; longitude: number}, formattedAddress: string}>,
        width: number = 600,
        height: number = 400,
        zoom: number = 10
    ): string {
        if (!this.apiKey) {
            // Return a placeholder image if no API key
            return `https://via.placeholder.com/${width}x${height}?text=Map+Not+Available`;
        }

        let url = `https://maps.googleapis.com/maps/api/staticmap?size=${width}x${height}&zoom=${zoom}&key=${this.apiKey}`;

        // Add markers for each location with coordinates
        const markersWithCoords = addresses.filter(addr => addr.coordinates);
        
        if (markersWithCoords.length > 0) {
            markersWithCoords.forEach((addr, index) => {
                if (addr.coordinates) {
                    url += `&markers=color:red%7Clabel:${index + 1}%7C${addr.coordinates.latitude},${addr.coordinates.longitude}`;
                }
            });
        } else {
            // If no coordinates, try to use the first formatted address
            if (addresses.length > 0) {
                const encodedAddress = encodeURIComponent(addresses[0].formattedAddress);
                url += `&markers=color:red%7C${encodedAddress}`;
            }
        }

        return url;
    }
}
