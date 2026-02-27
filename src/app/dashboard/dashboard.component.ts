import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Auth, signOut } from '@angular/fire/auth';
import { User } from '@angular/fire/auth';
import { LiveAnnouncer } from '@angular/cdk/a11y';



import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';



import { AuthService } from '../auth.service';

interface Roomie {
  name: string;
  dishPoints: number;
  cookingPoints: number;
}

@Component({
    selector: 'app-dashboard',
    imports: [
      CommonModule,
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
    styleUrl: './dashboard.css',
  })
export class DashboardComponent implements OnInit, AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);

  private firestore = inject(Firestore);

  user: User | null = null;
  roomies$!: any;

  displayedColumns: string[] = ['name', 'dishPoints', 'cookingPoints', 'total'];

  constructor(private authService: AuthService) { }

  ngAfterViewInit(): void {
    // If the data source was already created, attach the MatSort.
    if (this.dataSource && this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  // initialize with empty array so binding never sees `undefined`
  dataSource: MatTableDataSource<Roomie> = new MatTableDataSource<Roomie>([]);

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    const roomieCollection = collection(this.firestore, 'roomies');

    this.roomies$ = collectionData(roomieCollection, { idField: 'id' });

    this.roomies$.subscribe((roomies: any[]) => {
      // update existing dataSource rather than creating a new one; this keeps
      // the same reference that the table is bound to and avoids change
      // detection issues.
      this.dataSource.data = roomies;

      // Provide a custom accessor for sorting computed 'total' column.
      this.dataSource.sortingDataAccessor = (item: Roomie, property: string) => {
        if (property === 'total') {
          return (item.dishPoints || 0) + (item.cookingPoints || 0);
        }
        // default behavior: return the property value
        // @ts-ignore - index access for dynamic property
        return (item as any)[property];
      };

      // Attach sort if the view has been initialized and the ViewChild resolved.
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    });
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
