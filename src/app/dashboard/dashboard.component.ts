import { Component, inject, OnInit,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface Roomie {
  name: string;
  dishPoints: number;
  cookingPoints: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule], 
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit{
  private firestore = inject(Firestore);
  roomies$: Observable<Roomie[]> | undefined;

  ngOnInit() {
    // This creates a "live stream" of your data
    const roomieCollection = collection(this.firestore, 'roomies');
    this.roomies$ = collectionData(roomieCollection) as Observable<Roomie[]>;
  }
 }
