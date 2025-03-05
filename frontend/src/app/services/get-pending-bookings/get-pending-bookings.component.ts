import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-get-pending-bookings',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './get-pending-bookings.component.html',
  styleUrl: './get-pending-bookings.component.css'
})
export class GetPendingBookingsComponent {
  @Input() pendingBookings: any[] = [];

  
  ngOnInit() {
    console.log("GetPendingBookingsComponent: ", this.pendingBookings);
  }
}
