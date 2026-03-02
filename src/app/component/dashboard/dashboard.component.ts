import { AfterViewInit, Component, inject, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// Material Imports...
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';

// Services
import { AuthService } from '../../services/auth/auth.service';
import { RoomiesService } from '../../services/roomies/roomies.service'; 

import { Roomie } from '../../models/roomie.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatTableModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    MatChipsModule,
    MatSortModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  private changeDetector = inject(ChangeDetectorRef);
  
  private roomiesService = inject(RoomiesService);
  private authService = inject(AuthService);

  user: any = null; 
  displayedColumns: string[] = ['name', 'dishCleaningPoints', 'cookingPoints', 'total'];
  dataSource = new MatTableDataSource<Roomie>([]);

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.changeDetector.detectChanges();
    });

    this.roomiesService.roomies$.subscribe((roomies: Roomie[]) => {
      this.dataSource.data = roomies;
      this.setupSorting();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  private setupSorting() {
    this.dataSource.sortingDataAccessor = (item: Roomie, property: string) => {
      if (property === 'total') {
        return (item.dishCleaningPoints || 0) + (item.cookingPoints || 0);
      }
      return (item as any)[property];
    };
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}