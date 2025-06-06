import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripproxyService } from '../tripproxy.service';
import { AuthService } from '../services/auth.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

interface Place {
  name: string;
  cost?: number;
  [key: string]: any;
}

interface TripData {
  id: string;
  tripId?: string;
  name: string;
  location: string;
  image: string;
  amount_spent: number;
  calculatedCost?: number; // New field for calculated cost from places
  country: string;
  isPublic: boolean;
  userId: string;
  [key: string]: any;
}

@Component({
  selector: 'app-your-trips',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './your-trips.component.html',
  styleUrls: ['./your-trips.component.css']
})
export class YourTripsComponent implements OnInit, OnDestroy {
  // Will hold user's trips from MongoDB
  trips: TripData[] = [];
  publicTrips: TripData[] = [];
  privateTrips: TripData[] = [];
  loading: boolean = true;
  error: boolean = false;
  totalAmountSpent: number = 0;
  visitedCountries: Set<string> = new Set<string>();

  // Authentication properties
  isAuthenticated: boolean = false;
  currentUser: any = null;
  private authSubscriptions: Subscription[] = [];

  constructor(
    private router: Router, 
    private tripProxy: TripproxyService, 
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log("YourTripsComponent initialized!");
    
    // Subscribe to authentication status
    const authSub = this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      console.log('Authentication status updated in YourTripsComponent:', isAuth);
      
      if (isAuth) {
        this.fetchUserTrips();
      } else {
        // Redirect to login or show message if not authenticated
        this.router.navigate(['/']);
      }
    });
    this.authSubscriptions.push(authSub);

    const userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log('Current user updated in YourTripsComponent:', user);
      
      if (user) {
        this.fetchUserTrips();
      }
    });
    this.authSubscriptions.push(userSub);
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.authSubscriptions.forEach(sub => sub.unsubscribe());
  }

  fetchUserTrips() {
    if (!this.currentUser || !this.currentUser._id) {
      console.log('No authenticated user available');
      this.loading = false;
      this.error = true;
      return;
    }

    this.loading = true;
    this.error = false;
    this.totalAmountSpent = 0;
    this.visitedCountries.clear();
    
    console.log("=== FETCHING USER TRIPS ===");
    console.log("Current user ID:", this.currentUser._id);
    
    // Call the new user-specific endpoint
    this.http.get<any[]>(`http://localhost:8080/trip/user/${this.currentUser._id}`).subscribe({
      next: (result: any[]) => {
        console.log("=== USER TRIPS SUCCESS ===");
        console.log("User trips response:", result);
        this.processTripsData(result);
      },
      error: (err: any) => {
        console.log("=== USER TRIPS ERROR ===");
        console.error("Error fetching user trips:", err);
        this.trips = [];
        this.publicTrips = [];
        this.privateTrips = [];
        this.loading = false;
        this.error = true;
      }
    });
  }

  private async processTripsData(result: any[]) {
    if (result && result.length > 0) {
      console.log("Processing user trips data:", result);
      
      // Process trips with dynamic images
      const processedTrips = await Promise.all(result.map(async (trip) => {
        // Calculate total amount spent
        if (trip.amount_spent && !isNaN(parseFloat(trip.amount_spent))) {
          this.totalAmountSpent += parseFloat(trip.amount_spent);
        }
        
        // Add country to visited countries set
        if (trip.country) {
          this.visitedCountries.add(trip.country.toLowerCase());
        }
          // Get random image from trip locations
        const randomImage = await this.getRandomImageFromTrip(trip.tripId || trip._id || trip.id);
        
        // Map MongoDB trips to the format our UI expects
        return {
          id: trip._id || trip.tripId || trip.id || '',
          tripId: trip.tripId || trip._id || trip.id || '',
          name: trip.name || 'Unnamed Trip',
          location: trip.location || trip.description || 'Unknown Location',
          image: randomImage || 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
          amount_spent: trip.amount_spent || 0,
          country: trip.country || 'Unknown',
          isPublic: trip.isPublic || false,
          userId: trip.userId || '',
          ...trip
        };
      }));
      
      this.trips = processedTrips;
      
      // Separate public and private trips
      this.publicTrips = this.trips.filter(trip => trip.isPublic);
      this.privateTrips = this.trips.filter(trip => !trip.isPublic);
      
      console.log("Processed trips:", this.trips);
      console.log("Public trips:", this.publicTrips);
      console.log("Private trips:", this.privateTrips);
      
      // Calculate and update trip costs from places
      await this.calculateTripsCostFromPlaces(this.trips);
      
    } else {
      console.log("No trips found for user");
      this.trips = [];
      this.publicTrips = [];
      this.privateTrips = [];
    }
    
    this.loading = false;
    this.error = false;
  }
  private async getRandomImageFromTrip(tripId: string): Promise<string | null> {
    try {
      console.log(`Getting random image for trip: ${tripId}`);
      
      if (!tripId) {
        console.log('No tripId provided, returning null');
        return null;
      }

      // Fetch trip locations using the existing service
      const tripData = await this.tripProxy.getItems(tripId).toPromise();
      
      if (!tripData || !tripData.locations || tripData.locations.length === 0) {
        console.log(`No locations found for trip ${tripId}`);
        return null;
      }

      console.log(`Found ${tripData.locations.length} locations for trip ${tripId}`);

      // Collect all photos from all locations
      const allPhotos: string[] = [];
      
      tripData.locations.forEach((location: any, index: number) => {
        if (location.photos && Array.isArray(location.photos) && location.photos.length > 0) {
          console.log(`Location ${index} (${location.name}) has ${location.photos.length} photos`);
          // Add all photos from this location to our collection
          allPhotos.push(...location.photos);
        } else {
          console.log(`Location ${index} (${location.name}) has no photos`);
        }
      });

      if (allPhotos.length === 0) {
        console.log(`No photos found in any location for trip ${tripId}`);
        return null;
      }

      // Select a random photo from all available photos
      const randomIndex = Math.floor(Math.random() * allPhotos.length);
      const selectedPhoto = allPhotos[randomIndex];
      
      console.log(`Selected random photo ${randomIndex + 1} of ${allPhotos.length} for trip ${tripId}`);
      
      return selectedPhoto;
    } catch (error) {
      console.error(`Error getting random image for trip ${tripId}:`, error);
      return null;
    }
  }
  goToTripDetail(trip: TripData) {
    console.log("Navigating to trip:", trip);
    const tripId = trip.tripId || trip.id;
    // Navigate with source parameter to indicate this is from personal trips (editable)
    this.router.navigate(['/tripdetail', tripId], { 
      queryParams: { source: 'personal' } 
    });
  }

  goToAddTrip() {
    this.router.navigate(['/add-trips']);
  }

  goToPublicTrips() {
    this.router.navigate(['/trips']);
  }
  toggleTripPrivacy(trip: TripData) {
    console.log("Toggle privacy for trip:", trip);
    
    if (!this.currentUser) {
      console.error("No authenticated user found");
      return;
    }
    
    const newPrivacyStatus = !trip.isPublic;
    const tripId = trip.tripId || trip.id;
    
    // Call the backend API to update privacy
    const updateData = {
      isPublic: newPrivacyStatus,
      userId: this.currentUser._id // Include userId for security check
    };
    
    this.http.patch(`http://localhost:8080/trip/${tripId}/privacy`, updateData).subscribe({
      next: (response: any) => {
        console.log("Privacy updated successfully:", response);
        
        // Update local state only if backend update was successful
        trip.isPublic = newPrivacyStatus;
        
        // Re-categorize trips
        this.publicTrips = this.trips.filter(t => t.isPublic);
        this.privateTrips = this.trips.filter(t => !t.isPublic);
        
        // Show success message (optional)
        alert(`Trip "${trip.name}" is now ${newPrivacyStatus ? 'public' : 'private'}`);
      },
      error: (err: any) => {
        console.error("Error updating trip privacy:", err);
        alert("Failed to update trip privacy. Please try again.");
      }
    });
  }

  deleteTrip(trip: TripData) {
    if (confirm(`Are you sure you want to delete the trip "${trip.name}"? This action cannot be undone.`)) {
      console.log("Delete trip:", trip);
      
      if (!this.currentUser) {
        console.error("No authenticated user found");
        return;
      }
      
      const tripId = trip.tripId || trip.id;
      
      // Call the backend API to delete the trip
      this.http.delete(`http://localhost:8080/trip/${tripId}`).subscribe({
        next: (response: any) => {
          console.log("Trip deleted successfully:", response);
          
          // Remove from local state only if backend deletion was successful
          this.trips = this.trips.filter(t => t.id !== trip.id && t.tripId !== trip.tripId);
          this.publicTrips = this.trips.filter(t => t.isPublic);
          this.privateTrips = this.trips.filter(t => !t.isPublic);
          
          // Recalculate statistics
          this.recalculateStatistics();
          
          // Show success message
          alert(`Trip "${trip.name}" has been deleted successfully.`);
        },
        error: (err: any) => {
          console.error("Error deleting trip:", err);
          alert("Failed to delete trip. Please try again.");
        }
      });
    }
  }

  private recalculateStatistics() {
    // Recalculate total amount spent
    this.totalAmountSpent = 0;
    this.visitedCountries.clear();
    
    for (const trip of this.trips) {
      if (trip.amount_spent && !isNaN(parseFloat(trip.amount_spent.toString()))) {
        this.totalAmountSpent += parseFloat(trip.amount_spent.toString());
      }
      
      if (trip.country) {
        this.visitedCountries.add(trip.country.toLowerCase());
      }
    }
  }

  // Method to calculate actual cost from places for a trip
  async calculateTripCostFromPlaces(tripId: string): Promise<number> {
    try {
      console.log('Calculating cost from places for trip:', tripId);
      
      // Fetch locations for this trip
      const locationData = await this.tripProxy.getItems(tripId).toPromise();
      
      if (!locationData || !locationData.locations || !Array.isArray(locationData.locations)) {
        console.log('No locations found for trip:', tripId);
        return 0;
      }

      // Sum up all the costs from places that have them
      const totalCost = locationData.locations
        .filter((place: Place) => place.cost && place.cost > 0)
        .reduce((sum: number, place: Place) => sum + (place.cost || 0), 0);

      console.log(`Trip ${tripId} calculated cost from places: ${totalCost}`);
      return totalCost;
    } catch (error) {
      console.error('Error calculating trip cost from places:', error);
      return 0;
    }
  }

  // Method to calculate costs from places for all trips
  async calculateTripsCostFromPlaces(trips: TripData[]): Promise<void> {
    console.log('Calculating costs from places for all trips...');
    
    for (const trip of trips) {
      const tripId = trip.tripId || trip.id;
      if (tripId) {
        trip.calculatedCost = await this.calculateTripCostFromPlaces(tripId);
      }
    }
    
    // Recalculate total amount spent using the new calculated costs
    this.recalculateStatisticsWithCalculatedCosts();
  }

  // Updated method to recalculate statistics using calculated costs instead of amount_spent
  private recalculateStatisticsWithCalculatedCosts() {
    this.totalAmountSpent = 0;
    this.visitedCountries.clear();
    
    for (const trip of this.trips) {
      // Use calculated cost instead of amount_spent
      const tripCost = this.getTripDisplayCost(trip);
      if (tripCost && !isNaN(tripCost)) {
        this.totalAmountSpent += tripCost;
      }
      
      if (trip.country) {
        this.visitedCountries.add(trip.country.toLowerCase());
      }
    }
    
    console.log('Updated total amount spent with calculated costs:', this.totalAmountSpent);
  }

  // Method to get the display cost for a trip (calculated cost or fallback to amount_spent)
  getTripDisplayCost(trip: TripData): number {
    return trip.calculatedCost !== undefined ? trip.calculatedCost : trip.amount_spent || 0;
  }
}
