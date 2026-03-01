import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { DishCleaningService } from '../../services/dish-cleaning/dish-cleaning.service';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-add-dish',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
  ],
  templateUrl: './add-dish-cleaning.html',
  styleUrl: './add-dish-cleaning.css',
})
export class AddDishCleaningComponent {
  cleanedDateControl = new FormControl(new Date(), [Validators.required]);

  constructor(private dishCleaningService: DishCleaningService, private router: Router) {}

  async onSave() {
    const cleanedDate = this.cleanedDateControl.value;
    if (cleanedDate) {
      await this.dishCleaningService.addDishCleaningPoints(cleanedDate);
      this.router.navigate(['/dashboard']);
    }
  }
}
