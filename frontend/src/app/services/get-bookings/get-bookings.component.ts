import { Component, OnInit, Output } from '@angular/core';
import { BookingService } from '../booking.service';
import { CommonModule } from '@angular/common';
// import { EventEmitter } from 'stream';
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-get-bookings',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './get-bookings.component.html',
  styleUrl: './get-bookings.component.css'
})

export class GetBookingsComponent implements OnInit {
  bookings: any[] = [];
  @Output() bookingsList = new EventEmitter<any[]>(); // Skickar bokningarna till AppComponent

  constructor( private bookingService: BookingService ) {}
  
  
  ngOnInit(): void {
    this.bookingService.getAllBookings().subscribe( bookings => 
      this.bookingsList.emit(bookings) // Skickar bokningar uppåt
    )
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
