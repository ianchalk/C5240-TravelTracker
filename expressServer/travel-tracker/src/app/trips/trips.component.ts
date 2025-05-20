// filepath: /Users/jenitza/Jenitza_Mac_Doc/Seattle_University/SpringQuarter2025/Software_as_Service/C5240-TravelTracker/travel-tracker/src/app/trips/trips.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripproxyService } from '../tripproxy.service';
import { HttpClientModule } from '@angular/common/http';

interface TripData {
  id: string;
  name: string;
  location: string;
  image: string;
  amount_spent: number;
  country: string;
  [key: string]: any; // For other possible properties
}

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit {
  // Will hold trips from MongoDB
  trips: TripData[] = [];
  loading: boolean = true;
  error: boolean = false;
  totalAmountSpent: number = 0;
  visitedCountries: Set<string> = new Set<string>();

  constructor(private router: Router, private tripProxy: TripproxyService) {}

  ngOnInit() {
    console.log("TripsComponent initialized!");
    this.fetchTrips();
  }

  fetchTrips() {
    this.loading = true;
    this.error = false;
    this.totalAmountSpent = 0; // Reset total amount
    this.visitedCountries.clear(); // Reset countries set
    console.log("Fetching trips from MongoDB...");
    
    this.tripProxy.getListsIndex().subscribe({
      next: (result: any[]) => {
        // If we have results, use them
        if (result && result.length > 0) {
          console.log("Raw data from MongoDB:", result);
          this.trips = result.map(trip => {
            // Calculate total amount spent
            if (trip.amount_spent && !isNaN(parseFloat(trip.amount_spent))) {
              this.totalAmountSpent += parseFloat(trip.amount_spent);
            }
            
            // Add country to visited countries set (converted to lowercase)
            if (trip.country) {
              this.visitedCountries.add(trip.country.toLowerCase());
            }
            
            // Map MongoDB trips to the format our UI expects
            return {
              id: trip._id || trip.tripId || trip.id || '',
              name: trip.name || 'Unnamed Trip',
              location: trip.description || trip.location || 'Unknown Location',
              // Use default image if none is provided
              image: trip.image || 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
              amount_spent: trip.amount_spent || 0,
              country: trip.country || ''
            };
          });
          console.log("Mapped trips from MongoDB:", this.trips);
          console.log("Total amount spent:", this.totalAmountSpent);
          console.log("Total countries visited:", this.visitedCountries.size);
        } else {
          // No data returned
          console.log("No trips found in MongoDB.");
          this.trips = [];
          this.error = true;
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error("Error fetching trips:", err);
        // Clear trips on error
        this.trips = [];
        this.loading = false;
        this.error = true;
      }
    });
  }

  viewTripDetail(index: number) {
    // Use trip ID from the API trips
    if (this.trips && this.trips.length > index) {
      const tripId = this.trips[index].id;
      console.log(`Navigating to trip detail for trip ID: ${tripId}`);
      this.router.navigate(['/tripdetail', tripId]);
    }
  }
}
