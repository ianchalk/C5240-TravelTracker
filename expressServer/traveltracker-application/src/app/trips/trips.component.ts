import { Component } from '@angular/core';
import { TripproxyService } from '../tripproxy.service';
import { Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-trips',
  standalone: false,
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css'
})

export class TripsComponent {

  displayedColumns: string[] = ['name', 'description'];
  dataSource = new MatTableDataSource<any>();

//  listsObservable: Observable<any[]>;

  constructor(private router: Router, proxy$: TripproxyService) {
//    this.listsObservable = proxy$.getListsIndex();

  proxy$.getListsIndex().subscribe({
    next: (result: any[]) => {
      this.dataSource = new MatTableDataSource<any>(result);
      console.log("retrieved data from server.");
    },
    error: err => {
      console.error("Error fetching trips:", err);
    }
  });
  }

  ngOnInit() {
  }

  clickEvent(): void {
    this.router.navigate(['']);
  }
}