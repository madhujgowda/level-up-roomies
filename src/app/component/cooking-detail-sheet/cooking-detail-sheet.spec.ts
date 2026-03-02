import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookingDetailSheetComponent } from './cooking-detail-sheet.component';

describe('CookingDetailSheetComponent', () => {
  let component: CookingDetailSheetComponent;
  let fixture: ComponentFixture<CookingDetailSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookingDetailSheetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CookingDetailSheetComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
