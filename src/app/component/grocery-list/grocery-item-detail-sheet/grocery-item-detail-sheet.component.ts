import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';

import { Item } from '../../../models/item.model';
import { ItemService } from '../../../services/item/item.service';

@Component({
  selector: 'app-grocery-item-detail-sheet',
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatMenuModule, FormsModule],
  standalone: true,
  templateUrl: './grocery-item-detail-sheet.html',
  styleUrl: './grocery-item-detail-sheet.css',
})
export class GroceryItemDetailSheetComponent {
  categories: string[] = [
    'Dairy', 'General', 'Bakery', 'Drinks', 'Herbs', 'Baking',
    'Breakfast foods', 'Condiments', 'Frozen', 'Fruits', 'Vegetables',
    'Health and Beauty', 'Household', 'Spices', 'Meats', 'Other', 'Snacks'
  ];

  preferredStores: string[] = ['Walmart', 'Target', 'Costco', 'Indian Grocery Store'];
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<GroceryItemDetailSheetComponent>,
    private itemService: ItemService
  ) { }

  async updateField() {
    try {
      await this.itemService.updateItemDetails(this.data);
    } catch (error) {
      console.error('Failed to update item details', error);
    }
  }

  incrementQuantity() {
    this.data.shopping.quantity = (this.data.shopping.quantity || 1) + 1;
    this.updateField();
  }

  decrementQuantity() {
    if ((this.data.shopping.quantity || 1) > 1) {
      this.data.shopping.quantity -= 1;
      this.updateField();
    }
  }

  selectCategory(category: string) {
    this.data.category = category;
    this.updateField();
  }

  selectStore(store: string) {
    this.data.shopping.preferredStore = store;
    this.updateField();
  }

  close() {
    this.bottomSheetRef.dismiss();
  }
}
