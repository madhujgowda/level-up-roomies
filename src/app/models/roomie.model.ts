export class Roomie {
  name: string;
  dishCleaningPoints: number;
  cookingPoints: number;

  constructor(data: any) {
    this.name = data.name
    this.dishCleaningPoints = data.dishCleaningPoints || 0;
    this.cookingPoints = data.cookingPoints || 0;
  }

  get totalPoints(): number {
    return this.dishCleaningPoints + this.cookingPoints;
  }
}