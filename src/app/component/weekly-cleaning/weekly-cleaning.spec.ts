import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyCleaningComponent } from './weekly-cleaning.component';

describe('WeeklyCleaningComponent', () => {
  let component: WeeklyCleaningComponent;
  let fixture: ComponentFixture<WeeklyCleaningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyCleaningComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeeklyCleaningComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
