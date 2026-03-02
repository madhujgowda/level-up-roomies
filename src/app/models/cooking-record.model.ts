import { Chef } from './chef.model';

export class CookingRecord {
  id?: string;
  dishType: string;
  chefs: Chef[];
  cookedDate: Date;
  createdDate: Date;

  constructor(data: any) {
    this.id = data.id;
    this.dishType = data.dishType;
    this.chefs = data.chefs || [];
    this.cookedDate = data.cookedDate;
    this.createdDate = data.createdDate;
  }
}