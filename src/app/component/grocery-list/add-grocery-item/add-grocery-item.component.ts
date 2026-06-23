import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';

import { MatListModule } from '@angular/material/list';
import { MatChipsModule, MatChipOption } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { ItemService } from '../../../services/item/item.service';
import { Item } from '../../../models/item.model';

@Component({
    selector: 'app-add-grocery-item',
    imports: [
        CommonModule,
        MatListModule,
        MatChipsModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './add-grocery-item.html',
    styleUrl: './add-grocery-item.css',
})
export class AddGroceryItemComponent implements OnInit {
    private itemService = inject(ItemService);

    items$!: Observable<Item[]>;

    ngOnInit() {
        this.items$ = this.itemService.getTopRecommendedGroceryItems();
    }

    async onAddSelected(selectedValue: MatChipOption | MatChipOption[] | undefined) {
        if (!selectedValue) return;

        // 1. Normalize the selection into an array so we can handle single or multiple items uniformly
        const selectedChips = Array.isArray(selectedValue) ? selectedValue : [selectedValue];

        console.log("Selected Chips", selectedChips);
        try {
            // 2. Loop through each selected chip and update Firestore
            // const updatePromises = selectedChips.map(chip => {
            //     const itemData = chip.value; // This is the 'item' object bound to [value]

            //     if (!itemData || !itemData.id) {
            //         console.error('Item structure missing valid Firestore ID attribute', itemData);
            //         return Promise.resolve();
            //     }

            //     // Reference the exact document inside the 'items' collection
            //     const itemDocRef = doc(this.firestore, 'items', itemData.id);

            //     // Update fields using dot-notation to avoid overwriting other nested shopping properties
            //     return updateDoc(itemDocRef, {
            //         'shopping.needed': true,
            //         'shopping.quantity': 1 // Reset count back to 1 upon re-adding to the list
            //     });
            // });

            // 3. Wait for all Firestore write actions to resolve
            // await Promise.all(updatePromises);
            console.log('Successfully re-added items to the active grocery list!');

        } catch (error) {
            console.error('Failed to update grocery list status in Firestore', error);
        }
    }

}