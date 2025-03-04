import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GetBookingsComponent } from "./services/get-bookings/get-bookings.component";
import { GetConfirmedBookingsComponent } from "./services/get-confirmed-bookings/get-confirmed-bookings.component";
import { CalendarComponent } from './components/calendar/calendar.component';
import { BookingService } from './services/booking.service';
import { BookingFormComponent } from "./components/booking-form/booking-form.component";
import { GetPendingBookingsComponent } from './services/get-pending-bookings/get-pending-bookings.component'

@Component({
  selector: 'app-root',
  imports: [
    // RouterOutlet, 
    GetBookingsComponent,
    GetConfirmedBookingsComponent,
    CalendarComponent,
    BookingFormComponent,
    GetPendingBookingsComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';
  bookings: any[] = [];
  pendingBookings: any[] = [];

  constructor( private bookingService: BookingService ) {}

  handleBookingsList(bookings: any[]) {
    this.bookings = bookings;
  }

  handleNewBooking(booking: any) {
    console.log("Bokning skickad:", booking);
  }

  handlePendingBookings(pendingBookings: any) {
    this.pendingBookings = pendingBookings;
    console.log("handlePendingBookings:", this.pendingBookings);
  }

  handlePendingBookingsTest() {
    console.log(this.handlePendingBookingsTest);
    return this.bookings.filter(booking => booking.status === 'pending');
  }

  ngOnInit(): void {
    // this.getAllBookings();
  }
}
