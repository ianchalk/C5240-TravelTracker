import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

@Component({
  selector: 'app-add-place',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.css']
})
export class AddPlaceComponent implements OnInit {
  addPlaceForm: FormGroup;
  tripId: string = '';
  tripName: string = '';
  isSubmitting = false;
  submitError = '';
  submitSuccess = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tripProxy: TripproxyService
  ) {
    this.addPlaceForm = this.createForm();
  }

  ngOnInit(): void {
    console.log('AddPlaceComponent initialized');
    
    // Get trip ID from route parameters
    this.route.paramMap.subscribe(params => {
      const id = params.get('tripId');
      if (id) {
        this.tripId = id;
        this.loadTripInfo();
      } else {
        this.submitError = 'No trip ID provided';
      }
    });
  }

  loadTripInfo(): void {
    // Get trip name for display
    this.tripProxy.getListsIndex().subscribe({
      next: (trips: any[]) => {
        const trip = trips.find(t => t._id === this.tripId || t.tripId === this.tripId);
        if (trip) {
          this.tripName = trip.name || 'Unknown Trip';
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

  onSubmit(): void {
    if (this.addPlaceForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitError = '';
      this.submitSuccess = false;

      const formData = this.addPlaceForm.value;
      
      // Transform the form data to match the API expectation
      const placeData = {
        tripId: this.tripId,
        name: formData.name,
        address: formData.address,
        description: formData.description,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        notes: formData.notes || '',
        cost: formData.cost || 0,
        photos: [] // For now, we'll handle photos separately
      };

      console.log('Submitting place data:', placeData);

      this.tripProxy.createPlaceForTrip(placeData).subscribe({
        next: (response) => {
          console.log('Place created successfully:', response);
          this.isSubmitting = false;
          this.submitSuccess = true;
          
          // Navigate back to trip detail page after a short delay
          setTimeout(() => {
            this.router.navigate(['/tripdetail', this.tripId]);
          }, 2000);
        },
        error: (error) => {
          console.error('Error creating place:', error);
          this.isSubmitting = false;
          this.submitError = 'Failed to create place. Please try again.';
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
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
}
