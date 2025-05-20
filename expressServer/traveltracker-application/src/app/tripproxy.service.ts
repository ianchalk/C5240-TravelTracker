import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TripproxyService {

  hostUrl:string = 'https://traveltracker2025.azurewebsites.net/';
  //hostUrl:string = 'http://localhost:8080/';

  constructor(private httpClient: HttpClient) { }

  getListsIndex() {
    return this.httpClient.get<any[]>( this.hostUrl + 'trip');
  }

  getItems(index: string) {
    return this.httpClient.get( this.hostUrl + 'trip/' + index + '/locations');
  }
}