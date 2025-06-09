import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InteractiveMapComponent } from '../components/interactive-map/interactive-map.component';
import { TripproxyService } from '../tripproxy.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-welcomepage',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule, FormsModule, InteractiveMapComponent],
  templateUrl: './welcomepage.component.html',
  styleUrls: ['./welcomepage.component.css']
})
export class WelcomepageComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  currentUser: any = null;
  searchQuery = '';
  private subscriptions: Subscription[] = [];

  // Map-related properties
  allPublicPlaces: Place[] = [];
  isLoadingMapData = false;
  mapError = '';
  googleMapsApiKey = environment.googleMapsApiKey;

  // Top Places properties
  topPlaces: TopPlace[] = [];
  isLoadingTopPlaces = false;
  topPlacesError = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private tripProxy: TripproxyService
  ) {}

  ngOnInit(): void {
    // Refresh authentication status when component loads
    this.authService.checkAuthStatus().subscribe();
    
    // Subscribe to authentication status
    const authSub = this.authService.isAuthenticated$.subscribe(
      (isAuth: boolean) => this.isAuthenticated = isAuth
    );
    
    // Subscribe to current user
    const userSub = this.authService.currentUser$.subscribe(
      (user: any) => this.currentUser = user
    );

    this.subscriptions.push(authSub, userSub);

    // Check if we should focus on the search input
    this.route.queryParams.subscribe(params => {
      if (params['focus'] === 'search') {
        setTimeout(() => {
          const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
        }, 100);
      }
    });

    // Load public places for the map
    this.loadPublicPlacesForMap();

    // Load top places for the section
    this.loadTopPlaces();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      this.router.navigate(['/trips'], { 
        queryParams: { search: this.searchQuery.trim() } 
      });
    }
  }

  onSearchKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onSearch();
    }
  }

  private loadPublicPlacesForMap(): void {
    this.isLoadingMapData = true;
    this.mapError = '';

    this.tripProxy.getListsIndex().subscribe({
      next: (trips: any[]) => {
        console.log('Loaded public trips for map:', trips);
        this.extractPlacesFromTrips(trips);
      },
      error: (error) => {
        console.error('Error loading public trips for map:', error);
        this.mapError = 'Failed to load map data';
        this.isLoadingMapData = false;
      }
    });
  }

  private extractPlacesFromTrips(trips: any[]): void {
    const places: Place[] = [];
    let completedRequests = 0;
    const totalRequests = trips.filter(trip => trip.tripId).length;
    
    if (totalRequests === 0) {
      this.allPublicPlaces = places;
      this.isLoadingMapData = false;
      return;
    }

    trips.forEach(trip => {
      // Get locations for each trip
      if (trip.tripId) {
        this.tripProxy.getItems(trip.tripId).subscribe({
          next: (locations: any) => {
            if (locations && locations.locations) {
              locations.locations.forEach((location: any) => {
                // Only include places that have valid coordinates
                if (location.address && this.hasValidCoordinates(location.address)) {
                  const place: Place = {
                    id: location._id || `${trip.tripId}-${location.name}`,
                    name: location.name || 'Unnamed Location',
                    notes: location.notes || location.description || '',
                    pictures: location.photos || location.pictures || [],
                    location: location.address?.formattedAddress || location.address?.address || '',
                    address: location.address,
                    startDate: location.startDate,
                    endDate: location.endDate,
                    description: location.description,
                    cost: location.cost
                  };
                  places.push(place);
                }
              });
            }
            
            completedRequests++;
            if (completedRequests === totalRequests) {
              this.allPublicPlaces = places;
              console.log('Extracted places for map:', this.allPublicPlaces.length);
              this.isLoadingMapData = false;
            }
          },
          error: (error) => {
            console.error(`Error loading locations for trip ${trip.tripId}:`, error);
            completedRequests++;
            if (completedRequests === totalRequests) {
              this.allPublicPlaces = places;
              console.log('Extracted places for map:', this.allPublicPlaces.length);
              this.isLoadingMapData = false;
            }
          }
        });
      }
    });
  }

  private hasValidCoordinates(address: any): boolean {
    if (!address) return false;
    
    // Check if address has coordinates
    if (address.coordinates) {
      const { latitude, longitude } = address.coordinates;
      return typeof latitude === 'number' && typeof longitude === 'number' &&
             latitude !== 0 && longitude !== 0;
    }
    
    // Check if address has lat/lng properties
    if (address.lat && address.lng) {
      return typeof address.lat === 'number' && typeof address.lng === 'number' &&
             address.lat !== 0 && address.lng !== 0;
    }
    
    return false;
  }

  private loadTopPlaces(): void {
    this.isLoadingTopPlaces = true;
    this.topPlacesError = '';

    // Fetch trips and get the first 3
    this.tripProxy.getListsIndex().subscribe({
      next: (trips: any[]) => {
        console.log('Loaded trips for top places:', trips);
        
        if (trips && trips.length > 0) {
          // Take first 3 trips and transform them for display
          const topTrips = trips.slice(0, 3);
          this.processTopPlaces(topTrips);
        } else {
          this.topPlaces = [];
          this.isLoadingTopPlaces = false;
        }
      },
      error: (error) => {
        console.error('Error loading trips for top places:', error);
        this.topPlacesError = 'Failed to load top places';
        this.isLoadingTopPlaces = false;
      }
    });
  }

  private async processTopPlaces(trips: any[]): Promise<void> {
    const processedPlaces: TopPlace[] = [];
    
    for (const trip of trips) {
      try {
        // Get a representative image from trip locations
        const image = await this.getRepresentativeImageFromTrip(trip.tripId || trip._id || trip.id);
        
        // Extract location information
        const location = await this.getLocationFromTrip(trip);
        
        const topPlace: TopPlace = {
          id: trip.tripId || trip._id || trip.id || '',
          name: trip.name || 'Unnamed Trip',
          location: location,
          image: image,
          description: trip.description || ''
        };
        
        processedPlaces.push(topPlace);
      } catch (error) {
        console.error('Error processing trip for top places:', error);
        // Continue with other trips even if one fails
      }
    }
    
    this.topPlaces = processedPlaces;
    this.isLoadingTopPlaces = false;
  }

  private async getRepresentativeImageFromTrip(tripId: string): Promise<string> {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80'
    ];

    try {
      // Try to get locations for this trip to find an image
      const locations: any = await this.tripProxy.getItems(tripId).toPromise();
      
      if (locations && locations.locations && locations.locations.length > 0) {
        // Look for the first location with photos
        for (const location of locations.locations) {
          if (location.photos && location.photos.length > 0) {
            return location.photos[0];
          }
          if (location.pictures && location.pictures.length > 0) {
            return location.pictures[0];
          }
        }
      }
    } catch (error) {
      console.log('Could not get image from trip locations, using fallback');
    }

    // Return a random fallback image
    const randomIndex = Math.floor(Math.random() * fallbackImages.length);
    return fallbackImages[randomIndex];
  }

  private async getLocationFromTrip(trip: any): Promise<string> {
    try {
      // Try to get locations for this trip
      const locations: any = await this.tripProxy.getItems(trip.tripId || trip._id || trip.id).toPromise();
      
      if (locations && locations.locations && locations.locations.length > 0) {
        const location = locations.locations[0];
        
        // Try to extract location from address
        if (location.address) {
          if (location.address.country) {
            return location.address.country;
          }
          if (location.address.city) {
            return location.address.city;
          }
          if (location.address.formattedAddress) {
            // Extract country from formatted address (usually at the end)
            const parts = location.address.formattedAddress.split(', ');
            return parts[parts.length - 1] || 'Unknown Location';
          }
        }
        
        // Fallback to location name or description
        return location.name || location.description || 'Unknown Location';
      }
    } catch (error) {
      console.log('Could not get location from trip, using fallback');
    }

    // Final fallback
    return trip.description || trip.location || 'Unknown Location';
  }

  // Method to handle card hover effects
  onCardHover(event: Event, isHovering: boolean): void {
    const cardElement = event.currentTarget as HTMLElement;
    if (cardElement) {
      if (isHovering) {
        cardElement.style.transform = 'translateY(-3px)';
        cardElement.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
      } else {
        cardElement.style.transform = 'translateY(0)';
        cardElement.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      }
    }
  }
}

interface Place {
  id?: string;
  name: string;
  notes: string;
  pictures: string[];
  location: string;
  address?: any;
  startDate?: string;
  endDate?: string;
  description?: string;
  cost?: number;
}

interface TopPlace {
  id: string;
  name: string;
  location: string;
  image: string;
  description?: string;
}
