import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripproxyService } from '../tripproxy.service';
import { HttpClientModule } from '@angular/common/http';
import { AddressHelper, Address } from '../models/address.model';
import { GooglePlacesAutocompleteService, PlacePrediction } from '../services/google-places-autocomplete.service';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

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

@Component({
  selector: 'app-add-place',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.css']
})
export class AddPlaceComponent implements OnInit, OnDestroy {
  addPlaceForm: FormGroup;
  tripId: string = '';
  tripName: string = '';
  isSubmitting = false;
  submitError = '';
  submitSuccess = false;

  // Autocomplete properties
  addressPredictions: PlacePrediction[] = [];
  selectedAddress: any = null;
  showAutocomplete = false;
  isLoadingPredictions = false;
  selectedPredictionIndex = -1;
  private addressInputSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  private autocompleteTimeout: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tripProxy: TripproxyService,
    private placesService: GooglePlacesAutocompleteService
  ) {
    this.addPlaceForm = this.createForm();
  }

  ngOnInit(): void {
    console.log('AddPlaceComponent initialized');
    
    // Initialize address input debouncing
    this.addressInputSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.searchAddresses(searchTerm);
    });
    
    // Get trip ID from route parameters
    this.route.paramMap.subscribe(params => {
      console.log('Route params:', params);
      console.log('All route params keys:', params.keys);
      const id = params.get('tripId');
      console.log('Extracted tripId from route:', id);
      if (id) {
        this.tripId = id;
        console.log('Set this.tripId to:', this.tripId);
        this.loadTripInfo();
      } else {
        console.error('No trip ID found in route parameters');
        this.submitError = 'No trip ID provided';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.autocompleteTimeout) {
      clearTimeout(this.autocompleteTimeout);
    }
  }

  loadTripInfo(): void {
    console.log('Loading trip info for tripId:', this.tripId);
    // Get trip name for display
    this.tripProxy.getListsIndex().subscribe({
      next: (trips: any[]) => {
        console.log('All trips loaded:', trips);
        const trip = trips.find(t => t._id === this.tripId || t.tripId === this.tripId);
        console.log('Found matching trip:', trip);
        if (trip) {
          this.tripName = trip.name || 'Unknown Trip';
          console.log('Set trip name to:', this.tripName);
        } else {
          console.error('No trip found with ID:', this.tripId);
        }
      },
      error: (err) => {
        console.error('Error loading trip info:', err);
      }
    });
  }

  createForm(): FormGroup {
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

  // Calculate duration for the place
  calculateDuration(): number {
    const startDate = this.addPlaceForm.get('startDate')?.value;
    const endDate = this.addPlaceForm.get('endDate')?.value;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  }

  // Get duration display
  getDurationDisplay(): string {
    const duration = this.calculateDuration();
    return duration > 0 ? `${duration} day${duration !== 1 ? 's' : ''}` : '';
  }

  onFileSelect(event: any): void {
    const files = event.target.files;
    if (files) {
      const currentPhotos = this.addPlaceForm.get('photos')?.value || [];
      const newPhotos = [...currentPhotos, ...Array.from(files)];
      this.addPlaceForm.get('photos')?.setValue(newPhotos);
    }
  }

  removePhoto(photoIndex: number): void {
    const photos = this.addPlaceForm.get('photos')?.value || [];
    photos.splice(photoIndex, 1);
    this.addPlaceForm.get('photos')?.setValue(photos);
  }

  getPhotoName(file: File): string {
    return file.name;
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

  onSubmit(): void {
    console.log('Form submission started');
    console.log('Form valid:', this.addPlaceForm.valid);
    console.log('Form value:', this.addPlaceForm.value);
    console.log('Trip ID:', this.tripId);
    
    if (this.addPlaceForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitError = '';
      this.submitSuccess = false;

      const formData = this.addPlaceForm.value;
      
      // Process photos - convert File objects to Base64 strings
      this.processPhotos(formData.photos || []).then((photoUrls: string[]) => {
        // Transform the form data to match the API expectation
        const placeData = {
          tripId: this.tripId,
          name: formData.name,
          address: this.selectedAddress 
            ? this.selectedAddress 
            : AddressHelper.normalizeAddressForApi(formData.address),
          description: formData.description,
          startDate: formData.startDate, // Keep as string for API
          endDate: formData.endDate, // Keep as string for API
          notes: formData.notes || '',
          cost: formData.cost || 0,
          photos: photoUrls // Include processed photos
        };
        
        // Ensure address has all required fields per server-side model
        if (placeData.address) {
          // If we have a selected address from Google Places, it should already be normalized
          if (!this.selectedAddress) {
            // For manually entered addresses, ensure required fields
            if (!placeData.address.formattedAddress) {
              placeData.address.formattedAddress = typeof formData.address === 'string' ? formData.address : '';
            }
            if (!placeData.address.city) {
              placeData.address.city = 'Unknown';
            }
            if (!placeData.address.country) {
              placeData.address.country = 'Unknown';
            }
          }
        } else {
          // Fallback if address is somehow null
          placeData.address = {
            formattedAddress: typeof formData.address === 'string' ? formData.address : '',
            city: 'Unknown',
            country: 'Unknown'
          };
        }
        
        console.log('Submitting place with address:', JSON.stringify(placeData.address, null, 2));
        console.log('Required address fields check:');
        console.log('- formattedAddress:', placeData.address?.formattedAddress || 'MISSING');
        console.log('- city:', placeData.address?.city || 'MISSING'); 
        console.log('- country:', placeData.address?.country || 'MISSING');
        
        console.log('Submitting place data:', JSON.stringify(placeData, null, 2));

        this.tripProxy.createPlaceForTrip(placeData).subscribe({
          next: (response) => {
            console.log('Place created successfully:', response);
            this.isSubmitting = false;
            this.submitSuccess = true;
            
            // Navigate back to trip detail page after a short delay with refresh parameter
            setTimeout(() => {
              this.router.navigate(['/tripdetail', this.tripId], { 
                queryParams: { refresh: Date.now() } 
              });
            }, 1500);
          },
          error: (error) => {
            console.error('Error creating place:', error);
            console.error('Full error details:', error);
            console.error('Error status:', error.status);
            console.error('Error message:', error.message);
            this.isSubmitting = false;
            this.submitError = `Failed to create place: ${error.status} - ${error.message || 'Please try again.'}`;
          }
        });
      }).catch((error: any) => {
        console.error('Error processing photos:', error);
        this.isSubmitting = false;
        this.submitError = 'Failed to process photos. Please try again.';
      });
    } else {
      // Mark all fields as touched to show validation errors
      console.log('Form is invalid, marking all fields as touched');
      this.markFormGroupTouched(this.addPlaceForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/tripdetail', this.tripId]);
  }

  // Helper methods for validation display
  isFieldInvalid(fieldName: string): boolean {
    const field = this.addPlaceForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.addPlaceForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['min']) return `${fieldName} cannot be negative`;
    }
    if (this.addPlaceForm.errors?.['dateRange'] && (fieldName === 'startDate' || fieldName === 'endDate')) {
      return 'End date must be after start date';
    }
    return '';
  }

  // Google Places Autocomplete Methods
  onAddressInput(event: any): void {
    const value = event.target.value;
    this.addressInputSubject.next(value);
    
    if (value.length < 2) {
      this.hideAutocomplete();
    }
  }

  onAddressFocus(): void {
    const addressValue = this.addPlaceForm.get('address')?.value;
    if (addressValue && addressValue.length >= 2) {
      this.showAutocomplete = true;
    }
  }

  onAddressBlur(): void {
    // Delay hiding to allow for prediction selection
    this.autocompleteTimeout = setTimeout(() => {
      this.hideAutocomplete();
    }, 300);
  }

  private async searchAddresses(query: string): Promise<void> {
    if (!query || query.length < 2) {
      this.hideAutocomplete();
      return;
    }

    this.isLoadingPredictions = true;
    
    try {
      const predictions = await this.placesService.getPlacePredictions(query);
      this.addressPredictions = predictions;
      this.selectedPredictionIndex = -1;
      this.showAutocomplete = predictions.length > 0;
    } catch (error) {
      console.error('Error fetching address predictions:', error);
      this.addressPredictions = [];
      this.showAutocomplete = false;
    } finally {
      this.isLoadingPredictions = false;
    }
  }

  async selectPrediction(prediction: PlacePrediction): Promise<void> {
    if (this.autocompleteTimeout) {
      clearTimeout(this.autocompleteTimeout);
    }

    // Update the form control with the description
    this.addPlaceForm.get('address')?.setValue(prediction.description);
    
    try {
      // Get detailed place information
      const placeDetails = await this.placesService.getPlaceDetails(prediction.place_id);
      
      if (placeDetails) {
        // Convert Google place result to our address format
        const googlePlaceAddress = this.placesService.convertPlaceToAddress(placeDetails);
        // Convert to our frontend Address format
        this.selectedAddress = AddressHelper.fromGooglePlace(googlePlaceAddress);
        console.log('Selected address details:', this.selectedAddress);
      }
    } catch (error) {
      console.error('Error getting place details:', error);
    }

    this.hideAutocomplete();
  }

  private hideAutocomplete(): void {
    this.showAutocomplete = false;
    this.addressPredictions = [];
    this.selectedPredictionIndex = -1;
  }

  // Keyboard navigation for autocomplete
  onAddressKeydown(event: KeyboardEvent): void {
    if (!this.showAutocomplete || this.addressPredictions.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedPredictionIndex = Math.min(
          this.selectedPredictionIndex + 1,
          this.addressPredictions.length - 1
        );
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        this.selectedPredictionIndex = Math.max(this.selectedPredictionIndex - 1, -1);
        break;
      
      case 'Enter':
        event.preventDefault();
        if (this.selectedPredictionIndex >= 0 && this.selectedPredictionIndex < this.addressPredictions.length) {
          this.selectPrediction(this.addressPredictions[this.selectedPredictionIndex]);
        }
        break;
      
      case 'Escape':
        this.hideAutocomplete();
        break;
    }
  }
}
