import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Loader } from '@googlemaps/js-api-loader';
import { Address, AddressHelper } from '../../models/address.model';

interface Place {
  id?: string;
  name: string;
  notes: string;
  pictures: string[];
  location: string;
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
  `,
  styleUrls: ['./interactive-map.component.css']
})
export class InteractiveMapComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapElement', { static: false }) mapElement!: ElementRef;
  @Input() places: Place[] = [];
  @Input() tripName: string = '';
  @Input() mapHeight: number = 400;
  @Input() apiKey: string = ''; // Will be passed from environment or config

  private map!: google.maps.Map;
  private markers: google.maps.Marker[] = [];
  private loader!: Loader;
  
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
      .filter(place => place.address && this.hasCoordinates(place.address))
      .map(place => ({
        place,
        coordinates: this.getCoordinates(place.address!)
      }));
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

    // Initialize map
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        }
      ]
    });

    // Create markers for each place
    placesWithCoords.forEach(({ place, coordinates }, index) => {
      this.createMarker(place, coordinates, index + 1);
    });

    // Fit map to show all markers
    if (placesWithCoords.length === 1) {
      // Single location - center and zoom appropriately
      this.map.setCenter(placesWithCoords[0].coordinates);
      this.map.setZoom(14);
    } else {
      // Multiple locations - fit bounds
      this.map.fitBounds(bounds);
      
      // Add some padding
      const padding = { top: 50, right: 50, bottom: 50, left: 50 };
      this.map.fitBounds(bounds, padding);
    }

    // Add trip info window
    this.addTripInfoWindow();
  }

  private createMarker(place: Place, coordinates: { lat: number; lng: number }, index: number) {
    const marker = new google.maps.Marker({
      position: coordinates,
      map: this.map,
      title: place.name,
      label: {
        text: index.toString(),
        color: 'white',
        fontWeight: 'bold'
      },
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.2 0 0 7.2 0 16c0 8.8 16 24 16 24s16-15.2 16-24C32 7.2 24.8 0 16 0z" fill="#dc3545"/>
            <circle cx="16" cy="16" r="8" fill="white"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 40),
        anchor: new google.maps.Point(16, 40)
      }
    });

    // Create info window for this marker
    const infoContent = this.createMarkerInfoContent(place, index);
    const infoWindow = new google.maps.InfoWindow({
      content: infoContent
    });

    // Add click listener
    marker.addListener('click', () => {
      // Close any open info windows
      this.closeAllInfoWindows();
      infoWindow.open(this.map, marker);
    });

    this.markers.push(marker);
  }

  private createMarkerInfoContent(place: Place, index: number): string {
    const address = this.getDisplayAddress(place);
    const photoUrl = place.pictures && place.pictures.length > 0 ? place.pictures[0] : null;
    
    return `
      <div style="max-width: 300px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <span style="background: #dc3545; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 8px;">
            ${index}
          </span>
          <h4 style="margin: 0; font-size: 16px; font-weight: 600; color: #333;">${place.name}</h4>
        </div>
        
        ${photoUrl ? `
          <img src="${photoUrl}" 
               style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;"
               onerror="this.style.display='none'" />
        ` : ''}
        
        <p style="margin: 8px 0; font-size: 13px; color: #666; line-height: 1.4;">
          📍 ${address}
        </p>
        
        ${place.notes ? `
          <p style="margin: 8px 0; font-size: 13px; color: #555; line-height: 1.4; max-height: 60px; overflow: hidden;">
            ${place.notes.length > 100 ? place.notes.substring(0, 100) + '...' : place.notes}
          </p>
        ` : ''}
        
        ${place.cost ? `
          <p style="margin: 4px 0; font-size: 12px; color: #28a745; font-weight: 500;">
            💰 $${place.cost}
          </p>
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
    // This will be handled by Google Maps automatically when a new info window opens
  }

  private clearMarkers() {
    this.markers.forEach(marker => {
      marker.setMap(null);
    });
    this.markers = [];
  }

  // Public method to refresh the map when places change
  public refreshMap() {
    if (this.map) {
      this.clearMarkers();
      this.initializeMap();
    }
  }
}
