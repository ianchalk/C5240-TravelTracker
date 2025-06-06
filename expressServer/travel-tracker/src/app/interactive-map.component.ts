import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Loader } from '@googlemaps/js-api-loader';
import { Address, AddressHelper } from './models/address.model';

interface Place {
  id?: string;
  name: string;
  notes: string;
  pictures: string[];
  location?: string;
  address?: Address | string;
  startDate?: string;
  endDate?: string;
  description?: string;
  cost?: number;
}

@Component({
  selector: 'app-interactive-map',
  standalone: true,
  imports: [CommonModule],  template: `
    <div class="interactive-map-container">
      <div 
        #mapElement 
        class="map-container"
        [style.height.px]="mapHeight">
      </div>
      
      <div class="map-error" *ngIf="errorMessage">
        <div class="error-content">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="#ff6b6b"/>
          </svg>
          <p>{{ errorMessage }}</p>
          <small>Falling back to static map view</small>
        </div>
      </div>
      
      <div class="map-loading" *ngIf="isLoading">
        <div class="loading-spinner"></div>
        <p>Loading interactive map...</p>
      </div>
    </div>
  `,  styles: [`    .interactive-map-container {
      background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,255,248,0.95) 100%);
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(43, 158, 95, 0.15);
      overflow: hidden;
      border: 2px solid rgba(43, 158, 95, 0.1);
      backdrop-filter: blur(10px);
      position: relative;
    }.map-container {
      width: 100%;
      min-height: 400px;
      position: relative;
      border-radius: 20px;
      overflow: hidden;
    }

    .map-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      background: linear-gradient(135deg, #f8fffe 0%, #f0f7f4 100%);
      color: #2b9e5f;
      font-weight: 500;
    }

    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(43, 158, 95, 0.1);
      border-left-color:rgb(46, 165, 100);
      border-top-color:rgb(43, 158, 95);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(43, 158, 95, 0.2);
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .map-error {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      background: linear-gradient(135deg, #fff5f5 0%, #ffeaea 100%);
      border: 2px solid #fed7d7;
      margin: 20px;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(220, 53, 69, 0.1);
    }

    .error-content {
      text-align: center;
      color: #c53030;
    }

    .error-content svg {
      margin-bottom: 16px;
      filter: drop-shadow(0 2px 4px rgba(220, 53, 69, 0.2));
    }

    .error-content p {
      margin: 12px 0;
      font-weight: 600;
      font-size: 1.1rem;
    }    .error-content small {
      color: rgb(119, 131, 149);
      font-size: 0.9rem;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .map-container {
        min-height: 300px;
      }
    }
  `]
})
export class InteractiveMapComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapElement', { static: false }) mapElement!: ElementRef;  @Input() places: Place[] = [];
  @Input() tripName: string = '';
  @Input() mapHeight: number = 400;
  @Input() apiKey: string = ''; // Will be passed from environment or config
  @Input() set selectedPlaceIndex(index: number) {
    if (this._selectedPlaceIndex !== index) {
      this._selectedPlaceIndex = index;
      this.highlightSelectedPlace();
    }
  }
  get selectedPlaceIndex(): number {
    return this._selectedPlaceIndex;
  }

  private _selectedPlaceIndex: number = 0;
  private map!: google.maps.Map;
  private markers: google.maps.Marker[] = [];
  private infoWindows: google.maps.InfoWindow[] = [];
  private loader!: Loader;
  private activePlace: number = 0;
  
  isLoading: boolean = true;
  errorMessage: string = '';

  ngOnInit() {
    // Initialize the Google Maps loader
    this.loader = new Loader({
      apiKey: this.apiKey || 'YOUR_API_KEY_HERE', // Replace with actual API key
      version: 'weekly',
      libraries: ['places', 'geometry']
    });
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  ngOnDestroy() {
    // Clean up markers
    this.clearMarkers();
  }

  private async initializeMap() {
    try {
      this.isLoading = true;
      this.errorMessage = '';

      // Load Google Maps API
      await this.loader.load();

      // Check if we have places with coordinates
      const placesWithCoords = this.getPlacesWithCoordinates();
      
      if (placesWithCoords.length === 0) {
        // No coordinates available, show default view
        this.initializeDefaultMap();
      } else {
        // Initialize map with places
        this.initializeMapWithPlaces(placesWithCoords);
      }

      this.isLoading = false;
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      this.errorMessage = 'Unable to load interactive map. Please check your internet connection.';
      this.isLoading = false;
    }
  }
  private getPlacesWithCoordinates(): Array<{ place: Place; coordinates: { lat: number; lng: number } }> {
    return this.places
      .filter(place => {
        // Check if place has address with coordinates
        if (place.address && this.hasCoordinates(place.address)) {
          return true;
        }
        // If no address but has location string that might have coordinates
        if (place.location && place.location.includes(',')) {
          // Try to parse as "lat,lng" format
          const parts = place.location.split(',').map(part => parseFloat(part.trim()));
          if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            return true;
          }
        }
        return false;
      })
      .map(place => ({
        place,
        coordinates: place.address ? this.getCoordinates(place.address) : this.parseLocationString(place.location)
      }));
  }
  
  private parseLocationString(location: string | undefined): { lat: number; lng: number } {
    if (!location || !location.includes(',')) {
      return { lat: 0, lng: 0 };
    }
    
    // Try to parse as "lat,lng" format
    const parts = location.split(',').map(part => parseFloat(part.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { lat: parts[0], lng: parts[1] };
    }
    
    return { lat: 0, lng: 0 };
  }

  private hasCoordinates(address: Address | string): boolean {
    if (typeof address === 'string') return false;
    return AddressHelper.hasCoordinates(address);
  }

  private getCoordinates(address: Address | string): { lat: number; lng: number } {
    if (typeof address === 'string') return { lat: 0, lng: 0 };
    const coords = AddressHelper.getCoordinates(address);
    return {
      lat: coords?.latitude || 0,
      lng: coords?.longitude || 0
    };
  }

  private initializeDefaultMap() {
    // Default to a world view
    const defaultCenter = { lat: 20, lng: 0 };
    const defaultZoom = 2;

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: defaultCenter,
      zoom: defaultZoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        }
      ]
    });

    // Add a message overlay
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="text-align: center; padding: 10px;">
          <h4>📍 ${this.tripName}</h4>
          <p>Add locations with addresses to see them on the map!</p>
        </div>
      `
    });
    
    infoWindow.setPosition(defaultCenter);
    infoWindow.open(this.map);
  }
  private initializeMapWithPlaces(placesWithCoords: Array<{ place: Place; coordinates: { lat: number; lng: number } }>) {
    // Calculate bounds to fit all markers
    const bounds = new google.maps.LatLngBounds();
    
    placesWithCoords.forEach(({ coordinates }) => {
      bounds.extend(new google.maps.LatLng(coordinates.lat, coordinates.lng));
    });

    // Initialize map with custom options for better visualization
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      fullscreenControl: true,
      streetViewControl: true,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
      },
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        },
        {
          featureType: 'transit',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        }
      ]
    });    // Create markers for each place
    placesWithCoords.forEach(({ place, coordinates }, index) => {
      this.createMarker(place, coordinates, index + 1);
    });

    // Store reference to the currently active place for synchronization with carousel
    this.activePlace = 0;
    
    // Fit map to show all markers
    if (placesWithCoords.length === 1) {
      // Single location - center and zoom appropriately
      this.map.setCenter(placesWithCoords[0].coordinates);
      this.map.setZoom(14); // Good zoom level for single location
    } else if (placesWithCoords.length > 1) {
      // Multiple locations - fit bounds with appropriate padding
      this.map.fitBounds(bounds);
      
      // Better padding calculation based on the number of places
      const padding = {
        top: 60,
        right: 60,
        bottom: 60,
        left: 60
      };
      
      // Apply padding and make sure the zoom isn't too far out or too close
      this.map.fitBounds(bounds, padding);
      
      // Add a listener for when bounds change is complete
      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        // Check if zoom level is too high (too zoomed in)
        const currentZoom = this.map.getZoom();
        if (currentZoom && currentZoom > 15) {
          this.map.setZoom(15); // Limit maximum zoom for multiple locations
        }
        
        // Check if zoom level is too low (too zoomed out)
        if (currentZoom && currentZoom < 3 && placesWithCoords.length < 10) {
          this.map.setZoom(3); // Set minimum zoom for small sets of locations
        }
      });
    }

    // Add trip info window
    this.addTripInfoWindow();
  }
  private createMarker(place: Place, coordinates: { lat: number; lng: number }, index: number) {
    // Generate a unique color for each marker based on the index
    const colors = ['#dc3545', '#198754', '#0d6efd', '#6f42c1', '#fd7e14', '#20c997', '#0dcaf0', '#6610f2'];
    const color = colors[index % colors.length];
    
    // Create animated drop effect for markers
    const marker = new google.maps.Marker({
      position: coordinates,
      map: this.map,
      title: place.name,
      animation: google.maps.Animation.DROP,
      label: {
        text: index.toString(),
        color: 'white',
        fontWeight: 'bold'
      },
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.2 0 0 7.2 0 16c0 8.8 16 24 16 24s16-15.2 16-24C32 7.2 24.8 0 16 0z" fill="${color}"/>
            <circle cx="16" cy="16" r="8" fill="white"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 40),
        anchor: new google.maps.Point(16, 40)
      },
      zIndex: 1000 - index // Higher indices show on top when overlapping
    });

    // Create info window for this marker
    const infoContent = this.createMarkerInfoContent(place, index);
    const infoWindow = new google.maps.InfoWindow({
      content: infoContent
    });    // Add click listener
    marker.addListener('click', () => {
      // Close any open info windows
      this.closeAllInfoWindows();
      infoWindow.open(this.map, marker);
      
      // Store this info window
      this.infoWindows.push(infoWindow);
    });

    this.markers.push(marker);
  }
  private createMarkerInfoContent(place: Place, index: number): string {
    const address = this.getDisplayAddress(place);
    const photoUrl = place.pictures && place.pictures.length > 0 ? place.pictures[0] : null;
    
    // Generate a unique color for each marker based on the index
    const colors = ['#dc3545', '#198754', '#0d6efd', '#6f42c1', '#fd7e14', '#20c997', '#0dcaf0', '#6610f2'];
    const color = colors[index % colors.length];
    
    // Format dates if available
    const startDate = place.startDate ? new Date(place.startDate).toLocaleDateString() : null;
    const endDate = place.endDate ? new Date(place.endDate).toLocaleDateString() : null;
    
    return `
      <div style="max-width: 320px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <span style="background: ${color}; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; margin-right: 8px;">
            ${index}
          </span>
          <h4 style="margin: 0; font-size: 18px; font-weight: 600; color: #333;">${place.name}</h4>
        </div>
        
        ${photoUrl ? `
          <div style="position: relative; overflow: hidden; border-radius: 8px; margin: 10px 0;">
            <img src="${photoUrl}" 
                style="width: 100%; height: 140px; object-fit: cover;"
                onerror="this.style.display='none'" />
            ${place.pictures && place.pictures.length > 1 ? 
              `<div style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.6); color: white; font-size: 12px; padding: 4px 8px; border-radius: 12px;">
                +${place.pictures.length - 1} more photos
              </div>` : ''}
          </div>
        ` : ''}
        
        <div style="margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid ${color};">
          <p style="margin: 0; font-size: 13px; color: #495057; line-height: 1.5;">
            📍 ${address}
          </p>
        </div>
        
        ${(startDate || endDate) ? `
          <div style="display: flex; margin: 8px 0; font-size: 13px; color: #495057;">
            <svg width="16" height="16" viewBox="0 0 24 24" style="margin-right: 6px;">
              <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zM5 7V5h14v2H5zm2 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
            </svg>
            <div>
              ${startDate ? `<div>Start: ${startDate}</div>` : ''}
              ${endDate ? `<div>End: ${endDate}</div>` : ''}
            </div>
          </div>
        ` : ''}
        
        ${place.notes ? `
          <div style="margin: 12px 0;">
            <div style="font-size: 14px; font-weight: 500; color: #343a40; margin-bottom: 4px;">Notes</div>
            <p style="margin: 0; font-size: 13px; color: #495057; line-height: 1.5; max-height: 80px; overflow: hidden;">
              ${place.notes.length > 150 ? place.notes.substring(0, 150) + '...' : place.notes}
            </p>
          </div>
        ` : ''}
        
        ${place.cost ? `
          <div style="margin: 12px 0 4px; display: flex; align-items: center; justify-content: flex-end;">
            <span style="font-size: 14px; font-weight: 600; color: #198754; background: #e9f7ef; padding: 4px 10px; border-radius: 16px;">
              💰 $${place.cost.toLocaleString()}
            </span>
          </div>
        ` : ''}
      </div>
    `;
  }

  private getDisplayAddress(place: Place): string {
    if (place.address) {
      if (typeof place.address === 'string') {
        return place.address;
      }
      return AddressHelper.getDisplayAddress(place.address);
    }
    return place.location || 'No address available';
  }

  private addTripInfoWindow() {
    // Add a control button to show trip summary
    const controlDiv = document.createElement('div');
    controlDiv.style.backgroundColor = 'white';
    controlDiv.style.border = '2px solid #fff';
    controlDiv.style.borderRadius = '8px';
    controlDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlDiv.style.cursor = 'pointer';
    controlDiv.style.marginBottom = '22px';
    controlDiv.style.textAlign = 'center';
    controlDiv.title = 'Trip Summary';

    const controlUI = document.createElement('div');
    controlUI.style.color = 'rgb(25,25,25)';
    controlUI.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlUI.style.fontSize = '14px';
    controlUI.style.lineHeight = '40px';
    controlUI.style.paddingLeft = '5px';
    controlUI.style.paddingRight = '5px';
    controlUI.innerHTML = `📍 ${this.tripName}`;
    controlDiv.appendChild(controlUI);

    // Add event listener
    controlDiv.addEventListener('click', () => {
      const tripInfoContent = `
        <div style="text-align: center; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <h3 style="margin: 0 0 12px 0; color: #333;">🗺️ ${this.tripName}</h3>
          <p style="margin: 8px 0; color: #666;">
            <strong>${this.places.length}</strong> location${this.places.length > 1 ? 's' : ''} on this trip
          </p>
          <div style="margin-top: 12px; font-size: 13px; color: #555;">
            Click on any marker to see location details
          </div>
        </div>
      `;
      
      const tripInfoWindow = new google.maps.InfoWindow({
        content: tripInfoContent
      });
      
      tripInfoWindow.setPosition(this.map.getCenter());
      tripInfoWindow.open(this.map);
    });

    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
  }

  private closeAllInfoWindows() {
    // Close all info windows
    for (const infoWindow of this.infoWindows) {
      infoWindow.close();
    }
  }

  private highlightSelectedPlace() {
    if (!this.map || !this.markers.length || this._selectedPlaceIndex < 0) {
      return;
    }

    // Get places with valid coordinates
    const placesWithCoords = this.getPlacesWithCoordinates();
    if (!placesWithCoords.length) {
      return;
    }

    // Find marker that corresponds to the selected place
    // Note: marker indices are 1-based in our implementation
    if (this._selectedPlaceIndex < placesWithCoords.length) {
      // Close any open info windows first
      this.closeAllInfoWindows();
      
      // Focus on the selected place
      const marker = this.markers[this._selectedPlaceIndex];
      if (marker) {
        // Center the map on this marker
        this.map.panTo(marker.getPosition()!);
        
        // Create an info window for this marker if it doesn't exist
        const place = this.places[this._selectedPlaceIndex];
        const infoContent = this.createMarkerInfoContent(place, this._selectedPlaceIndex + 1);
        const infoWindow = new google.maps.InfoWindow({
          content: infoContent
        });
        
        // Add it to our list of info windows
        this.infoWindows.push(infoWindow);
        
        // Open the info window for this marker
        infoWindow.open(this.map, marker);
        
        // Animate the marker to bounce
        marker.setAnimation(google.maps.Animation.BOUNCE);
        
        // Stop animation after 2 bounces
        setTimeout(() => {
          marker.setAnimation(null);
        }, 1400);
      }
    }
  }
  private clearMarkers() {
    // Clear all markers from the map
    this.markers.forEach(marker => {
      marker.setMap(null);
    });
    this.markers = [];
    
    // Close and clear all info windows
    this.closeAllInfoWindows();
    this.infoWindows = [];
  }

  // Public method to refresh the map when places change
  public refreshMap() {
    if (this.map) {
      this.clearMarkers();
      this.initializeMap();
    }
  }
}
