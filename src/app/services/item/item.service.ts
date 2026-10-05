import { Injectable, inject } from '@angular/core';
import { collection, collectionData, Firestore, where, query, orderBy, limit, updateDoc, addDoc } from '@angular/fire/firestore';
import { writeBatch, doc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Item } from '../../models/item.model';

@Injectable({
    providedIn: 'root',
})

export class ItemService {
    private firestore = inject(Firestore);

    // Fetch all items to support live search filtering
    getAllItems(): Observable<Item[]> {
        const itemsCollection = collection(this.firestore, 'items');
        return collectionData(itemsCollection, { idField: 'id' }) as Observable<Item[]>;
    }

    getGroceryItems(): Observable<Item[]> {
        const itemsCollection = collection(this.firestore, 'items');

        const neededItemsQuery = query(
            itemsCollection,
            where('shopping.needed', '==', true)
        );

        return collectionData(neededItemsQuery, { idField: 'id' }) as Observable<Item[]>;
    }

    // Create a brand-new item not in the database yet
    async addNewItemToGroceryList(name: string) {
        const itemsCollection = collection(this.firestore, 'items');
        try {
            await addDoc(itemsCollection, {
                name: name.trim(),
                category: 'General',
                inventory: { showItem: true, stock: 0, location: 'Pantry' },
                shopping: {
                    needed: true,
                    quantity: 1,
                    lastPurchasedDate: new Date(),
                    preferredStore: '',
                    notes: ''
                }
            });
            console.log(`Successfully created and added new item: ${name}`);
        } catch (error) {
            console.error('Failed to create new item:', error);
            throw error;
        }
    }

    async addExistingItemToGroceryList(selectedItems: any[] | undefined) {
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
                'shopping.needed': false,
                'shopping.lastPurchasedDate': new Date()
            });
            console.log(`Successfully removed item from  grocery list: ${item.id}`);
        } catch (error) {
            console.error('Failed to remove item from grocery list:', error);
            throw error;
        }
    }
}