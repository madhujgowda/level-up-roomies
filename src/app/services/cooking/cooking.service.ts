import { Injectable, inject } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Firestore, collection, doc, writeBatch, orderBy, collectionData, query, deleteDoc } from '@angular/fire/firestore';

import { CookingRecord } from '../../models/cooking-record.model';
import { Chef } from '../../models/chef.model';

import { RoomiesService } from '../roomies/roomies.service';

@Injectable({
  providedIn: 'root',
})
export class CookingService {
  private firestore = inject(Firestore);
  private roomiesService = inject(RoomiesService);

  getAllRecords(): Observable<any[]> {
    const recordsRef = collection(this.firestore, 'history', 'cooking', 'records');
    const q = query(recordsRef, orderBy('createdDate', 'desc'));

    return combineLatest([
      collectionData(q, { idField: 'id' }),
      this.roomiesService.roomies$ 
    ]).pipe(
      map(([records, roomies]) => {
        return records.map(record => {
          const mappedChefs = record['chefs'].map((chef: any) => ({
            ...chef,
            name: roomies.find(r => r.id === chef.uid)?.name || 'Unknown'
          }));

          return {
            ...record,
            chefs: mappedChefs,
            cookedDate: record['cookedDate']?.toDate()
          };
        });
      })
    );
  }

  async addCookingRecord(dishType: string, cookedDate: Date, chefsInput: { uid: string, points: number }[]): Promise<void> {
    
    const batch = writeBatch(this.firestore);
    const cookingRecordsRef = collection(this.firestore, 'history', 'cooking', 'records');
    const newRecordRef = doc(cookingRecordsRef);
    
    const chefsData: Chef[] = []; 

    for (const input of chefsInput) {
      const roomie = this.roomiesService.getRoomie(input.uid);
      if (!roomie) throw new Error(`Roomie not found: ${input.uid}`);

      const previousPoints = roomie.cookingPoints || 0;
      const newTotalPoints = previousPoints + input.points;

      chefsData.push({
        uid: input.uid,
        pointsEarned: input.points,
        previousPoints: previousPoints
      });

      const roomieDocRef = doc(this.firestore, 'roomies', input.uid);
      batch.update(roomieDocRef, { cookingPoints: newTotalPoints });
    }

    const record: CookingRecord = {
      dishType,
      chefs: chefsData, 
      cookedDate: cookedDate,
      createdDate: new Date()
    };
    batch.set(newRecordRef, record);

    await batch.commit();
    console.log('Cooking record added and points updated!');
  }

  async deleteRecord(id: string): Promise<void> {
    const docRef = doc(this.firestore, 'history', 'cooking', 'records', id);
    await deleteDoc(docRef);
    console.log('Record deleted');
  }
}
