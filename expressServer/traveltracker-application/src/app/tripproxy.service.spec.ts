import { TestBed } from '@angular/core/testing';

import { TripproxyService } from './tripproxy.service';

describe('TripproxyService', () => {
  let service: TripproxyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripproxyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
