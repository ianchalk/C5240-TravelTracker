import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent {
  constructor(private router: Router) {}

  viewTripDetail(index: number) {
    // Use trip ID from the dummyTrips array
    const tripId = this.dummyTrips[index].id;
    this.router.navigate(['/tripdetail', tripId]);
  }
  dummyTrips = [
    { id: '1', name: 'Vancouver Adventure', location: 'Canada', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
    { id: '2', name: 'Cancun Escape', location: 'Mexico', image: 'https://images.unsplash.com/photo-1465156799763-2c087c332922?auto=format&fit=crop&w=400&q=80' },
    { id: '3', name: 'Hawaii Paradise', location: 'USA', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80' },
    { id: '4', name: 'Banff National Park', location: 'Canada', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80' },
    { id: '5', name: 'Tokyo Lights', location: 'Japan', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
    { id: '6', name: 'Paris Getaway', location: 'France', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=400&q=80' },
    { id: '7', name: 'Sydney Shores', location: 'Australia', image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80' },
    { id: '8', name: 'Rome History', location: 'Italy', image: 'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?auto=format&fit=crop&w=400&q=80' },
    { id: '9', name: 'London Calling', location: 'UK', image: 'https://static.leonardo-hotels.com/image/london-cityguide-do_2e0b957996a4658e2a9e7e15ced9d75c_2048x1049_desktop_2.webp' },
    { id: '10', name: 'New York Vibes', location: 'USA', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
    { id: '11', name: 'Barcelona Sun', location: 'Spain', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
    { id: '12', name: 'Cape Town', location: 'South Africa', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
    { id: '13', name: 'Rio Carnival', location: 'Brazil', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
    { id: '14', name: 'Dubai Luxury', location: 'UAE', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
    { id: '15', name: 'Bangkok Buzz', location: 'Thailand', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
    { id: '16', name: 'Santorini Views', location: 'Greece', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' }
  ];
}
