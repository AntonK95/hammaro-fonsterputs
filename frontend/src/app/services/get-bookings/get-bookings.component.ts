import { Component, OnInit, Output } from '@angular/core';
import { BookingService } from '../booking.service';
import { CommonModule } from '@angular/common';
// import { EventEmitter } from 'stream';
import { EventEmitter } from '@angular/core';
import { Booking } from '../../models/booking.model';


@Component({
  selector: 'app-get-bookings',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './get-bookings.component.html',
  styleUrl: './get-bookings.component.css'
})

export class GetBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  pendingBookings: Booking[] = [];
  @Output() bookingsList = new EventEmitter<Booking[]>(); // Skickar bokningarna till AppComponent
  @Output() pendingBookingsList = new EventEmitter<any[]>();

  constructor( private bookingService: BookingService ) {}
  
  
  ngOnInit(): void {
    this.bookingService.getAllBookings().subscribe( bookings => {
     this.bookings = bookings; // Lagra alla bokningar 
      this.bookingsList.emit(bookings) // Skickar bokningar uppåt

      // Filtrera ut bokningar med status 'pending'
      this.pendingBookings = bookings.filter((booking: { status: string; }) => booking.status === 'pending');
      this.pendingBookingsList.emit(this.pendingBookings);
      console.log("pendingBookings from get-bookings.component:", this.pendingBookings)
    })
    // this.getAllBookings();
  }

  // getAllBookings(): void {

  //   try {
  //     this.bookingService.getAllBookings().subscribe( data => {
  //       this.bookings = data;
  //       console.log("Hämtade bokningar: ", this.bookings);
  //     });
  //   } catch (error) {
  //     console.error("Fel vid hämtning av bokningar: ", error);
  //   }
  // }
}
