import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
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
        MatButtonModule 
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
}