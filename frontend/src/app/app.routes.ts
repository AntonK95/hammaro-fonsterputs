import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { StaffPageComponent } from './pages/staff-page/staff-page.component';
import { AuthGuard } from './services/auth.guard';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'booking', component: BookingFormComponent },
    { path: '', component: LandingPageComponent },
    { path: 'staff', component: StaffPageComponent, canActivate: [AuthGuard]},
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
