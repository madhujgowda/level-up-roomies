import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';

import { MatListModule } from '@angular/material/list';
import { MatChipsModule, MatChipOption } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ItemService } from '../../../services/item/item.service';
import { Item } from '../../../models/item.model';

@Component({
    selector: 'app-add-grocery-item',
    imports: [
        CommonModule,
        FormsModule,
        MatListModule,
        MatChipsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    templateUrl: './add-grocery-item.html',
    styleUrl: './add-grocery-item.css',
})
export class AddGroceryItemComponent implements OnInit {
    private itemService = inject(ItemService);
    constructor(private router: Router, private firestore: Firestore) { }

    allItems$!: Observable<Item[]>;
    filteredItems$!: Observable<Item[]>;
    searchQuery: string = '';
    exactMatchExists: boolean = false;

    // TODO: database reads everytime this page is loaded, consider caching or optimizing queries
    
    ngOnInit() {
        this.allItems$ = this.itemService.getAllItems();
        this.onSearchChange();
    }

    onSearchChange() {
        const query = this.searchQuery.toLowerCase().trim();
        
        this.filteredItems$ = this.allItems$.pipe(
            map(items => {
                if (!query) {
                    // Show top recommendations when search is empty
                    return items
                        .filter(i => !i.shopping?.needed)
                        .sort((a, b) => new Date(b.shopping?.lastPurchasedDate || 0).getTime() - new Date(a.shopping?.lastPurchasedDate || 0).getTime())
                        .slice(0, 10);
                }

                // Filter by search query (matching start or anywhere) and sort alphabetically
                const matches = items.filter(item => 
                    item.name && item.name.toLowerCase().includes(query)
                ).sort((a, b) => a.name.localeCompare(b.name));

                // Check if exact match exists for new item prompting
                this.exactMatchExists = matches.some(item => item.name.toLowerCase() === query);
                return matches;
            })
        );
    }

    async addNewItem() {
        if (!this.searchQuery.trim()) return;
        try {
            await this.itemService.addNewItemToGroceryList(this.searchQuery);
            this.router.navigate(['/grocery-list']);
        } catch (error) {
            console.error('Failed to add new item', error);
        }
    }

    async onAddSelected(selectedItems: any[] | undefined) {
        try {
            this.itemService.addExistingItemToGroceryList(selectedItems);
            this.router.navigate(['/grocery-list']);
        }
        catch(error) {
            console.log("Failed to Add to grocery list");
        }
    }

}