import { Component, Inject, Input, OnInit, PLATFORM_ID, ViewEncapsulation, OnChanges, SimpleChange, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { isPlatformBrowser } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { GetPendingBookingsComponent } from '../../services/get-pending-bookings/get-pending-bookings.component';
import { info } from 'console';
import { Booking } from '../../models/booking.model';
import { start } from 'repl';

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
  @Output() dateSelected = new EventEmitter<any>(); // emittar datum
  @Output() bookingPlaced = new EventEmitter<string>()
  // pendingBookings: any[] = [];
  calendarOptions!: CalendarOptions;

  constructor(@Inject(PLATFORM_ID) private platformID: Object, private bookingService: BookingService) {}

  ngOnInit(): void {
    console.log("Alla bokningar: ", this.bookings);
    console.log("pendingBookings till calendern: ", this.pendingBookings)

    // Filtrera ut alla bokningar med statusen 'pending'
    // this.pendingBookings = this.bookings.filter(booking => booking.status === 'pending');
    // console.log("Pending bokningar: ", this.pendingBookings); // Loggar de som har status pending
    const filteredEvents = this.getFilteredEvents();
    console.log("Filtrerade bokningar för kalendern: ", filteredEvents);
  

    // Konfigurera kalendern
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
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
      // this.bookings.map(booking => ({
      //   title: booking.address,
      //   start: booking.requestedDate,
      //   extendedProps: {
      //     email: booking.email,
      //     phone: booking.phone
      //   }
      // })),
      eventReceive: (eventInfo: any) => {
        console.log(`Bokning lagd i kalendern:`, eventInfo.event);
        console.log("eventInfo", eventInfo);

        // Hämta bokningens ID från extendedProps
        const bookingId = eventInfo.event.extendedProps.id;
        console.log("Letar efter bokning med id: ", bookingId);
      
        // Logga nuvarande pendingBookings
        console.log("Nuvarande pendingBookings:", this.pendingBookings);
      
        // Hitta bokningen i pendingBookings
        const booking = this.pendingBookings.find(booking => booking.id === bookingId);
        if (booking) {
          // Logga bokningen som ska uppdateras
          console.log("Bokning som hittades:", booking);
      
          // Ändra status på bokningen
          booking.status = 'confirmed'; // eller vad du vill kalla statusen
          
          // Logga den nya statusen för bokningen
          console.log("Bokningens nya status:", booking);
      
          // Om du vill skapa en ny array för att trigga Angulars change detection
          this.pendingBookings = [...this.pendingBookings];
      
          // Emitterar bokningens ID (om det behövs)
          this.bookingPlaced.emit(bookingId);
          
          // Logga den uppdaterade listan över pendingBookings
          console.log("Uppdaterade pendingBookings efter placering:", this.pendingBookings);
        } else {
          console.log("Bokning kunde inte hittas i pendingBookings");
        }
        // Uppdatera bokningens status i Firestore
        // this.updateBookingStatus(eventInfo.event.title, "confirmed", eventInfo.event.start);
      },
      dateClick: (info) => this.handleDateClick(info),
      
    };

    // Aktivera draggable om i browser
    if (isPlatformBrowser(this.platformID)) {
      this.enableDraggable();
    }
  }

  getFilteredEvents() {
    const events = this.bookings.map(booking => ({
      title: booking.address,
      start: booking.requestedDate,
      extendedProps: {
        email: booking.email,
        phone: booking.phone,
        id: booking.id
      }
    }));
    console.log("Skapade kalenderhändelser: ", events);
    return events;
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
  //   if(changes['bookings'] && this.bookings.length > 0){
  //     this.pendingBookings = this.bookings.filter(booking => 
  //       booking.status === 'pending');
  //       console.log("Pending bookings in calendar: ", this.pendingBookings);
  //   }
    if(changes['pendingBookings']) {
      console.log("pendingBookings uppdaterat i calendar.component:", this.pendingBookings)
    }
    if(changes['bookings']) {
      console.log("bookings uppdaterat i calendar.component:", this.bookings)
    }
  }
}
