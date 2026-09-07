import { Injectable, inject } from '@angular/core';
import { collection, collectionData, Firestore, where, query, orderBy, limit, updateDoc } from '@angular/fire/firestore';
import { writeBatch, doc } from 'firebase/firestore';
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

    async addToGroceryList(selectedItems: any[] | undefined) {
        if (!selectedItems || selectedItems.length === 0) return;

        const batch = writeBatch(this.firestore);

        try {
            selectedItems.forEach(item => {
                if (item && item.id) {
                    const itemDocRef = doc(this.firestore, 'items', item.id);

                    // Queue the status updates to flag them into the main list view
                    batch.update(itemDocRef, {
                        'shopping.needed': true,
                        'shopping.quantity': 1
                    });
                }
            });

            // Complete the batch payload operation
            await batch.commit();
            console.log(`Successfully batch-updated ${selectedItems.length} items!`);

        } catch (error) {
            console.error('Failed to execute Firestore batch update:', error);
            throw error;
        }
    }

    async removeItemFromGroceryList(item: Item) {
        if (!item || !item.id) return;

        const itemDocRef = doc(this.firestore, 'items', item.id);

        try {
            await updateDoc(itemDocRef, {
                'shopping.needed': false
            });
            console.log(`Successfully removed item from  grocery list: ${item.id}`);
        } catch (error) {
            console.error('Failed to remove item from grocery list:', error);
            throw error;
        }
    }
}