export class Item {
    id?: string;
    name: string;
    category: string;
    inventory: Inventory;
    shopping: Shopping;

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.category = data.category;
        this.inventory = new Inventory(data.inventory);
        this.shopping = new Shopping(data.shopping);
    }  
}

export class Inventory {
    showItem: boolean;
    stock: number;
    location: string;

    constructor(data: any) {
        this.stock = data.stock;
        this.location = data.location;
        this.showItem = data.showItem;
    }
}

export class Shopping {
    needed: boolean;
    quantity: number;
    lastPurchasedDate: Date;
    preferredStore: string;
    notes: string;

    constructor(data: any) {
        this.needed = data.needed;
        this.quantity = data.quantity;
        this.lastPurchasedDate = data.lastPurchasedDate;
        this.preferredStore = data.preferredStore;
        this.notes = data.notes;
    }
}