export class DishCleaningRecord {
  id?: string;
  uid: string;
  userName?: string;
  cleanedDate: Date;
  createdDate: Date;
  previousPoints: number;

  constructor(data: any) {
    this.id = data.id;
    this.uid = data.uid;
    this.userName = data.userName;
    this.cleanedDate = data.cleanedDate;
    this.createdDate = data.createdDate;
    this.previousPoints = data.previousPoints || 0;
  }
}