import { Component, Inject, Input, OnInit, PLATFORM_ID, ViewEncapsulation, OnChanges, SimpleChange, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { isPlatformBrowser } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {
  @Input() bookings: Booking[] = [];
  @Input() pendingBookings: Booking[] = [];
  @Output() dateSelected = new EventEmitter<any>();
  @Output() bookingPlaced = new EventEmitter<string>();
  // pendingBookings: any[] = [];
  calendarOptions!: CalendarOptions;
  placedBookings: Booking[] = [];

  constructor(@Inject(PLATFORM_ID) private platformID: Object, private bookingService: BookingService) {}

  ngOnInit(): void {
    // console.log("Alla bokningar: ", this.bookings);
    // console.log("pendingBookings till calendern: ", this.pendingBookings)
    // const filteredEvents = this.getFilteredEvents();
    // console.log("Filtrerade bokningar för kalendern: ", filteredEvents);
  

    // Konfigurera kalendern
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      timeZone: 'Europe/Stockholm',
      firstDay: 1,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth',
      },
      editable: true,
      droppable: true, // Möjliggör drag-and-drop
      selectable: true, 
      selectMirror: true,
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
      events: this.getFilteredEvents(),
      // När en bokning placeras i kalendern för första gången
      eventReceive: (eventInfo: any) => {
        const bookingId = eventInfo.event.extendedProps.id;
        const booking = this.pendingBookings.find(booking => booking.id === bookingId);
        if (booking) {
          booking.status = 'placed';
          booking.placedDate = eventInfo.event.start.toISOString().split('T')[0]; 
          this.placedBookings.push(booking);
          this.pendingBookings = this.pendingBookings.filter(b => b.id !== bookingId);
          this.bookingPlaced.emit(bookingId);
          this.calendarOptions.events = this.getFilteredEvents();
          console.log("placedBookings efter placering: ", this.placedBookings);
        }
      },
      // När en bokning FLYTTAS i kalendern
      eventDrop: (eventInfo: any) => {
        console.log("Bokning flyttad:", eventInfo.event);
        
        const bookingId = eventInfo.event.extendedProps.id;
        const booking = this.placedBookings.find(booking => booking.id === bookingId);
    
        if (booking) {
          booking.placedDate = eventInfo.event.start.toISOString().split('T')[0]; 
    
          // Uppdatera kalendern med det nya datumet
          this.calendarOptions.events = this.getFilteredEvents();
          console.log("Uppdaterade pendingBookings efter placering:", this.pendingBookings);
        } else {
          console.log("Bokning kunde inte hittas i pendingBookings");
        }
        console.log("placedBookings efter flytt: ", this.placedBookings);
      },
      dateClick: (info) => this.handleDateClick(info),
      
    };

    // Aktivera draggable om i browser
    if (isPlatformBrowser(this.platformID)) {
      this.enableDraggable();
    }
  }
  ngAfterViewInit() {
    this.enableDraggable();
  }

  getFilteredEvents() {
    console.log("Bokningar innan filtrering: ", this.bookings);
    const events = this.bookings
    .filter(booking => booking.confirmedDate || booking.status === 'placed')
    .map(booking => ({
      title: booking.address || 'Titel saknas',
      start: booking.confirmedDate || booking.placedDate || '',
      extendedProps: {
        email: booking.email,
        phone: booking.phone,
        id: booking.id
      }
    }));
        // Mappa placerade bokningar till evenemang
        const placedEvents = this.placedBookings.map(booking => ({
          title: booking.address || 'Titel saknas',
          start: booking.placedDate || '',
          extendedProps: {
            email: booking.email,
            phone: booking.phone,
            id: booking.id
          }
        }));
    console.log("Skapade kalenderhändelser: ", events);
    return [...events, ...placedEvents];
  }

  handleDateClick(info: any) {
    this.dateSelected.emit(info.date);
    const day = new Date(info.date).getDay();
    if (day === 0 || day === 6) {
      alert('Du kan inte boka på helger!');
      return;
    }
  }

  enableDraggable() {
    let draggableEl = document.getElementById('external-events');
    console.log("enableDraggable", draggableEl);

    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: '.draggable-booking',
        eventData: (eventEl: any) => {

          console.log("Drar i bokning", { id: eventEl.getAttribute("data-id")});

          return {

            id: eventEl.getAttribute("data-id"),
            title: eventEl.getAttribute("data-title"),
            start: new Date().toISOString().split('T')[0], // Default startdatum
            extendedProps: {
              id: eventEl.getAttribute("data-id")
            }
          }
        }
      });
    }
  }

  handleEventClick(info: any) {
    alert(`Bokning: ${info.event.title} \nEmail: ${info.event.extendedProps.email}`);
  }
  ngOnChanges(changes: SimpleChanges) {

    if(changes['pendingBookings']) {
      console.log("pendingBookings uppdaterat i calendar.component:", this.pendingBookings);
    }
    if(changes['bookings']) {
      console.log("bookings uppdaterat i calendar.component:", this.bookings)
      this.calendarOptions.events = this.getFilteredEvents();
    }
  }
}
