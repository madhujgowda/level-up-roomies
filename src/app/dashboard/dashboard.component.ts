import { Component, inject, OnInit, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Auth, signOut } from '@angular/fire/auth';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
    MatProgressBarModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  private firestore = inject(Firestore);

  roomies$!: any;

  displayedColumns: string[] = ['name', 'dishPoints', 'cookingPoints', 'total'];

  ngOnInit() {
    // 1. Reference the 'roomies' collection
    const roomieCollection = collection(this.firestore, 'roomies');

    // 2. Create a query to sort by total points (highest first)
    // Note: To sort by a sum of two fields, we usually sort by one 
    // or fetch all and sort in TS. Here we'll just fetch them all.
    this.roomies$ = collectionData(roomieCollection, { idField: 'id' });
  }

}
