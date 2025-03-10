// booking-calendar.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Booking } from '../../models/booking.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-calendar',
  imports: [FullCalendarModule, CommonModule],
  templateUrl: './booking-calendar.component.html',
  styleUrls: ['./booking-calendar.component.css'],
})
export class BookingCalendarComponent implements OnInit {
  @Input() bookings: Booking[] = [];
  calendarOptions!: CalendarOptions;

  ngOnInit(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      events: this.getFilteredEvents(),
      // Andra konfigurationer som du vill ha
    };
  }

  getFilteredEvents() {
    return this.bookings
      .filter(booking => booking.confirmedDate) // Endast bekräftade bokningar
      .map(booking => ({
        title: booking.address, // Anta att adress är titeln
        start: booking.confirmedDate!, // Använd confirmedDate
        extendedProps: {
          email: booking.email,
          phone: booking.phone,
        },
      }));
  }
}
