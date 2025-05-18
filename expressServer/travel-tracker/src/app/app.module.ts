import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomepageComponent } from './welcomepage/welcomepage.component';
import { TripsComponent } from './trips/trips.component';
import { TripDetailComponent } from './tripdetail/tripdetail.component';

@NgModule({
  declarations: [
    // Only non-standalone components here
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TripsComponent,
    WelcomepageComponent,
    TripDetailComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
