import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripDetailComponent } from './tripdetail.component';
import { DatePipe } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('TripDetailComponent', () => {
  let component: TripDetailComponent;
  let fixture: ComponentFixture<TripDetailComponent>;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      paramMap: of(convertToParamMap({id: '1'}))
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [TripDetailComponent, HeaderComponent, FooterComponent, DatePipe, RouterModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(TripDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate trip duration correctly', () => {
    component.trip = {
      id: '1',
      name: 'Test Trip',
      date: '2025-05-01',
      amountSpent: 1000,
      endDate: '2025-05-10',
      places: []
    };
    expect(component.calculateDuration()).toBe(9);
  });

  it('should select a place when selectPlace is called', () => {
    const index = 1;
    component.selectPlace(index);
    expect(component.selectedPlaceIndex).toBe(index);
  });
  
  it('should navigate back when navigateBack is called', () => {
    component.navigateBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/trips']);
  });

  it('should return a map image', () => {
    expect(component.getMapImage()).toBeTruthy();
  });
});
