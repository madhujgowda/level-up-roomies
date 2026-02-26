import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', component: LoginComponent }, // Default page
    { path: 'login', component: LoginComponent }
];
