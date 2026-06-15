import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '@angular/fire/auth';

import { WeeklyCleaningService } from '../../services/weekly-cleaning/weekly-cleaning.service';
import { WeeklyCleaningRecord } from '../../models/weekly-cleaning-record.model';

import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-weekly-cleaning',
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    DatePipe
  ],
  templateUrl: './weekly-cleaning.html',
  styleUrl: './weekly-cleaning.css',
})
export class WeeklyCleaningComponent implements OnInit {
  currentUserId: string | undefined = undefined;

  displayedUpcomingAssignedTasksColumns: string[] = ['uid', 'task'];
  displayedAssignedTasksColumns: string[] = ['uid', 'task', 'status', 'action'];

  dataSourceCurrentWeek = new MatTableDataSource<WeeklyCleaningRecord>([]);
  dataSourceUpcomingWeek = new MatTableDataSource<WeeklyCleaningRecord>([]);
  dataSourcePreviousWeek = new MatTableDataSource<WeeklyCleaningRecord>([]);

  currentWeekRecordId: string = "";
  previousWeekRecordId: string = "";

  currentStartDate: Date | null = null;
  currentEndDate: Date | null = null;
  upcomingStartDate: Date | null = null;
  upcomingEndDate: Date | null = null;
  previousStartDate: Date | null = null;
  previousEndDate: Date | null = null;

  constructor(private weeklyCleaningService: WeeklyCleaningService, private changeDetector: ChangeDetectorRef, private auth: Auth) { }

  ngOnInit(): void {
    this.currentUserId = this.auth.currentUser?.uid;

    this.weeklyCleaningService.getAllRecords().subscribe(async (records) => {
      await this.checkAndRotateOldestRecord(records);

      this.dataSourceCurrentWeek.data = [];
      this.dataSourceUpcomingWeek.data = [];
      this.dataSourcePreviousWeek.data = [];

      const categorizedRecords = this.categorizeFirestoreWeeklyRecords(records);
      categorizedRecords.filter(r => r.category === 'Current Week').map(r => {
        this.dataSourceCurrentWeek.data = r.assignedTasks;
        this.currentWeekRecordId = r.id || null;
        this.currentStartDate = r.startDate.toDate();
        this.currentEndDate = r.endDate.toDate();
        this.changeDetector.detectChanges();
      });
      categorizedRecords.filter(r => r.category === 'Upcoming Week').map(r => {
        this.dataSourceUpcomingWeek.data = r.assignedTasks;
        this.upcomingStartDate = r.startDate.toDate();
        this.upcomingEndDate = r.endDate.toDate();
        this.changeDetector.detectChanges();
      });
      categorizedRecords.filter(r => r.category === 'Previous Week').map(r => {
        this.dataSourcePreviousWeek.data = r.assignedTasks;
        this.previousWeekRecordId = r.id || null;
        this.previousStartDate = r.startDate.toDate();
        this.previousEndDate = r.endDate.toDate();
        this.changeDetector.detectChanges();
      });

    });
  }

  categorizeFirestoreWeeklyRecords(records: any[]) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate Monday of the current week
    const dayOfWeek = today.getDay();
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    const currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() + diffToMonday);
    const currentMondayTs = currentMonday.getTime();

    // Calculate Sunday of the current week (end of day)
    const currentSundayTs = currentMondayTs + (7 * 24 * 60 * 60 * 1000) - 1;

    return records.map(record => {
      // 1. Convert Firestore seconds to JS Milliseconds
      const recordMs = record.startDate.seconds * 1000;

      // 2. Normalize the record date to midnight to ensure clean comparison
      const recordDate = new Date(recordMs);
      recordDate.setHours(0, 0, 0, 0);
      const recordStartTs = recordDate.getTime();

      let category: string;

      if (recordStartTs < currentMondayTs) {
        category = 'Previous Week';
      } else if (recordStartTs > currentSundayTs) {
        category = 'Upcoming Week';
      } else {
        category = 'Current Week';
      }

      return { ...record, category };
    });
  }

  async checkAndRotateOldestRecord(records: any[]) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayOfWeek = today.getDay();
    const diffToNextMonday = (dayOfWeek === 0 ? 1 : 8) - dayOfWeek;
    const diffToCurrentMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;

    const currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() + diffToCurrentMonday);

    const currentSunday = new Date(currentMonday);
    currentSunday.setDate(currentMonday.getDate() + 6);
    currentSunday.setHours(23, 59, 59, 999);

    const upcomingMonday = new Date(today);
    upcomingMonday.setDate(today.getDate() + diffToNextMonday);

    const upcomingSunday = new Date(upcomingMonday);
    upcomingSunday.setDate(upcomingMonday.getDate() + 6);
    upcomingSunday.setHours(23, 59, 59, 999);

    const sortedRecords = [...records].sort((a, b) => a.startDate.seconds - b.startDate.seconds);
    let oldestRecord = sortedRecords[0];

    const hasUpcomingWeek = records.some(r => {
      const rStartMs = r.startDate.seconds * 1000;
      return rStartMs >= upcomingMonday.getTime();
    });

    const hasCurrentWeek = records.some(r => {
      const rStartMs = r.startDate.seconds * 1000;
      return rStartMs >= today.getTime() && rStartMs <= upcomingSunday.getTime();
    });

    console.log('hasUpcomingWeek:', hasUpcomingWeek, 'hasCurrentWeek:', hasCurrentWeek, 'today:', today);

    if (!hasUpcomingWeek) {
      if (!hasCurrentWeek) {
        this.updateWeeklyRecord(oldestRecord, currentMonday, currentSunday);
        oldestRecord = sortedRecords[1]; // Shift the pointer to the next oldest for the upcoming week rotation
      }
      this.updateWeeklyRecord(oldestRecord, upcomingMonday, upcomingSunday);
    }
  }

  async updateWeeklyRecord(record: any, monday: Date, sunday: Date) {
    const resetTasks = (record.assignedTasks || []).map((task: any) => ({
      task: task.task,
      uid: task.uid,
      status: 'Pending' // Reset cleanly for next usage iteration
    }));

    const rotatedPayload = {
      startDate: monday,
      endDate: sunday,
      assignedTasks: resetTasks
    };

    try {
      console.log(`Prepared rotated payload for week:`, record.id, rotatedPayload);
      await this.weeklyCleaningService.updateWeeklyRecord(record.id, rotatedPayload);
    } catch (error) {
      console.error('Failed executing circular shifting rotation:', error);
    }
  }

  async markAsDone(docId: string, taskName: string) {
    console.log(`Marking task as done: docId=${docId}, taskName=${taskName}`);
    try {
      await this.weeklyCleaningService.updateTaskStatus(docId, taskName);
    } catch (error) {
      console.error('Error marking task as done:', error);
    }
  }
}