import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomepageComponent } from './welcomepage/welcomepage.component';
import { TripsComponent } from './trips/trips.component';
import { TripDetailComponent } from './tripdetail/tripdetail.component';

export const routes: Routes = [
  { path: '', component: WelcomepageComponent },
  { path: 'trips', component: TripsComponent },
  { 
    path: 'add-trips', 
    loadComponent: () => import('./add-trip/add-trip.component').then(m => m.AddTripComponent)
  },
  { 
    path: 'tripdetail/:tripId/add-place', 
    loadComponent: () => import('./add-place/add-place.component').then(c => c.AddPlaceComponent)
  },
  { path: 'tripdetail', component: TripDetailComponent },
  { path: 'tripdetail/:id', component: TripDetailComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
