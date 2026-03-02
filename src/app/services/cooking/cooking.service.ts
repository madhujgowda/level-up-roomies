import { Injectable, inject } from '@angular/core';

import { Firestore, collection, doc, writeBatch, Timestamp } from '@angular/fire/firestore';

import { CookingRecord } from '../../models/cooking-record.model';
import { Chef } from '../../models/chef.model';

import { RoomiesService } from '../roomies/roomies.service';

@Injectable({
  providedIn: 'root',
})
export class CookingService {
  private firestore = inject(Firestore);
  private roomiesService = inject(RoomiesService);

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
}
