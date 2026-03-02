import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCookingComponent } from './add-cooking.component';

describe('AddCookingComponent', () => {
  let component: AddCookingComponent;
  let fixture: ComponentFixture<AddCookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCookingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCookingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
