import { TestBed } from '@angular/core/testing';

import { DishCleaning } from './dish-cleaning.service';

describe('DishCleaning', () => {
  let service: DishCleaning;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DishCleaning);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
