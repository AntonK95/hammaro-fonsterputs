import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { BookingService } from './services/booking.service';
import { Booking } from './models/booking.model';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from './services/auth.service';
import { HeaderComponent } from './components/header/header.component';
import { MatDialogModule } from '@angular/material/dialog'
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    MatDialogModule,
    FooterComponent
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

  // constructor( private bookingService: BookingService ) {}

}
