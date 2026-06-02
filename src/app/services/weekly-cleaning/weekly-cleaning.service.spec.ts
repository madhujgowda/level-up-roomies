import { TestBed } from '@angular/core/testing';

import { WeeklyCleaningService } from './weekly-cleaning.service';

describe('WeeklyCleaningService', () => {
  let service: WeeklyCleaningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeeklyCleaningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
