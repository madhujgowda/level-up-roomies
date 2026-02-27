import { Component, inject, OnInit, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Auth, signOut } from '@angular/fire/auth';
import { User } from '@angular/fire/auth';


import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';


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
    MatChipsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  private firestore = inject(Firestore);

user: User | null = null;
  roomies$!: any;

  displayedColumns: string[] = ['name', 'dishPoints', 'cookingPoints', 'total'];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    const roomieCollection = collection(this.firestore, 'roomies');

    this.roomies$ = collectionData(roomieCollection, { idField: 'id' });
  }

}
