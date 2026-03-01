import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Firestore, collection, doc, writeBatch, query, orderBy, collectionData, deleteDoc } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';

import { RoomiesService } from '../roomies/roomies.service';
import { DishCleaningRecord } from '../../models/dish-cleaning-record.model';

@Injectable({
  providedIn: 'root',
})
export class DishCleaningService {
  private roomiesService = inject(RoomiesService);
  constructor(private firestore: Firestore, private auth: Auth) {}

  getAllRecords(): Observable<DishCleaningRecord[]> {
    const recordsRef = collection(this.firestore, 'history', 'dishCleaning', 'records');
    // Ordering by createdDate descending to get newest first
    const q = query(recordsRef, orderBy('createdDate', 'desc')); 

    return combineLatest([
      collectionData(q, { idField: 'id' }),
      this.roomiesService.roomies$ 
    ]).pipe(
      filter(([records, roomies]) => roomies.length > 0),
      map(([records, roomies]) => {
        return records.map(record => {
          const user = roomies.find(roomie => roomie.id === record['uid']);
        
          return {
            ...record,
            userName: user ? user.name : 'Unknown',
          };
        });
      })
    ) as Observable<DishCleaningRecord[]>;
  }

  async addDishCleaningPoints(cleanedDate: Date): Promise<void> {
    const userId = this.auth.currentUser?.uid;
    if (!userId) throw new Error('User not logged in');

    const roomies = this.roomiesService.getRoomies();
    const currentUser = roomies.find(roomie => roomie.id === userId);
    const currentPoints = currentUser?.dishCleaningPoints || 0;
    const newTotalPoints = currentPoints + 1;

    const dishCleaningCollection = collection(this.firestore, 'history', 'dishCleaning', 'records');
    const userDocRef = doc(this.firestore, 'roomies', userId);
    const newRecordRef = doc(dishCleaningCollection);

    const batch = writeBatch(this.firestore);

    batch.set(newRecordRef, {
      uid: userId,
      cleanedDate: cleanedDate,
      createdDate: new Date(),
      previousPoints: currentPoints 
    });

    batch.update(userDocRef, {
      dishCleaningPoints: newTotalPoints
    });

    await batch.commit();
    console.log('Record added with history and points updated!');
  }

  async deleteRecord(recordId: string): Promise<void> {
    const recordDocRef = doc(this.firestore, 'history', 'dishCleaning', 'records', recordId);
    await deleteDoc(recordDocRef);
  }
}

