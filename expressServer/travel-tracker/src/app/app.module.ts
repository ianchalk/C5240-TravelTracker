import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TripproxyService } from './tripproxy.service';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TripproxyService {
  constructor(private http: HttpClient) { }
}

// This module is only needed for backwards compatibility
// The application is now using standalone components approach
@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    TripproxyService
  ],
  bootstrap: []
})
export class AppModule { }
