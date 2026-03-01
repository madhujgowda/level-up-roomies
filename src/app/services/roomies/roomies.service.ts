import { Injectable, inject } from '@angular/core';

import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

import { Roomie } from '../../models/roomie.model';

@Injectable({
  providedIn: 'root',
})
export class RoomiesService {
  private firestore = inject(Firestore);
  private roomiesSubject = new BehaviorSubject<any[]>([]);

  roomies$: Observable<Roomie[]> = this.roomiesSubject.asObservable();

  constructor() {
    this.loadRoomies();
  }

  private loadRoomies() {
    const usersRef = collection(this.firestore, 'roomies');
    collectionData(usersRef, { idField: 'id' }).subscribe(users => {
      this.roomiesSubject.next(users as Roomie[]);
    });
  }

  getRoomies() {
    return this.roomiesSubject.getValue();
  }
}
