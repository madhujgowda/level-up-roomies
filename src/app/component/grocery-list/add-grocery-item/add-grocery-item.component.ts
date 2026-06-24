import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';

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
    constructor(private router: Router, private firestore: Firestore) { }

    items$!: Observable<Item[]>;

    ngOnInit() {
        this.items$ = this.itemService.getTopRecommendedGroceryItems();
    }

    async onAddSelected(selectedItems: any[] | undefined) {
        try {
            this.itemService.addToGroceryList(selectedItems);
            this.router.navigate(['/grocery-list']);
        }
        catch(error) {
            console.log("Failed to Add to grocery list");
        }
    }

}