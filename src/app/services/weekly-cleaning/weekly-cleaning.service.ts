import { Injectable, inject } from '@angular/core';

import { Firestore, collection, collectionData, query, orderBy, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';

import { map } from 'rxjs/operators';
import { RoomiesService } from '../roomies/roomies.service';


@Injectable({
    providedIn: 'root',
})
export class WeeklyCleaningService {
    private firestore = inject(Firestore);
    private roomiesService = inject(RoomiesService);

    constructor() {

    }

    getAllRecords(): Observable<any[]> {
        const recordsRef = collection(this.firestore, 'weeklyCleaning');
        const q = query(recordsRef, orderBy('startDate', 'desc'));
        const records$ = collectionData(q, { idField: 'id' });

        return combineLatest([
            records$,
            this.roomiesService.roomies$
        ]).pipe(
            map(([records, roomies]) => {
                return records.map(record => {
                    // Assuming the field name in your Firestore document is 'uid' 
                    // Change 'uid' to whatever field name holds the user ID in weeklyCleaning (e.g., 'assignedTo')
                    const updatedTasks = Array.isArray(record['assignedTasks'])
                        ? record['assignedTasks'].map((taskObj: any) => {
                            const user = roomies.find(r => r.id === taskObj.uid);
                            return {
                                ...taskObj,
                                // Adds userName directly to the specific task object
                                userName: user ? user.name : 'Loading...',
                            };
                        })
                        : [];

                    return {
                        ...record,
                        // Fallback to 'Loading...' if roomies data isn't stream-ready yet
                        assignedTasks: updatedTasks
                    };
                });
            })
        )
    }

    async markAsDone(docId: string, taskName: string) {
        try {
            // 1. Reference the specific document in 'weeklyCleaning'
            const docRef = doc(this.firestore, 'weeklyCleaning', docId);

            // 2. Fetch the latest data snapshot from Firestore
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const tasksArray = data['assignedTasks'] || [];

                // 3. Find the specific task in the array by its name
                const taskIndex = tasksArray.findIndex((t: any) => t.task === taskName);

                if (taskIndex !== -1) {
                    // 4. Update the status of that specific array element
                    tasksArray[taskIndex].status = 'Done';

                    // 5. Save the updated array back to Firestore
                    await updateDoc(docRef, {
                        assignedTasks: tasksArray
                    });

                    console.log(`Successfully marked "${taskName}" as Done!`);
                } else {
                    console.error(`Task "${taskName}" not found in the array.`);
                }
            } else {
                console.error('Document does not exist!');
            }
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    }
}
