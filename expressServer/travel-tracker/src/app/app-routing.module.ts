import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomepageComponent } from './welcomepage/welcomepage.component';
import { TripsComponent } from './trips/trips.component';
import { TripDetailComponent } from './tripdetail/tripdetail.component';

export const routes: Routes = [
  { path: '', component: WelcomepageComponent },
  { path: 'trips', component: TripsComponent },
  { path: 'tripdetail', component: TripDetailComponent },
  { path: 'tripdetail/:id', component: TripDetailComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
