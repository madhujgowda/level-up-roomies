import { Injectable } from '@angular/core';

import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class DishCleaningService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  async addDishCleaningPoints(cleanedDate: Date): Promise<void> {
    const userId = this.auth.currentUser?.uid;
    if (!userId) throw new Error('User not logged in');

    const dishCollection = collection(this.firestore, 'history', 'dishCleaning', 'records');
    await addDoc(dishCollection, {
      uid: userId,
      cleanedDate: cleanedDate,
      createdDate: new Date() // Current date
    });
  }
}

