import { TestBed } from '@angular/core/testing';

import { RoomiesService } from './roomies.service';

describe('RoomiesService', () => {
  let service: RoomiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
