import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { Observable } from 'rxjs';

import { Item } from '../../models/item.model';
import { ItemService } from '../../services/item/item.service';
import { GroceryItemDetailSheetComponent } from './grocery-item-detail-sheet/grocery-item-detail-sheet.component';

@Component({
    selector: 'app-grocery-list',
    imports: [
        CommonModule,
        RouterLink, 
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule 
    ],
    templateUrl: './grocery-list.html',
    styleUrl: './grocery-list.css',
})
export class GroceryListComponent implements OnInit {

    constructor(private itemService: ItemService, private bottomSheet: MatBottomSheet) { }

    items$!: Observable<Item[]>;

    ngOnInit() {
        this.items$ = this.itemService.getGroceryItems();
    }

    onItemSelect(item: Item) {
        this.bottomSheet.open(GroceryItemDetailSheetComponent, { data: item });
    }

    onItemToggle(item: Item, event: MatCheckboxChange) {
        // Update the local model state
        item.shopping.needed = event.checked;

        // Call item service to persist the change in Firebase
        this.itemService.removeItemFromGroceryList(item).catch(error => {
            console.error('Failed to remove item from grocery list', error);
            // Revert local state on error if needed
            item.shopping.needed = !event.checked;
        });
    }
}