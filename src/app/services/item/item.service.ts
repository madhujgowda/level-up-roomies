import { Injectable, inject } from '@angular/core';
import { collection, collectionData, Firestore, where, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Item } from '../../models/item.model';

@Injectable({
    providedIn: 'root',
})
export class ItemService {
    private firestore = inject(Firestore);

    getGroceryItems(): Observable<Item[]> {
        const itemsCollection = collection(this.firestore, 'items');

        const neededItemsQuery = query(
            itemsCollection,
            where('shopping.needed', '==', true)
        );

        return collectionData(neededItemsQuery, { idField: 'id' }) as Observable<Item[]>;
    }


}