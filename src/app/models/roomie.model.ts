export class Roomie {
    id?: string;
    name: string;
    dishCleaningPoints: number;
    cookingPoints: number;

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name
        this.dishCleaningPoints = data.dishCleaningPoints || 0;
        this.cookingPoints = data.cookingPoints || 0;
    }

    get totalPoints(): number {
        return this.dishCleaningPoints + this.cookingPoints;
    }
}