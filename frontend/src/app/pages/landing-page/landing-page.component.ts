import { Component } from '@angular/core';
import { Booking } from '../../models/booking.model';
import { BookingFormComponent } from "../../components/booking-form/booking-form.component";
import { FbComponent } from '../../components/fb/fb.component';

@Component({
  selector: 'app-landing-page',
  imports: [BookingFormComponent, FbComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  bookings: Booking[] = [];
  pendingBookings: Booking[] = [];
  confirmedBookings: Booking[] = [];

  // filterBookings() {
  //   this.confirmedBookings = this.bookings.filter(booking => booking.status === 'confirmed');
  //   this.pendingBookings = this.bookings.filter(booking => booking.status === 'pending');
  //   console.log("Bekräftade bokningar: ", this.confirmedBookings);
  //   console.log("Pending bokningar: ", this.pendingBookings);
  // }

  handleNewBooking(booking: Booking) {
    console.log("Ny bokning mottagen: ", booking);
    this.bookings.push(booking);
    // this.filterBookings(); // Filtrera om efter att en ny bokning lagts till
  }
}
