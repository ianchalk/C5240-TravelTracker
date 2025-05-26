import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripproxyService } from '../tripproxy.service';
import { HttpClientModule } from '@angular/common/http';

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
export class AddTripComponent implements OnInit {
  addTripForm: FormGroup;
  isSubmitting = false;
  submitError = '';
  submitSuccess = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private tripProxy: TripproxyService
  ) {
    this.addTripForm = this.createForm();
  }

  ngOnInit(): void {
    console.log('AddTripComponent initialized');
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
    this.places.push(this.createPlaceForm());
  }

  removePlace(index: number): void {
    if (this.places.length > 1) {
      this.places.removeAt(index);
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
      
      // Transform the form data to match the API expectation
      const tripData = {
        name: formData.name,
        description: formData.description,
        isPublic: formData.isPublic,
        places: formData.places.map((place: any) => ({
          name: place.name,
          address: place.address,
          description: place.description,
          startDate: new Date(place.startDate),
          endDate: new Date(place.endDate),
          duration: this.calculateDuration(this.places.at(formData.places.indexOf(place))),
          notes: place.notes || '',
          cost: place.cost || 0,
          photos: [] // For now, we'll handle photos separately
        }))
      };

      console.log('Submitting trip data:', tripData);

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
}
