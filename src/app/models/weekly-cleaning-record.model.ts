import { WeeklyCleaningTask } from './weekly-cleaning-task.model';

export class WeeklyCleaningRecord {
  id?: string;
  startDate: Date;
  endDate: Date;
  assignedTasks: WeeklyCleaningTask[];

  constructor(data: any) {
    this.id = data.id;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.assignedTasks = data.assignedTasks || [];
  }
}