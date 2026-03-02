import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { RoomiesService } from '../../services/roomies/roomies.service';
import { CookingService } from '../../services/cooking/cooking.service';

import { Roomie } from '../../models/roomie.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-cooking',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './add-cooking.html',
  styleUrls: ['./add-cooking.css']
})
export class AddCookingComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private roomiesService = inject(RoomiesService);
  private cookingService = inject(CookingService);
  private router = inject(Router);

  cookingForm!: FormGroup;
  roomies: Roomie[] = [];
  private roomiesSub!: Subscription;

  ngOnInit() {
    this.roomiesSub = this.roomiesService.roomies$.subscribe(data => {
      this.roomies = data;
    });
    this.initForm();
  }

  private initForm() {
    this.cookingForm = this.fb.group({
      dishType: ['', Validators.required],
      cookedDate: [new Date(), Validators.required],
      chefs: this.fb.array([this.createChefFormGroup()]) // Start with one chef
    });
  }

  get chefs(): FormArray {
    return this.cookingForm.get('chefs') as FormArray;
  }

  createChefFormGroup(): FormGroup {
    return this.fb.group({
      uid: ['', Validators.required],
      points: [1, [Validators.required, Validators.min(1)]]
    });
  }

  addChef() {
    this.chefs.push(this.createChefFormGroup());
  }

  removeChef(index: number) {
    this.chefs.removeAt(index);
  }

  async onSubmit() {
    if (this.cookingForm.valid) {
      const { dishType, cookedDate, chefs } = this.cookingForm.value;
      try {
        await this.cookingService.addCookingRecord(dishType, cookedDate, chefs);
        this.cookingForm.reset({ cookedDate: new Date(), chefs: [{uid: '', points: 1}] });
        console.log('Record saved!');
        this.router.navigate(['/dashboard']);
      } catch (error) {
        console.error('Error saving record', error);
      }
    }
  }

  ngOnDestroy() {
    if (this.roomiesSub) {
      this.roomiesSub.unsubscribe();
    }
  }
}