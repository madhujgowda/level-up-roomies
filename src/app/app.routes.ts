import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AddDishCleaningComponent } from './component/add-dish-cleaning/add-dish-cleaning.component';
import { authGuard } from './auth.guard';
import { HistoryComponent } from './component/history/history.component';
import { AddCookingComponent } from './component/add-cooking/add-cooking.component';
import { WeeklyCleaningComponent } from './component/weekly-cleaning/weekly-cleaning.component';
import { GroceryListComponent } from './component/grocery-list/grocery-list.component';

export const routes: Routes = [
    { path: '', component: LoginComponent }, 
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'add-dish-cleaning', component: AddDishCleaningComponent, canActivate: [authGuard] }, 
    { path: 'add-cooking', component: AddCookingComponent, canActivate: [authGuard] }, 
    { path: 'history', component: HistoryComponent, canActivate: [authGuard] }, 
    { path: 'weekly-cleaning', component: WeeklyCleaningComponent, canActivate: [authGuard] },
    { path: 'grocery-list', component: GroceryListComponent, canActivate: [authGuard] }, 


];
