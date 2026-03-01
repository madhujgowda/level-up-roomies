import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDishCleaningComponent } from './add-dish-cleaning.component';

describe('AddDishCleaningComponent', () => {
  let component: AddDishCleaningComponent;
  let fixture: ComponentFixture<AddDishCleaningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDishCleaningComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddDishCleaningComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
