import { Injectable, inject } from '@angular/core';

import { Firestore, collection, doc, writeBatch } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';

import { RoomiesService } from '../roomies/roomies.service';

@Injectable({
  providedIn: 'root',
})
export class DishCleaningService {
  private roomiesService = inject(RoomiesService);
  constructor(private firestore: Firestore, private auth: Auth) {}

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
}

