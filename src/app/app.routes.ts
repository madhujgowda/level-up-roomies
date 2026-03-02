import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AddDishCleaningComponent } from './component/add-dish-cleaning/add-dish-cleaning.component';
import { authGuard } from './auth.guard';
import { HistoryComponent } from './component/history/history.component';
import { AddCookingComponent } from './component/add-cooking/add-cooking.component';

export const routes: Routes = [
    { path: '', component: LoginComponent }, 
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'add-dish-cleaning', component: AddDishCleaningComponent, canActivate: [authGuard] }, 
    { path: 'add-cooking', component: AddCookingComponent, canActivate: [authGuard] }, 
    { path: 'history', component: HistoryComponent, canActivate: [authGuard] }, 
];
