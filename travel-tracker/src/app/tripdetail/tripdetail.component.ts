import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, NavigationEnd } from '@angular/router';
import { TripproxyService } from '../tripproxy.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AddressHelper, Address } from '../models/address.model';
import { InteractiveMapComponent } from '../interactive-map.component';
import { environment } from '../../environments/environment';

interface Place {
  name: string;
  notes: string;
  pictures: string[];
  location?: string;
  address?: Address | string; // Enhanced address support
  startDate?: string;
  endDate?: string;
  description?: string;
  cost?: number;
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
  imports: [CommonModule, DatePipe, RouterModule, HttpClientModule, InteractiveMapComponent],
  templateUrl: './tripdetail.component.html',
  styleUrls: ['./tripdetail.component.css']
})
export class TripDetailComponent implements OnInit, OnDestroy {
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
  errorMessage: string = '';
  isPhotoGalleryExpanded: boolean = false;
  private navigationSubscription?: Subscription;
  
  // Permission system
  canEdit: boolean = false;
  navigationSource: string = 'public'; // 'public' or 'personal'
  
  // File input reference for photo upload
  fileInput: any;  // Track photo upload in progress
  isUploadingPhotos: boolean = false;

  // Google Maps API Key from environment
  googleMapsApiKey: string = environment.googleMapsApiKey;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tripProxy: TripproxyService,
    private http: HttpClient
  ) {}
    ngOnInit() {
    // Get trip ID from route parameter and listen for changes
    // This handles initial load and direct navigation with param changes.
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        console.log('paramMap subscription triggered for ID:', id);
        this.fetchTripDetails(id);
      }
    });

    // Check query parameters for navigation source and set permissions
    this.route.queryParams.subscribe(queryParams => {
      this.navigationSource = queryParams['source'] || 'public';
      this.canEdit = this.navigationSource === 'personal';
      console.log('Navigation source:', this.navigationSource, '| Can edit:', this.canEdit);
      
      // Handle refresh parameter if present
      if (queryParams['refresh']) {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          console.log('Refresh query parameter detected, forcing refresh for trip ID:', id);
          this.fetchTripDetails(id);
          // Remove the refresh query param to avoid re-refresh on browser back/forward or page reload.
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { refresh: null, source: this.navigationSource },
            queryParamsHandling: 'merge', // Preserve other query params, if any
            replaceUrl: true // Avoid adding this navigation to browser history
          });        }
      }
    });

    // Subscribe to navigation events to refresh data, e.g., when returning from add-place
    this.navigationSubscription = this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((navEvent: NavigationEnd) => {
        const currentUrl = navEvent.urlAfterRedirects || navEvent.url;

        // Regex to match /tripdetail/:id (e.g., /tripdetail/123, /tripdetail/abc-def)
        // and not /tripdetail/:id/subpath (e.g., /tripdetail/123/add-place)
        const tripDetailBaseRoutePattern = /^\/tripdetail\/[^/?]+(\?.*)?$/;

        if (tripDetailBaseRoutePattern.test(currentUrl)) {
          const urlSegments = currentUrl.split('?')[0].split('/');
          const tripIdFromUrl = urlSegments[urlSegments.length - 1]; // Last segment is the ID
          console.log('NavigationEnd: Detected navigation to trip detail base route:', currentUrl);
          console.log('Attempting to refresh with ID from URL:', tripIdFromUrl);
          // Potentially add a check here if tripIdFromUrl is the same as this.trip.id and data was recently fetched
          // to avoid redundant calls, but for now, explicit refresh is safer.
          this.fetchTripDetails(tripIdFromUrl);
        }
      });
  }

  ngOnDestroy() {
    // Clean up subscription
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  // Add method to refresh trip data (useful when returning from add-place)
  refreshTripData() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      console.log('Manual refresh triggered for trip ID:', id);
      // Reset loading state
      this.loading = true;
      this.error = false;
      this.fetchTripDetails(id);
    }
  }
  fetchTripDetails(tripId: string) {
    this.loading = true;
    this.error = false;
    
    console.log('=== STARTING fetchTripDetails ===');
    console.log('Received tripId parameter:', tripId);
    
    // Fetch the trip directly by ID (works for both public and private trips)
    this.tripProxy.getTripById(tripId).subscribe({
      next: (tripData: any) => {
        console.log('Trip data received:', tripData);
        console.log('Trip _id:', tripData._id);
        console.log('Trip tripId:', tripData.tripId);
        console.log('Trip id:', tripData.id);
        
        // Initialize trip with basic data
        this.trip.id = tripId;
        this.trip.name = tripData.name || 'Unnamed Trip';
        this.trip.amountSpent = tripData.amount_spent || 0;
        
        // Use tripId for locations lookup (this is the key field in the backend)
        const locationLookupId = tripData.tripId || tripId;
        console.log('Using ID for locations lookup:', locationLookupId);
        
        // Now fetch the locations (places) for this trip
        this.fetchTripLocations(locationLookupId);
      },
      error: (error) => {
        console.error('Error fetching trip details:', error);        this.error = true;
        this.loading = false;
        this.errorMessage = 'Failed to load trip details from server';
      }
    });
  }

  fetchTripLocations(tripId: string) {
    console.log('=== STARTING fetchTripLocations ===');
    console.log('Looking up locations for tripId:', tripId);
    // console.log('Expected URL:', 'http://localhost:8080/trip/' + tripId + '/locations'); // Original console log

    // Let's also test direct HTTP call to compare
    // this.http.get('http://localhost:8080/trip/' + tripId + '/locations').subscribe({ // Original HTTP test
    //   next: (directData: any) => {
    //     console.log('=== DIRECT HTTP TEST ===');
    //     console.log('Direct HTTP call success:', directData);
    //     console.log('Direct data has locations:', directData && directData.locations);
    //     console.log('Direct locations count:', directData && directData.locations ? directData.locations.length : 0);
    //   },
    //   error: (directError) => {
    //     console.log('=== DIRECT HTTP TEST ERROR ===');
    //     console.error('Direct HTTP call failed:', directError);
    //   }
    // });

    console.log('[fetchTripLocations] About to call tripProxy.getItems for tripId:', tripId);
    this.tripProxy.getItems(tripId).subscribe({
      next: (locationData: any) => {
        console.log('=== LOCATION API RESPONSE ===');
        console.log('Raw location data received from service:', JSON.stringify(locationData)); // Log entire raw data

        if (locationData && locationData.locations) {
          console.log('[fetchTripLocations] Received locations array from service:', JSON.stringify(locationData.locations));
          console.log('[fetchTripLocations] Number of locations received:', locationData.locations.length);
        } else {
          console.log('[fetchTripLocations] No "locations" property found in service response or it is empty.');
        }        if (locationData && locationData.locations && locationData.locations.length > 0) {
          // Don't calculate dates here - let the getCalculatedStartDate/EndDate functions handle it
          // Just set default values for now
          this.trip.date = new Date().toISOString().split('T')[0];
          this.trip.endDate = new Date().toISOString().split('T')[0];
          
          const previousPlacesCount = this.trip.places ? this.trip.places.length : 0;
          // Map location data to Place objects
          this.trip.places = locationData.locations.map((location: any, index: number) => {
            console.log(`[DEBUG] Location ${index}:`, {
              name: location.name,
              address: location.address,
              location: location.location,
              description: location.description,
              startDate: location.startDate,
              endDate: location.endDate,
              dates: location.dates,
              cost: location.cost,
              notes: location.notes
            });
            
            // Handle legacy dates array format or new startDate/endDate format
            let startDate = '';
            let endDate = '';
            
            if (location.startDate && location.endDate) {
              // New format
              startDate = location.startDate;
              endDate = location.endDate;
            } else if (location.dates && Array.isArray(location.dates) && location.dates.length >= 2) {
              // Legacy format - first date is start, last date is end
              startDate = location.dates[0];
              endDate = location.dates[location.dates.length - 1];
            } else if (location.dates && Array.isArray(location.dates) && location.dates.length === 1) {
              // Single date - use as both start and end
              startDate = location.dates[0];
              endDate = location.dates[0];
            }
              return {
              name: location.name || 'Unnamed Location',
              notes: location.notes || location.description || '',
              pictures: location.photos || [],
              location: typeof location.address === 'string' ? location.address : (location.location || ''),
              address: location.address || location.location || '',
              startDate: startDate,
              endDate: endDate,
              description: location.description || location.notes || '',
              cost: location.cost || location.price || 0
            };
          });
          console.log('[fetchTripLocations] Mapped this.trip.places. New count:', this.trip.places.length, '. Previous count:', previousPlacesCount);
          console.log('[fetchTripLocations] Updated this.trip.places content:', JSON.stringify(this.trip.places));        } else {
          // If no locations, set default values
          console.log('[fetchTripLocations] No locations found in data or data.locations is empty. Resetting this.trip.places.');
          this.trip.date = new Date().toISOString().split('T')[0];
          this.trip.endDate = new Date().toISOString().split('T')[0];
          this.trip.places = [];
          console.log('[fetchTripLocations] this.trip.places is now empty.');
        }
        
        // Reset selectedPlaceIndex to ensure carousel updates correctly
        if (this.trip.places.length > 0) {
          this.selectedPlaceIndex = 0;
          console.log('[fetchTripLocations] Reset selectedPlaceIndex to 0 as places are available.');
        } else {
          this.selectedPlaceIndex = 0; // Or -1 if preferred for no selection state
          console.log('[fetchTripLocations] Reset selectedPlaceIndex to 0 (no places).');
        }        this.loading = false;
        console.log('[fetchTripLocations] Loading set to false.');
        
        // Debug the places data
        this.debugPlacesDates();
      },
      error: (err) => {
        console.log('=== LOCATION API ERROR ===');
        console.error('Error fetching location details:', err);
        console.error('Error status:', err.status);
        console.error('Error statusText:', err.statusText);
        console.error('Error message:', err.message);
        console.error('Full error object:', err);
        
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
    // Navigate back to the appropriate page based on navigation source
    if (this.navigationSource === 'personal') {
      this.router.navigate(['/your-trips']);
    } else {
      this.router.navigate(['/trips']);
    }
  }
  
  navigateToAddPlace() {
    // Only allow navigation to add place if user has edit permissions
    if (!this.canEdit) {
      alert('You do not have permission to add places to this trip.');
      return;
    }
    this.router.navigate(['/tripdetail', this.trip.id, 'add-place']);
  }
    deleteCurrentPlace() {
    // Check permissions first
    if (!this.canEdit) {
      alert('You do not have permission to delete places from this trip.');
      return;
    }

    if (!this.trip.places || this.trip.places.length === 0) {
      alert('No places to delete.');
      return;
    }

    const currentPlace = this.trip.places[this.selectedPlaceIndex];
    if (!currentPlace) {
      alert('No place selected to delete.');
      return;
    }

    // Confirm deletion
    if (!confirm(`Are you sure you want to delete "${currentPlace.name}"?`)) {
      return;
    }

    // Call the service to delete the place
    this.tripProxy.deleteLocation(this.trip.id, this.selectedPlaceIndex).subscribe({
      next: (response) => {
        console.log('Place deleted successfully:', response);
        
        // Remove the place from the local array
        this.trip.places.splice(this.selectedPlaceIndex, 1);
        
        // Adjust selectedPlaceIndex if necessary
        if (this.selectedPlaceIndex >= this.trip.places.length && this.trip.places.length > 0) {
          this.selectedPlaceIndex = this.trip.places.length - 1;
        } else if (this.trip.places.length === 0) {
          this.selectedPlaceIndex = 0;
        }
        
        // Show success message
        alert('Place deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting place:', error);
        alert('Failed to delete place. Please try again.');
      }
    });
  }
    togglePhotoGallery() {
    // Always allow toggling regardless of photo count
    this.isPhotoGalleryExpanded = !this.isPhotoGalleryExpanded;
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
  // Debug function to see what data we have
  debugPlacesDates(): void {
    console.log('=== DEBUG PLACES DATES ===');
    console.log('trip.places:', this.trip.places);
    if (this.trip.places) {
      this.trip.places.forEach((place, index) => {
        console.log(`Place ${index}:`, {
          name: place.name,
          startDate: place.startDate,
          endDate: place.endDate,
          startDateType: typeof place.startDate,
          endDateType: typeof place.endDate
        });
      });
    }
    console.log('Original trip.date:', this.trip.date);
    console.log('Original trip.endDate:', this.trip.endDate);
    console.log('Calculated start date:', this.getCalculatedStartDate());
    console.log('Calculated end date:', this.getCalculatedEndDate());
  }
  // Helper function to parse dates in various formats
  private parseDate(dateString: string): Date | null {
    if (!dateString) return null;
    
    console.log('Parsing date:', dateString);
    
    // Handle MM/DD/YY format specifically (like "5/31/25")
    const mmddyyMatch = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
    if (mmddyyMatch) {
      const [, month, day, year] = mmddyyMatch;
      const fullYear = parseInt(`20${year}`); // Assume 20xx for 2-digit years
      const monthNum = parseInt(month) - 1; // Month is 0-based in Date constructor
      const dayNum = parseInt(day);
      console.log(`Creating date from MM/DD/YY: ${month}/${day}/${year} -> ${fullYear}-${monthNum + 1}-${dayNum}`);
      const date = new Date(fullYear, monthNum, dayNum);
      if (!isNaN(date.getTime())) {
        console.log('Successfully parsed MM/DD/YY as:', date);
        return date;
      }
    }
    
    // Handle MM/DD/YYYY format
    const mmddyyyyMatch = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (mmddyyyyMatch) {
      const [, month, day, year] = mmddyyyyMatch;
      const fullYear = parseInt(year);
      const monthNum = parseInt(month) - 1; // Month is 0-based in Date constructor
      const dayNum = parseInt(day);
      console.log(`Creating date from MM/DD/YYYY: ${month}/${day}/${year} -> ${fullYear}-${monthNum + 1}-${dayNum}`);
      const date = new Date(fullYear, monthNum, dayNum);
      if (!isNaN(date.getTime())) {
        console.log('Successfully parsed MM/DD/YYYY as:', date);
        return date;
      }
    }
    
    // Try original format (might be ISO already)
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      console.log('Successfully parsed original format as:', date);
      return date;
    }
    
    console.log('Failed to parse date:', dateString);
    return null;
  }

  // Calculate the earliest start date from all places
  getCalculatedStartDate(): string {
    console.log('=== getCalculatedStartDate ===');
    console.log('trip.places:', this.trip.places);
    
    if (!this.trip.places || this.trip.places.length === 0) {
      console.log('No places found, returning trip.date:', this.trip.date);
      return this.trip.date || '';
    }

    // Log each place's start date
    this.trip.places.forEach((place, index) => {
      console.log(`Place ${index}: ${place.name}, startDate: ${place.startDate}`);
    });    // Get all start dates from places that have them
    const startDates = this.trip.places
      .filter(place => place.startDate)
      .map(place => this.parseDate(place.startDate!))
      .filter(date => date !== null) as Date[];

    console.log('Valid start dates:', startDates);

    if (startDates.length === 0) {
      console.log('No valid start dates, returning trip.date:', this.trip.date);
      return this.trip.date || '';
    }    // Sort dates in ascending order and get the first (earliest) one
    startDates.sort((a, b) => a.getTime() - b.getTime());
    const earliestDate = this.formatDateAsYYYYMMDD(startDates[0]);
    console.log('Calculated earliest start date:', earliestDate);
    return earliestDate;
  }
  // Calculate the latest end date from all places  
  getCalculatedEndDate(): string {
    console.log('=== getCalculatedEndDate ===');
    console.log('trip.places:', this.trip.places);
    
    if (!this.trip.places || this.trip.places.length === 0) {
      console.log('No places found, returning trip.endDate:', this.trip.endDate);
      return this.trip.endDate || '';
    }

    // Log each place's end date
    this.trip.places.forEach((place, index) => {
      console.log(`Place ${index}: ${place.name}, endDate: ${place.endDate}`);
    });    // Get all end dates from places that have them
    const endDates = this.trip.places
      .filter(place => place.endDate)
      .map(place => this.parseDate(place.endDate!))
      .filter(date => date !== null) as Date[];

    console.log('Valid end dates:', endDates);

    if (endDates.length === 0) {
      console.log('No valid end dates, returning trip.endDate:', this.trip.endDate);
      return this.trip.endDate || '';
    }    // Sort dates in descending order and get the first (latest) one
    endDates.sort((a, b) => b.getTime() - a.getTime());
    const latestDate = this.formatDateAsYYYYMMDD(endDates[0]);
    console.log('Calculated latest end date:', latestDate);
    return latestDate;
  }

  // Update the calculateDuration method to use calculated dates
  calculateDurationFromPlaces(): number {
    const startDate = this.getCalculatedStartDate();
    const endDate = this.getCalculatedEndDate();
    
    if (!startDate || !endDate) {
      return 0;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  
  // Address helper methods for enhanced display
  getDisplayAddress(place: Place): string {
    if (place.address) {
      return AddressHelper.getDisplayAddress(place.address);
    }
    return place.location || 'No address available';
  }

  getGoogleMapsUrl(place: Place): string | null {
    if (place.address) {
      return AddressHelper.getGoogleMapsUrl(place.address);
    }
    if (place.location) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.location)}`;
    }
    return null;
  }

  hasCoordinates(place: Place): boolean {
    if (place.address) {
      return AddressHelper.hasCoordinates(place.address);
    }
    return false;
  }

  // Enhanced map image generation
  getMapImage(): string {
    if (!this.trip || !this.trip.places || this.trip.places.length === 0) {
      return 'https://via.placeholder.com/600x400?text=No+Locations';
    }

    // Collect addresses with coordinates
    const addressesWithCoords = this.trip.places
      .filter(place => place.address && AddressHelper.hasCoordinates(place.address))
      .map(place => ({
        coordinates: AddressHelper.getCoordinates(place.address as Address),
        formattedAddress: AddressHelper.getFormattedAddress(place.address as Address)
      }));

    if (addressesWithCoords.length > 0) {
      // Use Google Static Maps API if coordinates are available
      const width = 600;
      const height = 400;
      
      // Calculate center and zoom based on locations
      const coords = addressesWithCoords.map(addr => addr.coordinates!);
      const centerLat = coords.reduce((sum, coord) => sum + coord.latitude, 0) / coords.length;
      const centerLng = coords.reduce((sum, coord) => sum + coord.longitude, 0) / coords.length;
      
      let mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=${width}x${height}&center=${centerLat},${centerLng}&zoom=10`;
      
      // Add markers for each location
      addressesWithCoords.forEach((addr, index) => {
        mapUrl += `&markers=color:red%7Clabel:${index + 1}%7C${addr.coordinates!.latitude},${addr.coordinates!.longitude}`;
      });
      
      // Add Google Maps API key if available (would need to be configured)
      // mapUrl += `&key=${GOOGLE_MAPS_API_KEY}`;
      
      return mapUrl;
    }

    // Fallback for locations without coordinates
    const firstPlace = this.trip.places[0];
    const address = this.getDisplayAddress(firstPlace);
    
    if (address && address !== 'No address available') {
      const encodedAddress = encodeURIComponent(address);
      return `https://maps.googleapis.com/maps/api/staticmap?size=600x400&markers=${encodedAddress}`;
    }

    return 'https://via.placeholder.com/600x400?text=Map+Unavailable';
  }
  // Delete the entire trip along with all places
  deleteTrip() {
    // Check permissions first
    if (!this.canEdit) {
      alert('You do not have permission to delete this trip.');
      return;
    }

    if (!this.trip.name) {
      alert('No trip to delete.');
      return;
    }

    // Confirm deletion with user
    const confirmMessage = `Are you sure you want to delete the entire trip "${this.trip.name}"?\n\nThis will permanently delete:\n- The trip information\n- All ${this.trip.places?.length || 0} places in this trip\n- All photos and notes\n\nThis action cannot be undone.`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    console.log('Deleting entire trip:', this.trip.id);
    
    // Call the service to delete the entire trip
    this.tripProxy.deleteTrip(this.trip.id).subscribe({
      next: (response) => {
        console.log('Trip deleted successfully:', response);
        alert(`Trip "${this.trip.name}" has been deleted successfully!`);
        
        // Navigate back to trips list
        this.router.navigate(['/trips']);
      },
      error: (error) => {
        console.error('Error deleting trip:', error);
        alert('Failed to delete trip. Please try again.');
      }
    });
  }

  // Helper method to format date as YYYY-MM-DD without timezone issues
  private formatDateAsYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Calculate total budget spent from all places
  getCalculatedTotalBudget(): number {
    console.log('=== getCalculatedTotalBudget ===');
    console.log('trip.places:', this.trip.places);
    
    if (!this.trip.places || this.trip.places.length === 0) {
      console.log('No places found, returning trip.amountSpent:', this.trip.amountSpent);
      return this.trip.amountSpent || 0;
    }

    // Log each place's cost for debugging
    this.trip.places.forEach((place, index) => {
      console.log(`Place ${index}: ${place.name}, cost: ${place.cost}`);
    });

    // Sum up all the costs from places that have them
    const totalCost = this.trip.places
      .filter(place => place.cost && place.cost > 0) // Only include places with valid costs
      .reduce((sum, place) => sum + (place.cost || 0), 0);

    console.log('Calculated total budget from places:', totalCost);
    
    // If no places have costs, fall back to trip.amountSpent
    if (totalCost === 0) {
      console.log('No valid place costs found, falling back to trip.amountSpent:', this.trip.amountSpent);
      return this.trip.amountSpent || 0;
    }
    
    return totalCost;
  }
  // Method to open file dialog
  openFileInput(): void {
    // Check permissions first
    if (!this.canEdit) {
      alert('You do not have permission to add photos to this trip.');
      return;
    }

    // Create a file input element dynamically
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.multiple = true;
    this.fileInput.accept = 'image/*';
    
    // Add change event listener
    this.fileInput.addEventListener('change', (event: any) => {
      this.handleFileSelection(event);
    });
    
    // Trigger the file dialog
    this.fileInput.click();
  }

  // Handle the file selection
  handleFileSelection(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.uploadPhotos(files);
    }
  }
  
    // Process and upload photos
  async uploadPhotos(files: FileList): Promise<void> {
    try {
      this.isUploadingPhotos = true;
      
      // Convert File objects to Base64 strings
      const photoUrls = await this.processPhotos(Array.from(files));
      
      // Add photos to the current place
      this.tripProxy.addPhotosToPlace(this.trip.id, this.selectedPlaceIndex, photoUrls)
        .subscribe({
          next: (response) => {
            console.log('Photos added successfully:', response);
            // Refresh the trip data to show the new photos
            this.fetchTripDetails(this.trip.id);
            this.isUploadingPhotos = false;
          },
          error: (error) => {
            console.error('Error adding photos:', error);
            alert('Failed to add photos: ' + error.message);
            this.isUploadingPhotos = false;
          }
        });    } catch (error) {
      console.error('Error processing photos:', error);
      alert('Failed to process photos');
      this.isUploadingPhotos = false;
    }
  }
  
  // Convert File objects to Base64 strings
  private async processPhotos(files: File[]): Promise<string[]> {
    if (!files || files.length === 0) {
      return [];
    }

    const photoPromises = files.map((file: File) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            resolve(reader.result as string);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(new Error('Error reading file'));
        reader.readAsDataURL(file);
      });
    });

    try {
      return await Promise.all(photoPromises);
    } catch (error) {
      console.error('Error processing photos:', error);
      throw error;
    }
  }
}
