import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from "../../components/calendar/calendar.component";
// import { GetConfirmedBookingsComponent } from "../../services/get-confirmed-bookings/get-confirmed-bookings.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-staff-page',
  imports: [CommonModule, CalendarComponent, FormsModule],
  templateUrl: './staff-page.component.html',
  standalone: true,
  styleUrl: './staff-page.component.css'
})
export class StaffPageComponent implements OnInit {
  bookings: Booking[] = [];
  pendingBookings: Booking[] = [];
  confirmedBookings: Booking[] = [];
  expandedId: string | null = null;
  editingId: string | null = null;
  editableBooking: Booking | null = null;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  toggleBooking(bookingId: string) {
    this.expandedId = this.expandedId === bookingId ? null : bookingId;
  }

  startEditing(booking: Booking) {
    this.editingId = booking.id ?? null;
    this.editableBooking = { ...booking }; // Skapa en kopia av bokningen
  }

  saveChanges() {
    if (this.editableBooking) {
      console.log("Uppdaterad bokning:", this.editableBooking);
      this.bookings = this.bookings.map(booking =>
        booking.id === this.editableBooking!.id ? { ...this.editableBooking! } : booking
      );
    }
    this.cancelEditing();
  }

  cancelEditing() {
    this.editingId = null;
    this.editableBooking = null;
  }

  loadBookings(): void {
    this.bookingService.getAllBookings().subscribe(bookings => {
      this.bookings = bookings;
      this.filterBookings();
      console.log("Hämtade boknignar i staffpage: ", this.bookings);
    });
  }

  filterBookings(): void {
    this.confirmedBookings = this.bookings.filter(booking => booking.status === 'confirmed');
    this.pendingBookings = this.bookings.filter(booking => booking.status === 'pending');
    console.log('Bekräftade bokningar: ', this.confirmedBookings);
    console.log('Pending bokningar: ', this.pendingBookings);
  }

  onDateSelected(dateSelected: Date) {
    console.log('Valt datum från kalender: ', dateSelected);
  }

  onBookingPlaced(bookingId: string) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'placed';
      this.filterBookings(); // Filtrera om bokningarna
      console.log('Bokning placerad i kalendern: ', booking);
    } else {
      console.log('Bokning med id ' + bookingId + ' hittades inte i pendingBookings');
    }
  }

  confirmBookings(): void {
    const placedBookings = this.bookings.filter(booking => booking.status === 'placed');
  
    placedBookings.forEach(booking => {
      const updatedData: Partial<Booking> = {
        status: 'confirmed',
        confirmedDate: booking.placedDate,
      };

      if(!booking.id) {
        console.error("Bokningen saknar id: ", booking);
        return;
      }
  
      this.bookingService.updateBooking(booking.id, updatedData)
        .subscribe(
          (updatedBooking) => {
            console.log(`Bokning ${updatedBooking.id} bekräftad i databasen`);
            booking.status = 'confirmed';
            booking.confirmedDate = updatedBooking.confirmedDate;
          },
          (error) => {
            console.error(`Fel vid uppdatering av bokning ${booking.id}:`, error);
          }
        );
    });
  
    this.filterBookings();
  }
  
}
