// booking-calendar.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'
import { Booking } from '../../models/booking.model';
import { CommonModule } from '@angular/common';
import { GetConfirmedBookingsComponent } from '../../services/get-confirmed-bookings/get-confirmed-bookings.component';

@Component({
  selector: 'app-booking-calendar',
  imports: [FullCalendarModule, CommonModule, GetConfirmedBookingsComponent],
  templateUrl: './booking-calendar.component.html',
  styleUrls: ['./booking-calendar.component.css'],
})
export class BookingCalendarComponent implements OnInit {
  @Input() bookings: Booking[] = [];
  @Input() confirmedBookings: any[] = [];

  @Output() dateSelected = new EventEmitter<string>();

  selectedDate: any | null = null;
  calendarOptions!: CalendarOptions;

  ngOnInit(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      firstDay: 1,
      selectable: true,
      selectMirror: true,
      events: this.getFilteredEvents(),
      dateClick: (info) => this.handleDateClick(info),
      selectAllow: (selectInfo) => {
        const day = new Date(selectInfo.start).getDay(); // 0 = Söndag, 6 = Lördag
        return day !== 0 && day !== 6; // Tillåter endast vardagar
      },
      businessHours: [
        {
          daysOfWeek: [1, 2, 3, 4, 5], // Måndag–Fredag
          startTime: '00:00', // Starttid (behövs för att markera dagarna)
          endTime: '17:00',   // Sluttid
        }
      ],
      validRange: {
        start: new Date().toISOString().split('T')[0], // Förhindrar val av tidigare datum
      },
    };
  }

  getFilteredEvents() {
    return this.confirmedBookings.map(booking => ({
      title: booking.duration,
      start: booking.confirmedDate,
    }))
  }

  handleDateClick(info: any) {
    console.log("Full date info: ", info);
    this.dateSelected.emit(info.date);
    const day = new Date(info.date).getDay();
    if (day === 0 || day === 6) {
      alert('Du kan inte boka på helger!');
      return;
    }
    this.selectedDate = info.dateStr;
    this.dateSelected.emit(this.selectedDate!);
  }
}
