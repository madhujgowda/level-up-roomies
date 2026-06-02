import { Injectable, inject } from '@angular/core';

import { Firestore, collection, collectionData, query, orderBy } from '@angular/fire/firestore';
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
}
