import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GooglePlacesAutocompleteService {
  private autocompleteService: any = null;
  private placesService: any = null;
  private isGoogleMapsLoaded = false;
  
  constructor() {
    this.loadGoogleMapsAPI();
  }

  private async loadGoogleMapsAPI(): Promise<void> {
    try {
      // Check if Google Maps is already loaded
      if (typeof google !== 'undefined' && google.maps) {
        this.initializeServices();
        return;
      }

      // Create script element to load Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      // Create a promise to wait for script load
      const scriptPromise = new Promise<void>((resolve, reject) => {
        script.onload = () => {
          console.log('Google Maps API loaded successfully');
          resolve();
        };
        
        script.onerror = (error) => {
          console.error('Failed to load Google Maps API:', error);
          reject(error);
        };
      });
      
      // Add script to document
      document.head.appendChild(script);
      
      // Wait for script to load
      await scriptPromise;
      this.initializeServices();
    } catch (error) {
      console.error('Error loading Google Maps API:', error);
    }
  }

  private initializeServices(): void {
    try {
      if (typeof google !== 'undefined' && google.maps && google.maps.places) {
        this.autocompleteService = new google.maps.places.AutocompleteService();
        
        // Create a dummy div for PlacesService (required by Google Maps API)
        const dummyDiv = document.createElement('div');
        const map = new google.maps.Map(dummyDiv);
        this.placesService = new google.maps.places.PlacesService(map);
        
        this.isGoogleMapsLoaded = true;
        console.log('Google Places services initialized successfully');
      } else {
        console.error('Google Maps API loaded but places library is not available');
      }
    } catch (error) {
      console.error('Error initializing Google Places services:', error);
    }
  }

  /**
   * Get place predictions based on input text
   */
  async getPlacePredictions(input: string): Promise<PlacePrediction[]> {
    return new Promise((resolve, reject) => {
      if (!this.isGoogleMapsLoaded || !this.autocompleteService) {
        console.warn('Google Maps not loaded yet');
        resolve([]);
        return;
      }

      if (!input || input.length < 2) {
        resolve([]);
        return;
      }

      const request = {
        input: input,
        types: ['geocode', 'establishment'],
        componentRestrictions: undefined // Remove country restriction for global search
      };
      
      this.autocompleteService.getPlacePredictions(request, (predictions: any, status: any) => {
        if (status === 'OK' && predictions) {
          const formattedPredictions: PlacePrediction[] = predictions.map((prediction: any) => ({
            description: prediction.description,
            place_id: prediction.place_id,
            structured_formatting: {
              main_text: prediction.structured_formatting.main_text,
              secondary_text: prediction.structured_formatting.secondary_text || ''
            },
            types: prediction.types
          }));
          resolve(formattedPredictions);
        } else {
          console.warn('Places predictions failed:', status);
          resolve([]);
        }
      });
    });
  }

  /**
   * Get detailed place information by place ID
   */
  async getPlaceDetails(placeId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isGoogleMapsLoaded || !this.placesService) {
        console.warn('Google Maps not loaded yet');
        resolve(null);
        return;
      }

      const request = {
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
      
      this.placesService.getDetails(request, (place: any, status: any) => {
        if (status === 'OK' && place) {
          resolve(place);
        } else {
          console.warn('Place details failed:', status);
          resolve(null);
        }
      });
    });
  }

  /**
   * Convert Google Place to our Address format
   */
  convertPlaceToAddress(place: any): any {
    const addressComponents = place.address_components || [];
    
    // Extract address components
    let streetNumber = '';
    let streetName = '';
    let city = '';
    let state = '';
    let country = '';
    let postalCode = '';
    
    addressComponents.forEach((component: any) => {
      const types = component.types;
      if (types.includes('street_number')) {
        streetNumber = component.long_name;
      } else if (types.includes('route')) {
        streetName = component.long_name;
      } else if (types.includes('locality') || types.includes('administrative_area_level_2')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        state = component.short_name;
      } else if (types.includes('country')) {
        country = component.long_name;
      } else if (types.includes('postal_code')) {
        postalCode = component.long_name;
      }
    });

    const address = {
      formatted_address: place.formatted_address || '',
      street_address: `${streetNumber} ${streetName}`.trim(),
      city: city,
      state: state,
      country: country,
      postal_code: postalCode,
      coordinates: {
        lat: place.geometry?.location?.lat() || 0,
        lng: place.geometry?.location?.lng() || 0
      },
      place_id: place.place_id || '',
      types: place.types || []
    };

    return address;
  }

  /**
   * Check if Google Maps is loaded and ready
   */
  isLoaded(): boolean {
    return this.isGoogleMapsLoaded;
  }
}
