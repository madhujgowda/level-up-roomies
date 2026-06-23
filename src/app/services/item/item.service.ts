import { Injectable, inject } from '@angular/core';
import { collection, collectionData, Firestore, where, query, orderBy, limit } from '@angular/fire/firestore';
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

    getTopRecommendedGroceryItems(): Observable<Item[]> {
        const itemsCollection = collection(this.firestore, 'items');

        const recommendationsQuery = query(
            itemsCollection,
            where('shopping.needed', '==', false),
            orderBy('shopping.lastPurchasedDate', 'desc'),
            limit(10)
        );
        return collectionData(recommendationsQuery, { idField: 'id' }) as Observable<Item[]>;
    }
}