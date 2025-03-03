import { Component, Inject, Input, OnInit, PLATFORM_ID, ViewEncapsulation, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { isPlatformBrowser } from '@angular/common';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {
  @Input() bookings: any[] = [];
  pendingBookings: any[] = [];
  calendarOptions!: CalendarOptions;

  constructor(@Inject(PLATFORM_ID) private platformID: Object, private bookingService: BookingService) {}

  ngOnInit(): void {
    console.log("Alla bokningar: ", this.bookings);

    // Filtrera ut alla bokningar med statusen 'pending'
    this.pendingBookings = this.bookings.filter(booking => booking.status === 'pending');
    console.log("Pending bokningar: ", this.pendingBookings); // Loggar de som har status pending
  
  

    // Konfigurera kalendern
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth',
      },
      editable: true,
      droppable: true, // Möjliggör drag-and-drop
      events: this.bookings.map(booking => ({
        title: booking.name,
        start: booking.date,
        extendedProps: {
          email: booking.email,
          phone: booking.phone
        }
      })),
      eventReceive: (eventInfo: any) => {
        console.log(`Bokning lagd i kalendern:`, eventInfo.event);
        alert(`Bokningen "${eventInfo.event.title}" har lagts till i kalendern!`);

        // Uppdatera bokningens status i Firestore
        // this.updateBookingStatus(eventInfo.event.title, "confirmed", eventInfo.event.start);
      }
    };

    // Aktivera draggable om i browser
    if (isPlatformBrowser(this.platformID)) {
      this.enableDraggable();
    }
  }

  enableDraggable() {
    let draggableEl = document.getElementById('external-events');

    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: '.draggable-booking',
        eventData: (eventEl: any) => ({
          title: eventEl.getAttribute("data-title"),
          start: new Date().toISOString().split('T')[0] // Default startdatum
        })
      });
    }
  }

  // updateBookingStatus(bookingName: string, newStatus: string, newDate: string) {
  //   this.bookingService.updateBookingStatus(bookingName, newStatus, newDate).subscribe(
  //     () => console.log(`Bokning ${bookingName} uppdaterad till ${newStatus} med datum ${newDate}`),
  //     error => console.error("Fel vid uppdatering av bokning:", error)
  //   );
  // }

  handleEventClick(info: any) {
    alert(`Bokning: ${info.event.title} \nEmail: ${info.event.extendedProps.email}`);
  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes['bookings'] && this.bookings.length > 0){
      this.pendingBookings = this.bookings.filter(booking => 
        booking.status === 'pending');
        console.log("Pending bookings in calendar: ", this.pendingBookings);
    }
  }
}
