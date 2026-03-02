import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-cooking-detail-sheet',
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule, MatCardModule ],
  templateUrl: './cooking-detail-sheet.html',
  styleUrl: './cooking-detail-sheet.css',
})
export class CookingDetailSheetComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<CookingDetailSheetComponent>

  ) {}

  close() {
    this.bottomSheetRef.dismiss();
  }
}
