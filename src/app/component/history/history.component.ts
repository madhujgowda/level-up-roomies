import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';

import { DishCleaningService } from '../../services/dish-cleaning/dish-cleaning.service';

import { DishCleaningRecord } from '../../models/dish-cleaning-record.model';

@Component({
  selector: 'app-history',
  imports: [
    CommonModule, 
    MatTabsModule, 
    MatTableModule
  ],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class HistoryComponent implements OnInit{
  displayedColumns: string[] = ['userName', 'cleanedDate', 'previousPoints'];
  dataSource: DishCleaningRecord[] = [];

  constructor(private dishCleaningService: DishCleaningService) {}

  ngOnInit(): void {
    this.dishCleaningService.getAllRecords().subscribe(async (records) => {
      // Keep only top 5 (assuming sorted descending by date already)
      const top5 = records.slice(0, 5);
      this.dataSource = top5;

      // Identify records to delete
      const toDelete = records.slice(5);

      // Delete records from DB
      for (const record of toDelete) {
        if (record.id) {
          await this.dishCleaningService.deleteRecord(record.id);
        }
      }
    });
  }
}