import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GetBookingsComponent } from "./services/get-bookings/get-bookings.component";
import { GetConfirmedBookingsComponent } from "./services/get-confirmed-bookings/get-confirmed-bookings.component";
import { CalendarComponent } from './components/calendar/calendar.component';
import { BookingService } from './services/booking.service';
import { BookingFormComponent } from "./components/booking-form/booking-form.component";
import { Booking } from './models/booking.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    // RouterOutlet, 
    // GetBookingsComponent,
    GetConfirmedBookingsComponent,
    CalendarComponent,
    BookingFormComponent,
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


  ngOnInit(): void {
    this.loadBookings();
  }

  handleBookingsList(bookings: Booking[]) {
    this.bookings = bookings;
  }

  onDateSelected(dateSelected: Date) {
    console.log("Valt datum från kalender: ", dateSelected);
  }

  loadBookings(): void {
    this.bookingService.getAllBookings().subscribe(bookings => {
      this.bookings = bookings;
      this.filterBookings();
    });
  }

  filterBookings() {
    this.confirmedBookings = this.bookings.filter(booking => booking.status === 'confirmed');
    this.pendingBookings = this.bookings.filter(booking => booking.status === 'pending');
    console.log("Bekräftade bokningar: ", this.confirmedBookings);
    console.log("Pending bokningar: ", this.pendingBookings);
  }

  handleNewBooking(booking: Booking) {
    console.log("Ny bokning mottagen: ", booking);
    this.bookings.push(booking);
    this.filterBookings(); // Filtrera om efter att en ny bokning lagts till
  }

  // Hantera eventet när en bokning placeras i kalendern
  onBookingPlaced(bookingId: string) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'placed'; // Ändra statusen till "placed"
      this.filterBookings(); // Filtrera om bokningarna
      console.log("Boknin placerad i kalendern: ", booking);
    } else {
      console.log("Bokning med id" + bookingId + "hittades inte i pendingBookings");
    }
  } 
}
