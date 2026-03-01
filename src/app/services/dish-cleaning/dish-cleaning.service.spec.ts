import { TestBed } from '@angular/core/testing';

import { DishCleaningService } from './dish-cleaning.service';

describe('DishCleaningService', () => {
  let service: DishCleaningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DishCleaningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
