import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GetBookingsComponent } from "./services/get-bookings/get-bookings.component";
import { GetConfirmedBookingsComponent } from "./services/get-confirmed-bookings/get-confirmed-bookings.component";
import { CalendarComponent } from './components/calendar/calendar.component';
import { BookingService } from './services/booking.service';

@Component({
  selector: 'app-root',
  imports: [
    // RouterOutlet, 
    GetBookingsComponent, 
    GetConfirmedBookingsComponent,
    CalendarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';
  bookings: any[] = [];

  constructor( private bookingService: BookingService ) {}

  handleBookingsList(bookings: any[]) {
    this.bookings = bookings;
  }

  ngOnInit(): void {
    // this.getAllBookings();
  }
}
