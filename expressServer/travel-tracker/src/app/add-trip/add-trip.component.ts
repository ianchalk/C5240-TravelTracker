import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripproxyService } from '../tripproxy.service';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { AddressHelper, Address } from '../models/address.model';
import { GooglePlacesAutocompleteService, PlacePrediction } from '../services/google-places-autocomplete.service';
import { Subscription, Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

interface PlaceFormData {
  name: string;
  address: string;
  description: string;
  startDate: string;
  endDate: string;
  notes: string;
  cost: number;
  photos: File[];
}

interface TripFormData {
  name: string;
  description: string;
  isPublic: boolean;
  places: PlaceFormData[];
}

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.css']
})
export class AddTripComponent implements OnInit, OnDestroy {
  addTripForm: FormGroup;
  isSubmitting = false;
  submitError = '';
  submitSuccess = false;

  // Authentication properties
  isAuthenticated: boolean = false;
  currentUser: any = null;
  private authSubscriptions: Subscription[] = [];

  // Autocomplete properties - one set per place
  addressPredictions: { [placeIndex: number]: PlacePrediction[] } = {};
  selectedAddresses: { [placeIndex: number]: any } = {};
  showAutocomplete: { [placeIndex: number]: boolean } = {};
  isLoadingPredictions: { [placeIndex: number]: boolean } = {};
  selectedPredictionIndex: { [placeIndex: number]: number } = {};
  private addressInputSubjects: { [placeIndex: number]: Subject<string> } = {};
  private destroy$ = new Subject<void>();
  private autocompleteTimeouts: { [placeIndex: number]: any } = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private tripProxy: TripproxyService,
    private authService: AuthService,
    private placesService: GooglePlacesAutocompleteService
  ) {
    this.addTripForm = this.createForm();
  }

  ngOnInit(): void {
    console.log('AddTripComponent initialized');
    
    // Initialize autocomplete for the first place (index 0)
    this.initializeAutocompleteForPlace(0);
    
    // Check authentication status
    const authSub = this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      console.log('Authentication status in AddTripComponent:', isAuth);
      
      if (!isAuth) {
        console.log('User not authenticated, redirecting to trips page');
        alert('Please sign in to add a new trip.');
        this.router.navigate(['/trips']);
      }
    });
    this.authSubscriptions.push(authSub);

    const userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log('Current user in AddTripComponent:', user);
    });
    this.authSubscriptions.push(userSub);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Clean up autocomplete timeouts
    Object.values(this.autocompleteTimeouts).forEach(timeout => {
      if (timeout) clearTimeout(timeout);
    });
    
    // Clean up subscriptions
    this.authSubscriptions.forEach(sub => sub.unsubscribe());
  }

  createForm(): FormGroup {
    return this.fb.group({
      // Trip Information
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      isPublic: [false],
      
      // Places Array - at least one place required
      places: this.fb.array([this.createPlaceForm()], [Validators.minLength(1)])
    });
  }

  createPlaceForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      notes: [''],
      cost: [0, [Validators.min(0)]],
      photos: [[]] // Array of files
    }, { validators: this.dateRangeValidator });
  }

  // Custom validator to ensure end date is after start date
  dateRangeValidator(control: any) {
    const startDate = control.get('startDate');
    const endDate = control.get('endDate');
    
    if (startDate && endDate && startDate.value && endDate.value) {
      const start = new Date(startDate.value);
      const end = new Date(endDate.value);
      
      if (end < start) {
        return { dateRange: true };
      }
    }
    return null;
  }

  get places(): FormArray {
    return this.addTripForm.get('places') as FormArray;
  }

  // Calculate duration for a place
  calculateDuration(place: any): number {
    const startDate = place.get('startDate').value;
    const endDate = place.get('endDate').value;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  }

  // Get duration display for a place
  getDurationDisplay(placeIndex: number): string {
    const place = this.places.at(placeIndex);
    const duration = this.calculateDuration(place);
    return duration > 0 ? `${duration} day${duration !== 1 ? 's' : ''}` : '';
  }

  addPlace(): void {
    const newIndex = this.places.length;
    this.places.push(this.createPlaceForm());
    this.initializeAutocompleteForPlace(newIndex);
  }

  removePlace(index: number): void {
    if (this.places.length > 1) {
      this.places.removeAt(index);
      this.cleanupAutocompleteForPlace(index);
    }
  }

  onFileSelect(event: any, placeIndex: number): void {
    const files = event.target.files;
    if (files) {
      const place = this.places.at(placeIndex);
      const currentPhotos = place.get('photos')?.value || [];
      const newPhotos = [...currentPhotos, ...Array.from(files)];
      place.get('photos')?.setValue(newPhotos);
    }
  }

  removePhoto(placeIndex: number, photoIndex: number): void {
    const place = this.places.at(placeIndex);
    const photos = place.get('photos')?.value || [];
    photos.splice(photoIndex, 1);
    place.get('photos')?.setValue(photos);
  }

  getPhotoName(file: File): string {
    return file.name;
  }

  onSubmit(): void {
    if (this.addTripForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitError = '';
      this.submitSuccess = false;

      const formData = this.addTripForm.value;
      
      // Process photos for all places
      this.processAllPhotos(formData.places).then((processedPlaces: any[]) => {
        // Transform the form data to match the API expectation
        const tripData = {
          name: formData.name,
          description: formData.description,
          isPublic: formData.isPublic,
          userId: this.currentUser?._id || this.currentUser?.userId || null, // Use MongoDB _id or custom userId
          places: processedPlaces.map((place: any, index: number) => ({
            name: place.name,
            address: this.selectedAddresses[index] 
              ? this.selectedAddresses[index] 
              : AddressHelper.normalizeAddressForApi(place.address),
            description: place.description,
            startDate: new Date(place.startDate),
            endDate: new Date(place.endDate),
            duration: this.calculateDuration(this.places.at(index)),
            notes: place.notes || '',
            cost: place.cost || 0,
            photos: place.photos // Include processed photos
          }))
        };

        console.log('Submitting trip data:', tripData);
        console.log('Current user information:', this.currentUser);

        this.tripProxy.createTripWithPlaces(tripData).subscribe({
          next: (response) => {
            console.log('Trip created successfully:', response);
            this.isSubmitting = false;
            this.submitSuccess = true;
            
            // Navigate back to trips page after a short delay
            setTimeout(() => {
              this.router.navigate(['/trips']);
            }, 2000);
          },
          error: (error) => {
            console.error('Error creating trip:', error);
            this.isSubmitting = false;
            this.submitError = 'Failed to create trip. Please try again.';
          }
        });
      }).catch((error: any) => {
        console.error('Error processing photos:', error);
        this.isSubmitting = false;
        this.submitError = 'Failed to process photos. Please try again.';
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.addTripForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/trips']);
  }

  // Helper methods for validation display
  isFieldInvalid(fieldName: string): boolean {
    const field = this.addTripForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isPlaceFieldInvalid(placeIndex: number, fieldName: string): boolean {
    const place = this.places.at(placeIndex);
    const field = place?.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.addTripForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
    }
    return '';
  }

  getPlaceFieldError(placeIndex: number, fieldName: string): string {
    const place = this.places.at(placeIndex);
    const field = place?.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['min']) return `${fieldName} cannot be negative`;
    }
    if (place?.errors?.['dateRange'] && (fieldName === 'startDate' || fieldName === 'endDate')) {
      return 'End date must be after start date';
    }
    return '';
  }

  // Process photos for all places - convert File objects to Base64 strings
  private async processAllPhotos(places: any[]): Promise<any[]> {
    const processedPlaces = [];
    
    for (const place of places) {
      const processedPhotos = await this.processPhotos(place.photos || []);
      processedPlaces.push({
        ...place,
        photos: processedPhotos
      });
    }
    
    return processedPlaces;
  }

  // Process photos - convert File objects to Base64 strings
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

  // Google Places Autocomplete Methods
  initializeAutocompleteForPlace(placeIndex: number): void {
    // Initialize autocomplete state for this place
    this.addressPredictions[placeIndex] = [];
    this.selectedAddresses[placeIndex] = null;
    this.showAutocomplete[placeIndex] = false;
    this.isLoadingPredictions[placeIndex] = false;
    this.selectedPredictionIndex[placeIndex] = -1;
    
    // Create new subject for this place
    this.addressInputSubjects[placeIndex] = new Subject<string>();
    
    // Set up debounced search for this place
    this.addressInputSubjects[placeIndex].pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.searchAddresses(placeIndex, searchTerm);
    });
  }

  cleanupAutocompleteForPlace(placeIndex: number): void {
    // Clean up autocomplete state for removed place
    delete this.addressPredictions[placeIndex];
    delete this.selectedAddresses[placeIndex];
    delete this.showAutocomplete[placeIndex];
    delete this.isLoadingPredictions[placeIndex];
    delete this.selectedPredictionIndex[placeIndex];
    
    if (this.addressInputSubjects[placeIndex]) {
      this.addressInputSubjects[placeIndex].complete();
      delete this.addressInputSubjects[placeIndex];
    }
    
    if (this.autocompleteTimeouts[placeIndex]) {
      clearTimeout(this.autocompleteTimeouts[placeIndex]);
      delete this.autocompleteTimeouts[placeIndex];
    }
  }

  onAddressInput(event: any, placeIndex: number): void {
    const value = event.target.value;
    if (this.addressInputSubjects[placeIndex]) {
      this.addressInputSubjects[placeIndex].next(value);
    }
    
    if (value.length < 2) {
      this.hideAutocomplete(placeIndex);
    }
  }

  onAddressFocus(placeIndex: number): void {
    const place = this.places.at(placeIndex);
    const addressValue = place?.get('address')?.value;
    if (addressValue && addressValue.length >= 2) {
      this.showAutocomplete[placeIndex] = true;
    }
  }

  onAddressBlur(placeIndex: number): void {
    // Delay hiding to allow for prediction selection
    this.autocompleteTimeouts[placeIndex] = setTimeout(() => {
      this.hideAutocomplete(placeIndex);
    }, 300);
  }

  private async searchAddresses(placeIndex: number, query: string): Promise<void> {
    if (!query || query.length < 2) {
      this.hideAutocomplete(placeIndex);
      return;
    }

    this.isLoadingPredictions[placeIndex] = true;
    
    try {
      const predictions = await this.placesService.getPlacePredictions(query);
      this.addressPredictions[placeIndex] = predictions;
      this.selectedPredictionIndex[placeIndex] = -1;
      this.showAutocomplete[placeIndex] = predictions.length > 0;
    } catch (error) {
      console.error('Error fetching address predictions:', error);
      this.addressPredictions[placeIndex] = [];
      this.showAutocomplete[placeIndex] = false;
    } finally {
      this.isLoadingPredictions[placeIndex] = false;
    }
  }

  async selectPrediction(placeIndex: number, prediction: PlacePrediction): Promise<void> {
    if (this.autocompleteTimeouts[placeIndex]) {
      clearTimeout(this.autocompleteTimeouts[placeIndex]);
    }

    // Update the form control with the description
    const place = this.places.at(placeIndex);
    place?.get('address')?.setValue(prediction.description);
    
    try {
      // Get detailed place information
      const placeDetails = await this.placesService.getPlaceDetails(prediction.place_id);
      
      if (placeDetails) {
        // Convert Google place result to our address format
        const googlePlaceAddress = this.placesService.convertPlaceToAddress(placeDetails);
        // Convert to our frontend Address format
        this.selectedAddresses[placeIndex] = AddressHelper.fromGooglePlace(googlePlaceAddress);
        console.log('Selected address details for place', placeIndex, ':', this.selectedAddresses[placeIndex]);
      }
    } catch (error) {
      console.error('Error getting place details:', error);
    }

    this.hideAutocomplete(placeIndex);
  }

  private hideAutocomplete(placeIndex: number): void {
    this.showAutocomplete[placeIndex] = false;
    this.addressPredictions[placeIndex] = [];
    this.selectedPredictionIndex[placeIndex] = -1;
  }

  // Keyboard navigation for autocomplete
  onAddressKeydown(event: KeyboardEvent, placeIndex: number): void {
    if (!this.showAutocomplete[placeIndex] || !this.addressPredictions[placeIndex] || this.addressPredictions[placeIndex].length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedPredictionIndex[placeIndex] = Math.min(
          this.selectedPredictionIndex[placeIndex] + 1,
          this.addressPredictions[placeIndex].length - 1
        );
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        this.selectedPredictionIndex[placeIndex] = Math.max(this.selectedPredictionIndex[placeIndex] - 1, -1);
        break;
      
      case 'Enter':
        event.preventDefault();
        if (this.selectedPredictionIndex[placeIndex] >= 0 && this.selectedPredictionIndex[placeIndex] < this.addressPredictions[placeIndex].length) {
          this.selectPrediction(placeIndex, this.addressPredictions[placeIndex][this.selectedPredictionIndex[placeIndex]]);
        }
        break;
      
      case 'Escape':
        this.hideAutocomplete(placeIndex);
        break;
    }
  }
}
