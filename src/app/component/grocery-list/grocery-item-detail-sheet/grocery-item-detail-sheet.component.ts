import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-grocery-item-detail-sheet',
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule, MatCardModule ],
  templateUrl: './grocery-item-detail-sheet.html',
  styleUrl: './grocery-item-detail-sheet.css',
})
export class GroceryItemDetailSheetComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<GroceryItemDetailSheetComponent>

  ) {}

  close() {
    this.bottomSheetRef.dismiss();
  }
}
