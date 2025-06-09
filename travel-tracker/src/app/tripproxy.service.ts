import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TripproxyService {
  // Allow switching between Azure and local development
  azureUrl: string = 'https://traveltracker2025.azurewebsites.net/';
  localUrl: string = 'http://localhost:8080/';
  hostUrl: string = this.azureUrl; // Using azure URL by default

  constructor(private httpClient: HttpClient) { }

  getListsIndex(): Observable<any[]> {
    console.log('TripproxyService: Getting list index from:', this.hostUrl + 'trip');
    
    return this.httpClient.get<any[]>(this.hostUrl + 'trip')
      .pipe(
        tap(data => {
          console.log('TripproxyService: Raw response:', data);
          console.log('TripproxyService: Response type:', typeof data);
          console.log('TripproxyService: Is array:', Array.isArray(data));
          console.log('TripproxyService: Response length:', data ? data.length : 'null/undefined');
        }),
        catchError(error => {
          console.error('Error fetching trips from primary endpoint:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error statusText:', error.statusText);
          return of([]);
        })
      );
  }

  // Get individual trip details by ID (works for both public and private trips)
  getTripById(tripId: string): Observable<any> {
    console.log('TripproxyService: Getting trip details for ID:', tripId);
    const url = this.hostUrl + 'trip/' + tripId;
    console.log('TripproxyService: Request URL:', url);
    
    return this.httpClient.get<any>(url)
      .pipe(
        tap(data => {
          console.log('TripproxyService: Trip details received:', data);
          console.log('TripproxyService: Trip type:', typeof data);
        }),
        catchError(error => {
          console.error('TripproxyService: Error fetching trip details:', error);
          console.error('TripproxyService: Error status:', error.status);
          console.error('TripproxyService: Error message:', error.message);
          return throwError(error);
        })
      );
  }

  getItems(index: string): Observable<any> {
    console.log('TripproxyService: Getting items for tripId:', index);
    console.log('TripproxyService: Full URL:', this.hostUrl + 'trip/' + index + '/locations');
    
    return this.httpClient.get(this.hostUrl + 'trip/' + index + '/locations')
      .pipe(
        tap(data => console.log('TripproxyService: Fresh location data received:', data)),
        catchError(error => {
          console.error('Error fetching trip details from primary endpoint:', error);
          // Try the other endpoint if the first one fails
          if (this.hostUrl === this.azureUrl) {
            console.log('Trying local endpoint instead...');
            return this.httpClient.get(this.localUrl + 'trip/' + index + '/locations')
              .pipe(
                catchError(localError => {
                  console.error('Error fetching trip details from backup endpoint:', localError);
                  return of(null);
                })
              );
          }
          return of(null);
        })
      );
  }

  // Create a new trip with places
  createTripWithPlaces(tripData: any): Observable<any> {
    console.log('TripproxyService: Creating trip with places:', tripData);
    return this.httpClient.post<any>(this.hostUrl + 'trip/create-with-places', tripData)
      .pipe(
        tap(data => console.log('TripproxyService: Trip created successfully:', data)),
        catchError(error => {
          console.error('Error creating trip with places:', error);
          return of({ success: false, error: error.message });
        })
      );
  }

  // Create a new place for an existing trip
  createPlaceForTrip(placeData: any): Observable<any> {
    console.log('TripproxyService: Creating place for trip:', placeData);
    const url = this.hostUrl + 'trip/' + placeData.tripId + '/locations/create';
    console.log('TripproxyService: Request URL:', url);
    
    // Extract the tripId from the data since the backend gets it from URL parameter
    const { tripId, ...locationData } = placeData;
    console.log('TripproxyService: Request payload (without tripId):', JSON.stringify(locationData, null, 2));
    
    return this.httpClient.post<any>(url, locationData)
      .pipe(
        tap(data => {
          console.log('TripproxyService: Place created successfully:', data);
          console.log('TripproxyService: Response type:', typeof data);
        }),
        catchError(error => {
          console.error('TripproxyService: Error creating place for trip:', error);
          console.error('TripproxyService: Error status:', error.status);
          console.error('TripproxyService: Error statusText:', error.statusText);
          console.error('TripproxyService: Error error:', error.error);
          // Re-throw the error so the component can handle it
          throw error;
        })
      );
  }

  // Upload photos - convert File objects to Base64 strings for storage
  uploadPhotos(photos: File[]): Observable<string[]> {
    if (!photos || photos.length === 0) {
      return of([]);
    }

    // Convert File objects to Base64 strings
    const photoPromises = photos.map((file: File) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            resolve(reader.result as string);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(new Error('Error reading file'));
        reader.readAsDataURL(file);
      });
    });

    return new Observable<string[]>((observer) => {
      Promise.all(photoPromises)
        .then((base64Strings) => {
          console.log('TripproxyService: Photos converted to Base64 successfully');
          observer.next(base64Strings);
          observer.complete();
        })
        .catch((error) => {
          console.error('TripproxyService: Error converting photos:', error);
          observer.error(error);
        });
    });
  }

  // Upload single photo (placeholder for future implementation)
  uploadPhoto(photo: File): Observable<any> {
    // This would typically use FormData and a file upload endpoint
    // For now, return a mock implementation
    console.log('TripproxyService: Photo upload requested for:', photo.name);
    return of({ success: true, photoUrl: 'mock-photo-url' });
  }

  // Delete a location from a trip
  deleteLocation(tripId: string, locationIndex: number): Observable<any> {
    console.log('TripproxyService: Deleting location at index', locationIndex, 'from trip:', tripId);
    const url = this.hostUrl + 'trip/' + tripId + '/locations/' + locationIndex;
    console.log('TripproxyService: DELETE URL:', url);
    
    return this.httpClient.delete<any>(url)
      .pipe(
        tap(data => {
          console.log('TripproxyService: Location deleted successfully:', data);
        }),
        catchError(error => {
          console.error('TripproxyService: Error deleting location:', error);
          console.error('TripproxyService: Error status:', error.status);
          console.error('TripproxyService: Error statusText:', error.statusText);
          console.error('TripproxyService: Error error:', error.error);
          // Re-throw the error so the component can handle it
          throw error;
        })
      );
  }

  // Delete an entire trip along with all its locations
  deleteTrip(tripId: string): Observable<any> {
    console.log('TripproxyService: Deleting entire trip:', tripId);
    const url = this.hostUrl + 'trip/' + tripId;
    console.log('TripproxyService: DELETE URL:', url);
    
    return this.httpClient.delete<any>(url)
      .pipe(
        tap(data => {
          console.log('TripproxyService: Trip deleted successfully:', data);
        }),
        catchError(error => {
          console.error('TripproxyService: Error deleting trip:', error);
          console.error('TripproxyService: Error status:', error.status);
          console.error('TripproxyService: Error statusText:', error.statusText);
          console.error('TripproxyService: Error error:', error.error);
          // Re-throw the error so the component can handle it
          throw error;
        })
      );
  }

  // Add photos to an existing place
  addPhotosToPlace(tripId: string, placeIndex: number, photos: string[]): Observable<any> {
    console.log('TripproxyService: Adding photos to place:', { tripId, placeIndex, photoCount: photos.length });
    
    // Get the current place data first
    return this.getItems(tripId).pipe(
      switchMap(tripData => {
        console.log('TripproxyService: Raw tripData received:', tripData);
        
        // Extract the current place data - handle different data structures
        let locations;
        if (tripData && tripData.locations) {
          locations = tripData.locations;
        } else if (Array.isArray(tripData)) {
          locations = tripData;
        } else {
          console.error('TripproxyService: Unexpected data structure:', tripData);
          return throwError(() => new Error('Invalid trip data structure'));
        }
        
        if (!locations || !Array.isArray(locations) || !locations[placeIndex]) {
          console.error('TripproxyService: Place not found at index:', placeIndex, 'in locations:', locations);
          return throwError(() => new Error('Place not found'));
        }
        
        const currentPlace = locations[placeIndex];
        const existingPhotos = currentPlace.photos || [];
        const updatedPhotos = [...existingPhotos, ...photos];
        
        console.log('TripproxyService: Current place:', currentPlace);
        console.log('TripproxyService: Existing photos:', existingPhotos.length);
        console.log('TripproxyService: Adding photos:', photos.length);
        
        // Try to use a direct update endpoint if available
        const updatePayload = {
          photos: updatedPhotos
        };
        
        console.log('TripproxyService: Attempting direct photo update with payload:', updatePayload);
        
        // First try to update photos directly
        return this.httpClient.put<any>(`${this.hostUrl}trip/${tripId}/locations/${placeIndex}/photos`, updatePayload)
          .pipe(
            tap(data => {
              console.log('TripproxyService: Photos updated successfully via direct endpoint:', data);
            }),
            catchError(updateError => {
              console.log('TripproxyService: Direct update failed, falling back to replace method:', updateError);
              
              // Fallback: Replace the entire location
              const locationData = {
                name: currentPlace.name,
                address: currentPlace.address || '',
                description: currentPlace.description || '',
                startDate: currentPlace.startDate,
                endDate: currentPlace.endDate,
                notes: currentPlace.notes || '',
                photos: updatedPhotos,
                cost: currentPlace.cost || 0
              };
              
              console.log('TripproxyService: Replacing location with data:', locationData);
              
              // Use PUT to replace the location (safer than delete+create)
              return this.httpClient.put<any>(`${this.hostUrl}trip/${tripId}/locations/${placeIndex}`, locationData)
                .pipe(
                  tap(data => {
                    console.log('TripproxyService: Location replaced successfully:', data);
                  }),
                  catchError(replaceError => {
                    console.error('TripproxyService: Failed to replace location:', replaceError);
                    
                    // Last resort: delete and recreate (original logic but with better error handling)
                    return this.httpClient.delete<any>(`${this.hostUrl}trip/${tripId}/locations/${placeIndex}`)
                      .pipe(
                        switchMap(() => {
                          const createData = { tripId, ...locationData };
                          return this.httpClient.post<any>(`${this.hostUrl}trip/${tripId}/locations/create`, createData);
                        }),
                        tap(data => {
                          console.log('TripproxyService: Location recreated successfully:', data);
                        }),
                        catchError(recreateError => {
                          console.error('TripproxyService: Failed to recreate location:', recreateError);
                          return throwError(() => recreateError);
                        })
                      );
                  })
                );
            })
          );
      }),
      catchError(error => {
        console.error('TripproxyService: Error in addPhotosToPlace:', error);
        return throwError(() => error);
      })
    );
  }

  // Search public trips by name
  searchPublicTrips(searchQuery: string): Observable<any[]> {
    console.log('TripproxyService: Searching public trips with query:', searchQuery);
    const url = `${this.hostUrl}trip/search?q=${encodeURIComponent(searchQuery)}`;
    console.log('TripproxyService: Search URL:', url);
    
    return this.httpClient.get<any[]>(url)
      .pipe(
        tap(data => {
          console.log('TripproxyService: Search results received:', data);
          console.log('TripproxyService: Number of results:', data ? data.length : 0);
        }),
        catchError(error => {
          console.error('TripproxyService: Error searching trips:', error);
          console.error('TripproxyService: Error status:', error.status);
          console.error('TripproxyService: Error message:', error.message);
          return of([]);
        })
      );
  }
}
