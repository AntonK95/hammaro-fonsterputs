import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-get-pending-bookings',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './get-pending-bookings.component.html',
  styleUrl: './get-pending-bookings.component.css'
})
export class GetPendingBookingsComponent {
  @Input() pendingBookings: Booking[] = [];

  
  ngOnInit() {
    // console.log("GetPendingBookingsComponent: ", this.pendingBookings);
  }
}
