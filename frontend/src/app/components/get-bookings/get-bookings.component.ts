import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-get-bookings',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './get-bookings.component.html',
  styleUrl: './get-bookings.component.css'
})

export class GetBookingsComponent implements OnInit {
  bookings: any[] = [];

  constructor( private bookingService: BookingService ) {}
  
  
  ngOnInit(): void {
    this.getAllBookings();
  }

  getAllBookings(): void {

    try {
      this.bookingService.getAllBookings().subscribe( data => {
        this.bookings = data;
        console.log("Hämtade bokningar: ", this.bookings);
      });
    } catch (error) {
      console.error("Fel vid hämtning av bokningar: ", error);
    }
  }
}
