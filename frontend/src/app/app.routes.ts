import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'booking', component: BookingFormComponent },
    { path: '', redirectTo: '/booking', pathMatch: 'full' }
];
