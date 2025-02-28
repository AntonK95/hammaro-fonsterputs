import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-get-confirmed-bookings',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './get-confirmed-bookings.component.html',
  styleUrl: './get-confirmed-bookings.component.css'
})

export class GetConfirmedBookingsComponent implements OnInit {
  confirmedBookings: any[] = [];

  constructor( private bookingService: BookingService ) { }

  ngOnInit(): void {
      this.getConfirmedBookings();
  }

  getConfirmedBookings(): void {
    try {
      this.bookingService.getConfirmedBookings().subscribe( data => {
        this.confirmedBookings = data;
        console.log("Hämtade bekräftade bokningar: ", this.confirmedBookings);
      });
    } catch (error) {
      console.error("Fel vid hämtning av bekräftade bokningar", error)
    }
  }
}
