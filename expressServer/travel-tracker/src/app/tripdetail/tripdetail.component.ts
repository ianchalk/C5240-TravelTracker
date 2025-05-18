import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

interface Place {
  name: string;
  notes: string;
  pictures: string[];
}

interface Trip {
  id: string;
  name: string;
  date: string;
  amountSpent: number;
  endDate: string;
  places: Place[];
}

@Component({
  selector: 'app-tripdetail',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './tripdetail.component.html',
  styleUrls: ['./tripdetail.component.css']
})
export class TripDetailComponent {
  trip: Trip = {
    id: '1',
    name: 'Pacific Northwest Adventure',
    date: '2025-05-01',
    amountSpent: 1200,
    endDate: '2025-05-10',
    places: [
      {
        name: 'Mount Rainier',
        notes: 'Beautiful hike and amazing views.',
        pictures: [
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
          'https://images.unsplash.com/photo-1464983953574-0892a716854b'
        ]
      },
      {
        name: 'Seattle',
        notes: 'Visited Pike Place Market and Space Needle.',
        pictures: [
          'https://images.unsplash.com/photo-1465101046530-73398c7f28ca'
        ]
      },
      {
        name: 'Olympic National Park',
        notes: 'Rainforest and beaches in one day!',
        pictures: [
          'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429'
        ]
      }
    ]
  };
  selectedPlaceIndex = 0;

  selectPlace(index: number) {
    this.selectedPlaceIndex = index;
  }
}
