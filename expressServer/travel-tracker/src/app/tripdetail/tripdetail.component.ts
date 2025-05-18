import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

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
  imports: [CommonModule, HeaderComponent, FooterComponent, DatePipe, RouterModule],
  templateUrl: './tripdetail.component.html',
  styleUrls: ['./tripdetail.component.css']
})
export class TripDetailComponent implements OnInit {
  trip: Trip = {
    id: '1',
    name: 'Pacific Northwest Adventure',
    date: '2025-05-01',
    amountSpent: 1200,
    endDate: '2025-05-10',
    places: [
      {
        name: 'Mount Rainier',
        notes: 'Beautiful hike through alpine meadows surrounded by wildflowers. The views from Paradise were absolutely breathtaking! We took the Skyline Trail which was moderate difficulty but well worth the effort. The glacier views were spectacular and we even spotted some wildlife including marmots and deer. Make sure to bring layers as the weather can change quickly even in summer.',
        pictures: [
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1606117331085-5760e3b58520?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1484904943086-34da6c9fcde1?auto=format&fit=crop&w=600&q=80'
        ]
      },
      {
        name: 'Seattle',
        notes: 'Explored the vibrant city of Seattle starting with Pike Place Market where we watched the famous fish throwing and enjoyed local coffee. Visited the Space Needle for panoramic views of the city and Puget Sound. The Chihuly Garden and Glass exhibit was a highlight with incredible glass artwork. Ended the day with a delicious seafood dinner at the waterfront.',
        pictures: [
          'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1538097304804-2a1b932466a9?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1490879112094-281fea0883dc?auto=format&fit=crop&w=600&q=80'
        ]
      },
      {
        name: 'Olympic National Park',
        notes: 'One of the most diverse national parks with incredible range of ecosystems. Started at Hurricane Ridge for mountain views, then explored the Hoh Rainforest with its moss-draped trees and emerald ambiance. Finished the day at Ruby Beach watching the sunset over sea stacks and driftwood. The contrast between rainforest and coastline in one day was amazing!',
        pictures: [
          'https://images.unsplash.com/photo-1527489377706-5bf97e608852?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1503249023995-51b0f3778ccf?auto=format&fit=crop&w=600&q=80'
        ]
      }
    ]
  };
  
  selectedPlaceIndex = 0;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  ngOnInit() {
    // Get trip ID from route parameter
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // In a real app, fetch trip data using this ID
        console.log('Trip ID from route:', id);
      }
    });
  }

  selectPlace(index: number) {
    this.selectedPlaceIndex = index;
  }
  
  navigateBack() {
    this.router.navigate(['/trips']);
  }
  
  calculateDuration(): number {
    const startDate = new Date(this.trip.date);
    const endDate = new Date(this.trip.endDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  
  getMapImage(): string {
    // In a real app, this would generate a map with markers for each place
    // For now, we're just returning a nice landscape image that could represent the trip area
    const mapImages = [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520962880247-cfaf541c8724?auto=format&fit=crop&w=1200&q=80'
    ];
    
    // Use the trip ID to consistently pick the same map image for a trip
    const index = parseInt(this.trip.id, 10) % mapImages.length;
    return mapImages[index];
  }
}
