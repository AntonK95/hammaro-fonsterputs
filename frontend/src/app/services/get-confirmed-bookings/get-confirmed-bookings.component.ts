import { Component, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';
import { CommonModule } from '@angular/common';
import { Booking } from '../../models/booking.model';


@Component({
  selector: 'app-get-confirmed-bookings',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './get-confirmed-bookings.component.html',
  styleUrl: './get-confirmed-bookings.component.css'
})

export class GetConfirmedBookingsComponent implements OnInit {
  confirmedBookings: Booking[] = [];

  constructor( private bookingService: BookingService ) { }

  ngOnInit(): void {
      this.getConfirmedBookingsForCalendar();
  }

  getConfirmedBookingsForCalendar(): void {
    try {
      this.bookingService.getConfirmedBookingsForCalendar().subscribe( data => {
        this.confirmedBookings = data;
        // console.log("Hämtade bekräftade bokningar: ", this.confirmedBookings);
      });
    } catch (error) {
      console.error("Fel vid hämtning av bekräftade bokningar", error)
    }
  }
}
