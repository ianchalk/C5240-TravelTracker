import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TripproxyService } from '../tripproxy.service';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-locations',
  standalone: false,
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.css'
})
export class LocationsComponent {
 name: string = "";
  tripId: string;
  locationItems: any;

  constructor(
    private route: ActivatedRoute,
    private list$: TripproxyService,
    private location: LocationStrategy
  ) { 
    this.tripId = route.snapshot.params['id'];
    const state = location.getState() as {name:string};
    if (state != null) {
      this.name = state.name;
    } else {
      this.name = "";
    }
    this.list$.getItems(this.tripId).subscribe((res: any) => {
      this.locationItems = res;
    });
  }

  ngOnInit():void {}

}