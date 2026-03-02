import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

import { DishCleaningService } from '../../services/dish-cleaning/dish-cleaning.service';
import { CookingService } from '../../services/cooking/cooking.service';

import { DishCleaningRecord } from '../../models/dish-cleaning-record.model';
import { CookingRecord } from '../../models/cooking-record.model';

@Component({
  selector: 'app-history',
  imports: [
    CommonModule, 
    MatTabsModule, 
    MatMenuModule,
    MatTooltipModule,
    MatTableModule
  ],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class HistoryComponent implements OnInit{
  private changeDetector = inject(ChangeDetectorRef);

  displayedDishColumns: string[] = ['userName', 'cleanedDate', 'previousPoints'];
  dataSourceDishes = new MatTableDataSource<DishCleaningRecord>([]);

  displayedCookingColumns: string[] = ['dishType', 'chefs', 'cookedDate'];
  dataSourceCooking = new MatTableDataSource<CookingRecord>([]);

  constructor(private dishCleaningService: DishCleaningService, private cookingService: CookingService) {}

  private cookingDataLoaded = false;

  ngOnInit(): void {
    this.loadDishRecords();
  }

  onTabChange(event: MatTabChangeEvent) {
    if (event.tab.textLabel === 'Cooking' && !this.cookingDataLoaded) {
      this.loadCookingRecords();
    }
  }

  loadDishRecords() {
    this.dishCleaningService.getAllRecords().subscribe((records) => {
      this.dataSourceDishes.data = records.slice(0, 5);
      this.changeDetector.detectChanges();
      
      const toDelete = records.slice(5);
      for (const record of toDelete) {
        if (record.id) this.dishCleaningService.deleteRecord(record.id);
      }
    });
  }

  loadCookingRecords() {
    if (this.cookingDataLoaded) return;

    this.cookingService.getAllRecords().subscribe((records) => {
      this.dataSourceCooking.data = records.slice(0, 5);
      this.changeDetector.detectChanges();

      this.cookingDataLoaded = true;      

      const toDelete = records.slice(5);
      for (const record of toDelete) {
        if (record.id) this.cookingService.deleteRecord(record.id);
      }
    });
  }
}