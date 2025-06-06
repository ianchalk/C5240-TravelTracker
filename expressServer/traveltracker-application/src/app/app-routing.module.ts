import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomepageComponent } from './welcomepage/welcomepage.component';
import { TripsComponent } from './trips/trips.component';
import { LocationsComponent } from './locations/locations.component';


const routes: Routes = [
  { path: '', component: WelcomepageComponent },
  { path: 'trips', component: TripsComponent },
  { path: 'trips/:id', component: LocationsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
