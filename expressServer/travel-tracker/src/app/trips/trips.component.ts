import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TripproxyService } from '../tripproxy.service';
import { AuthService } from '../services/auth.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

interface TripData {
  id: string;
  tripId?: string; // Add tripId as an optional property
  name: string;
  location: string;
  image: string;
  amount_spent: number;
  country: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    picture: string;
  };
  [key: string]: any; // For other possible properties
}

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit, OnDestroy {
  // Will hold trips from MongoDB
  trips: TripData[] = [];
  allTrips: TripData[] = []; // Store all trips for search filtering
  loading: boolean = true;
  error: boolean = false;
  totalAmountSpent: number = 0;
  visitedCountries: Set<string> = new Set<string>();

  // Search properties
  searchQuery: string = '';
  isSearching: boolean = false;

  // Authentication properties
  isAuthenticated: boolean = false;
  currentUser: any = null;
  private authSubscriptions: Subscription[] = [];

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private tripProxy: TripproxyService, 
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log("TripsComponent initialized!");
    console.log("Current environment:", window.location.origin);
    console.log("Backend URL:", this.tripProxy);

    // Subscribe to authentication status
    const authSub = this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      console.log('Authentication status updated in TripsComponent:', isAuth);
    });
    this.authSubscriptions.push(authSub);

    const userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log('Current user updated in TripsComponent:', user);
    });
    this.authSubscriptions.push(userSub);

    // Check for search query from URL parameters
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchQuery = params['search'];
        console.log('Search query from URL:', this.searchQuery);
      }
    });

    this.fetchTrips();
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.authSubscriptions.forEach(sub => sub.unsubscribe());
  }

  fetchTrips() {
    this.loading = true;
    this.error = false;
    this.totalAmountSpent = 0; // Reset total amount
    this.visitedCountries.clear(); // Reset countries set
    console.log("=== STARTING fetchTrips (PUBLIC ONLY) ===");
    
    // Now we only fetch PUBLIC trips via the modified backend endpoint
    // The backend TripModel.retrieveAllTrips() now filters by isPublic: true
    this.tripProxy.getListsIndex().subscribe({
      next: (result: any[]) => {
        console.log("=== TripProxy SUCCESS (PUBLIC TRIPS) ===");
        console.log("Public trips response received:", result);
        console.log("Result type:", typeof result);
        console.log("Result is array:", Array.isArray(result));
        console.log("Result length:", result ? result.length : 'null/undefined');
        
        this.processTripsData(result);
      },
      error: (err: any) => {
        console.log("=== TripProxy ERROR ===");
        console.error("Error fetching public trips:", err);
        console.error("Error details:", err.message || err.toString());
        console.error("Error status:", err.status);
        console.error("Error statusText:", err.statusText);
        console.error("Full error object:", err);
        
        // Try direct HTTP call as fallback
        console.log("=== TRYING DIRECT HTTP FALLBACK ===");
        this.http.get<any[]>('http://localhost:8080/trip').subscribe({
          next: (directResult) => {
            console.log("=== DIRECT HTTP SUCCESS (PUBLIC TRIPS) ===");
            console.log("Direct HTTP call success:", directResult);
            this.processTripsData(directResult);
          },
          error: (directError) => {
            console.log("=== DIRECT HTTP ERROR ===");
            console.error("Direct HTTP call also failed:", directError);
            console.error("Direct error status:", directError.status);
            console.error("Direct error statusText:", directError.statusText);
            this.trips = [];
            this.loading = false;
            this.error = true;
          }
        });
      }
    });
  }
  
  private async processTripsData(result: any[]) {
    // If we have results, use them
    if (result && result.length > 0) {
      console.log("Processing trips data:", result);
      
      // Process trips with dynamic images
      const processedTrips = await Promise.all(result.map(async (trip) => {
        // Calculate total amount spent
        if (trip.amount_spent && !isNaN(parseFloat(trip.amount_spent))) {
          this.totalAmountSpent += parseFloat(trip.amount_spent);
        }
        
        // Add country to visited countries set (converted to lowercase)
        if (trip.country) {
          this.visitedCountries.add(trip.country.toLowerCase());
        }
        
        // Get random image from trip locations
        const randomImage = await this.getRandomImageFromTrip(trip.tripId || trip._id || trip.id);
        
        // Map MongoDB trips to the format our UI expects
        return {
          id: trip._id || trip.tripId || trip.id || '',
          tripId: trip.tripId || trip._id || trip.id || '', // Keep track of the actual tripId
          name: trip.name || 'Unnamed Trip',
          location: trip.location || trip.description || 'Unknown Location',
          image: randomImage || 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
          amount_spent: trip.amount_spent || 0,
          country: trip.country || '',
          userId: trip.userId // Include user data if populated
        };
      }));
      
      this.allTrips = processedTrips; // Store all trips
      this.trips = processedTrips; // Initially show all trips
      
      // If there's a search query from URL, apply it
      if (this.searchQuery) {
        this.performSearch();
      }
      
      console.log("Successfully processed trips:", this.trips);
      console.log("Total amount spent:", this.totalAmountSpent);
      console.log("Total countries visited:", this.visitedCountries.size);
    } else {
      // No data returned
      console.log("No trips found in response.");
      this.allTrips = [];
      this.trips = [];
      this.error = true;
    }
    this.loading = false;
  }

  // Search Methods
  onSearchInput() {
    // Debounce search as user types
    if (this.searchQuery.trim() === '') {
      this.clearSearch();
    }
  }

  performSearch() {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.trips = this.allTrips;
      return;
    }

    this.isSearching = true;
    const query = this.searchQuery.toLowerCase().trim();
    
    // First try to search via backend API
    this.tripProxy.searchPublicTrips(query).subscribe({
      next: (result: any[]) => {
        console.log('Backend search result:', result);
        if (result && result.length > 0) {
          this.processSearchResults(result);
        } else {
          // If no backend results, fallback to client-side filtering
          this.performClientSideSearch(query);
        }
        this.isSearching = false;
      },
      error: (err) => {
        console.error('Backend search error:', err);
        // Fallback to client-side search
        this.performClientSideSearch(query);
        this.isSearching = false;
      }
    });
  }

  private performClientSideSearch(query: string) {
    console.log('Performing client-side search for:', query);
    this.trips = this.allTrips.filter(trip => 
      trip.name.toLowerCase().includes(query) || 
      trip.location.toLowerCase().includes(query)
    );
    console.log('Filtered trips:', this.trips.length);
  }

  private async processSearchResults(result: any[]) {
    // Process search results similar to processTripsData but don't update allTrips
    if (result && result.length > 0) {
      const processedTrips = await Promise.all(result.map(async (trip) => {
        const randomImage = await this.getRandomImageFromTrip(trip.tripId || trip._id || trip.id);
        
        return {
                    id: trip._id || trip.tripId || trip.id || '',
          tripId: trip.tripId || trip._id || trip.id || '',
          name: trip.name || 'Unnamed Trip',
          location: trip.location || trip.description || 'Unknown Location',
          image: randomImage || 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
          amount_spent: trip.amount_spent || 0,
          country: trip.country || '',
          userId: trip.userId // Include user data if populated
        };
      }));
      
      this.trips = processedTrips;
      console.log("Search results processed:", this.trips.length);
    } else {
      this.trips = [];
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.trips = this.allTrips;
    this.isSearching = false;
    
    // Update URL to remove search parameter
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true
    });
  }

  viewTripDetail(index: number) {
    // Use tripId (not the MongoDB _id) for navigation since the backend expects tripId for locations
    if (this.trips && this.trips.length > index) {
      const trip = this.trips[index];
      const navigationId = trip.tripId || trip.id; // Prefer tripId over id
      console.log(`Navigating to trip detail for index ${index}`);
      console.log(`Trip data:`, trip);
      console.log(`Using navigation ID: ${navigationId}`);
      // Navigate with source parameter to indicate this is from public trips (read-only)
      this.router.navigate(['/tripdetail', navigationId], { 
        queryParams: { source: 'public' } 
      });
    }
  }

  goToAddTrip() {
    if (!this.isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      alert('Please sign in to add a new trip.');
      // Optionally redirect to login or show a login modal
      return;
    }
    
    console.log('Navigating to add trip page');
    this.router.navigate(['/add-trips']);
  }

  goToYourTrips() {
    this.router.navigate(['/your-trips']);
  }

  // Add a manual test method
  testApiDirect() {
    console.log("Testing direct API call...");
    this.http.get<any[]>('http://localhost:8080/trip').subscribe({
      next: (result) => {
        console.log("Direct API test SUCCESS:", result);
        alert("Direct API test successful! Got " + result.length + " trips");
      },
      error: (err) => {
        console.error("Direct API test FAILED:", err);
        alert("Direct API test failed: " + err.message);
      }
    });
  }

  // Get random image from trip locations
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
}
