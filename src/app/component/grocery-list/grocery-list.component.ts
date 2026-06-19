import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';

import { Item } from '../../models/item.model';
import { ItemService } from '../../services/item/item.service';

@Component({
    selector: 'app-grocery-list',
    imports: [
        CommonModule,
        MatListModule,
        MatIconModule
    ],
    templateUrl: './grocery-list.html',
    styleUrl: './grocery-list.css',
})
export class GroceryListComponent implements OnInit {

    constructor(private itemService: ItemService) { }

    items$!: Observable<Item[]>;

    ngOnInit() {
        this.items$ = this.itemService.getGroceryItems();
    }
}