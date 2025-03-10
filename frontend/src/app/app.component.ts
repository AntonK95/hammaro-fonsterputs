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
  confirmedBookings: Booking[] = [];

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

  onDateSelected(dateSelected: Date) {
    console.log("Valt datum från kalender: ", dateSelected);
    
  }

  // handlePendingBookingsFilter() {
  //   console.log(this.handlePendingBookingsFilter);
  //   console.log("handlePendingBookingsFilter anropad!")
  //   console.log("handlePendingBookingsFilter: ", this.pendingBookings);
  //   return this.bookings.filter(booking => booking.status === 'pending');
  // }

  loadBookings(): void {
    this.bookingService.getAllBookings().subscribe(bookings => {
      this.bookings = bookings;
      this.confirmedBookings = bookings.filter((booking: Booking) => booking.status === 'confirmed');
      console.log("Confirmed bookings: ", this.confirmedBookings);
      this.pendingBookings = bookings.filter((booking: Booking) => booking.status === 'pending');
      console.log("PendingBookings: ", this.pendingBookings);
    })
  }

  handelNewBooking(booking: Booking) {
    console.log("Ny bokning mottagen: ", booking);
    this.bookings.push(booking);

    if(booking.status === 'confirmed') {
      this.confirmedBookings.push(booking);
    } else {
      this.pendingBookings.push(booking);
    }
  }

  ngOnInit(): void {
    this.loadBookings();
    // this.getAllBookings();
    // setInterval(() => {
    //   console.log("Live-status av pendingBookings: ", this.pendingBookings);
    // }, 3000);
  }
}
