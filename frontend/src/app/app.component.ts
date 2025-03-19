import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GetBookingsComponent } from "./services/get-bookings/get-bookings.component";
import { GetConfirmedBookingsComponent } from "./services/get-confirmed-bookings/get-confirmed-bookings.component";
import { CalendarComponent } from './components/calendar/calendar.component';
import { BookingService } from './services/booking.service';
import { BookingFormComponent } from "./components/booking-form/booking-form.component";
import { Booking } from './models/booking.model';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { AuthServiceService } from './services/auth.service';
import { HeaderComponent } from './components/header/header.component';
import { MatDialogModule } from '@angular/material/dialog'
import { LandingPageComponent } from "./pages/landing-page/landing-page.component";
import { StaffPageComponent } from "./pages/staff-page/staff-page.component";
import { FbComponent } from './components/fb/fb.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    // GetBookingsComponent,
    // GetConfirmedBookingsComponent,
    // CalendarComponent,
    // BookingFormComponent,
    // LoginComponent,
    HeaderComponent,
    MatDialogModule,
    FbComponent
    // LandingPageComponent,
    // StaffPageComponent
],
  providers: [AuthServiceService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  bookings: Booking[] = [];
  pendingBookings: Booking[] = [];
  confirmedBookings: Booking[] = [];
  blockedDates: string[] = [];

  constructor( private bookingService: BookingService ) {}

}
