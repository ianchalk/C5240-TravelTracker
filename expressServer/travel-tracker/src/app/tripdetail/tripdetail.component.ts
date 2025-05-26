import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TripproxyService } from '../tripproxy.service';
import { HttpClientModule } from '@angular/common/http';

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
  imports: [CommonModule, DatePipe, RouterModule, HttpClientModule],
  templateUrl: './tripdetail.component.html',
  styleUrls: ['./tripdetail.component.css']
})
export class TripDetailComponent implements OnInit {
  trip: Trip = {
    id: '',
    name: '',
    date: '',
    amountSpent: 0,
    endDate: '',
    places: []
  };
  
  selectedPlaceIndex = 0;
  loading: boolean = true;
  error: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tripProxy: TripproxyService
  ) {}
  
  ngOnInit() {
    // Get trip ID from route parameter
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchTripDetails(id);
      }
    });
  }

  fetchTripDetails(tripId: string) {
    this.loading = true;
    this.error = false;
    
    // First get the trip basic info
    this.tripProxy.getListsIndex().subscribe({
      next: (trips: any[]) => {
        console.log('All trips:', trips);
        // Find the trip with matching ID
        const tripData = trips.find(trip => trip._id === tripId || trip.id === tripId || trip.tripId === tripId);
        
        if (tripData) {
          console.log('Found trip data:', tripData);
          // Initialize trip with basic data
          this.trip.id = tripId;
          this.trip.name = tripData.name || 'Unnamed Trip';
          this.trip.amountSpent = tripData.amount_spent || 0;
          
          // Now fetch the locations (places) for this trip
          this.fetchTripLocations(tripId);
        } else {
          console.error('Trip not found with ID:', tripId);
          this.error = true;
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error fetching trips:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  fetchTripLocations(tripId: string) {
    this.tripProxy.getItems(tripId).subscribe({
      next: (locationData: any) => {
        console.log('Location data received:', locationData);
        
        if (locationData && locationData.locations && locationData.locations.length > 0) {
          // Set trip start/end date from first/last location if available
          const dates = locationData.locations
            .filter((loc: any) => loc.startDate || loc.endDate)
            .map((loc: any) => ({
              start: loc.startDate ? new Date(loc.startDate) : null,
              end: loc.endDate ? new Date(loc.endDate) : null
            }))
            .filter((d: any) => d.start || d.end);
            
          if (dates.length > 0) {
            // Find earliest start date and latest end date
            const startDates = dates.filter((d: any) => d.start).map((d: any) => d.start);
            const endDates = dates.filter((d: any) => d.end).map((d: any) => d.end);
            
            if (startDates.length > 0) {
              this.trip.date = new Date(Math.min(...startDates.map((d: Date) => d.getTime()))).toISOString().split('T')[0];
            }
            
            if (endDates.length > 0) {
              this.trip.endDate = new Date(Math.max(...endDates.map((d: Date) => d.getTime()))).toISOString().split('T')[0];
            }
          } else {
            // If no dates, set defaults to today
            this.trip.date = new Date().toISOString().split('T')[0];
            this.trip.endDate = new Date().toISOString().split('T')[0];
          }
          
          // Map location data to Place objects
          this.trip.places = locationData.locations.map((location: any) => {
            return {
              name: location.name || 'Unnamed Location',
              notes: location.notes || location.description || '',
              pictures: location.photos || []
            };
          });
          
          console.log('Mapped trip data:', this.trip);
        } else {
          // If no locations, set default values
          this.trip.date = new Date().toISOString().split('T')[0];
          this.trip.endDate = new Date().toISOString().split('T')[0];
          this.trip.places = [];
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching location details:', err);
        // Keep the basic trip data but mark that we had an error with locations
        this.error = true;
        this.loading = false;
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
    if (!this.trip || !this.trip.date || !this.trip.endDate) {
      return 0;
    }
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
    // Add a fallback in case trip ID is not a valid number
    const id = this.trip.id || '0';
    const parsedId = parseInt(id, 10);
    const index = !isNaN(parsedId) ? parsedId % mapImages.length : 0;
    return mapImages[index];
  }
}
