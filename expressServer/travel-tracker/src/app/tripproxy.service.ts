import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TripproxyService {
  // Allow switching between Azure and local development
  azureUrl: string = 'https://traveltracker2025.azurewebsites.net/';
  localUrl: string = 'http://localhost:8080/';
  hostUrl: string = this.localUrl; // Default to local since it's working

  constructor(private httpClient: HttpClient) { }

  getListsIndex(): Observable<any[]> {
    console.log('TripproxyService: Getting list index from:', this.hostUrl + 'trip');
    return this.httpClient.get<any[]>(this.hostUrl + 'trip')
      .pipe(
        tap(data => console.log('TripproxyService: Data received:', data)),
        catchError(error => {
          console.error('Error fetching trips from primary endpoint:', error);
          // Try the other endpoint if the first one fails
          if (this.hostUrl === this.azureUrl) {
            console.log('Trying local endpoint instead...');
            return this.httpClient.get<any[]>(this.localUrl + 'trip')
              .pipe(
                tap(data => console.log('TripproxyService: Data received from backup endpoint:', data)),
                catchError(localError => {
                  console.error('Error fetching trips from backup endpoint:', localError);
                  return of([]);
                })
              );
          }
          return of([]);
        })
      );
  }

  getItems(index: string): Observable<any> {
    return this.httpClient.get(this.hostUrl + 'trip/' + index + '/locations')
      .pipe(
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
    return this.httpClient.post<any>(this.hostUrl + 'trip/' + placeData.tripId + '/locations/create', placeData)
      .pipe(
        tap(data => console.log('TripproxyService: Place created successfully:', data)),
        catchError(error => {
          console.error('Error creating place for trip:', error);
          return of({ success: false, error: error.message });
        })
      );
  }

  // Upload photos (placeholder for future implementation)
  uploadPhoto(photo: File): Observable<any> {
    // This would typically use FormData and a file upload endpoint
    // For now, return a mock implementation
    console.log('TripproxyService: Photo upload requested for:', photo.name);
    return of({ success: true, photoUrl: 'mock-photo-url' });
  }
}
