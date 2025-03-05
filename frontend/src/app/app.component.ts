import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GetBookingsComponent } from "./services/get-bookings/get-bookings.component";
import { GetConfirmedBookingsComponent } from "./services/get-confirmed-bookings/get-confirmed-bookings.component";
import { CalendarComponent } from './components/calendar/calendar.component';
import { BookingService } from './services/booking.service';
import { BookingFormComponent } from "./components/booking-form/booking-form.component";
import { GetPendingBookingsComponent } from './services/get-pending-bookings/get-pending-bookings.component'
import { Booking } from './models/booking.model';

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
  bookings: Booking[] = [];
  pendingBookings: Booking[] = [];

  constructor( private bookingService: BookingService ) {}

  handleBookingsList(bookings: Booking[]) {
    this.bookings = bookings;
  }

  handleNewBooking(booking: Booking) {
    console.log("Bokning skickad:", booking);
  }

  handlePendingBookings(pendingBookings: Booking[]) {
      console.log("handlePendingBookings", pendingBookings)
      this.pendingBookings = pendingBookings;
      console.log("handlePendingBookings this.pendingBookings:", this.pendingBookings);
  }

  // handlePendingBookingsFilter() {
  //   console.log(this.handlePendingBookingsFilter);
  //   console.log("handlePendingBookingsFilter anropad!")
  //   console.log("handlePendingBookingsFilter: ", this.pendingBookings);
  //   return this.bookings.filter(booking => booking.status === 'pending');
  // }

  ngOnInit(): void {
    // this.getAllBookings();
    // setInterval(() => {
    //   console.log("Live-status av pendingBookings: ", this.pendingBookings);
    // }, 3000);
  }
}
