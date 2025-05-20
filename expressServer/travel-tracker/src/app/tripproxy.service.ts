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
}
