import { Component } from '@angular/core';
import { Booking } from '../../models/booking.model';
import { BookingFormComponent } from "../../components/booking-form/booking-form.component";
import { FbComponent } from '../../components/fb/fb.component';
import { ContactFormComponent } from "../../components/contact-form/contact-form.component";

@Component({
  selector: 'app-landing-page',
  imports: [BookingFormComponent, FbComponent, ContactFormComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  bookings: Booking[] = [];
  pendingBookings: Booking[] = [];
  confirmedBookings: Booking[] = [];

  handleNewBooking(booking: Booking) {
    console.log("Ny bokning mottagen: ", booking);
    this.bookings.push(booking);
  }
}
