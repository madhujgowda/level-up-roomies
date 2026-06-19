import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-add-grocery-item',
    imports: [
        CommonModule
    ],
    templateUrl: './add-grocery-item.html',
    styleUrl: './add-grocery-item.css',
})
export class AddGroceryItemComponent implements OnInit {
    ngOnInit() {
        
    }
}