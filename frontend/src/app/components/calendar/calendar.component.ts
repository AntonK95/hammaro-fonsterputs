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
import { MatDialog } from '@angular/material/dialog';
import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component';

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
  @Output() blockedDates = new EventEmitter<string[]>();

  calendarOptions!: CalendarOptions;
  placedBookings: Booking[] = [];
  unBookableDates: string[] = [];
  blockedDatesArray: string[] = [];
  isBlockingDates: boolean = false;
  isUnblockingDates: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformID: Object,
    private bookingService: BookingService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {

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
      select: (info) => this.blockedDatesRange(info),
      selectAllow: (selectInfo) => {
        const day = new Date(selectInfo.start).getDay(); 
        const dateString = selectInfo.start.toISOString().split('T')[0];
        return day !== 0 && day !== 6 && !this.blockedDatesArray.includes(dateString); // 0 = Söndag, 6 = Lördag
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
      eventSources: [
        {
          events: this.getFilteredEvents(),
        },
        {
          events: this.blockedDatesArray.map(date => ({
            title: 'Ej bokningsbar',
            start: date,
            color: 'grey',
            textColor: 'white',
            display: 'background'
          }))
        },
      ],
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
        }
      },
      // När en bokning FLYTTAS i kalendern
      eventDrop: (eventInfo: any) => {
        const bookingId = eventInfo.event.extendedProps.id;
        const booking = this.placedBookings.find(booking => booking.id === bookingId);
        
        if (booking) {
          booking.placedDate = eventInfo.event.start.toISOString().split('T')[0];
          
          // Uppdatera kalendern med det nya datumet
          this.calendarOptions.events = this.getFilteredEvents();
        } else {
          console.log("Bokning kunde inte hittas i pendingBookings");
        }
      },
      eventContent: (arg: any) => {
        const bookingId = arg.event.extendedProps.id;
        const title = arg.event.title;
    
        const cancelButton = document.createElement('button');
        cancelButton.className = 'del-spec-btn'
        cancelButton.textContent = 'X';
        cancelButton.onclick = () => this.cancelSpecificBooking(bookingId);
    
        const container = document.createElement('div');
        container.textContent = title;
        container.appendChild(cancelButton);
    
        return { domNodes: [container] };
      },
      dateClick: (info) => this.handleDateClick(info),
      eventClick: (info) => this.handleEventClick(info),
      
    };

    // Aktivera draggable
    if (isPlatformBrowser(this.platformID)) {
      this.enableDraggable();
    }
  }
  ngAfterViewInit() {
    this.enableDraggable();
  }

  getFilteredEvents() {
    const events = this.bookings
      .filter(booking => booking.confirmedDate)
      .map(booking => ({
        title: booking.address.street || 'Titel saknas',
        start: booking.confirmedDate || booking.placedDate || '',
        extendedProps: {
          ...booking
        }
    }));
    const placedEvents = this.placedBookings.map(booking => ({
      title: booking.address.street || 'Titel saknas',
      start: booking.placedDate || '',
      color: "orange",
      extendedProps: {
        ...booking
      }
    }));
    // console.log("Skapade kalenderhändelser: ", events, [...events, ...placedEvents]);
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

  cancelSpecificBooking(bookingId: string): void {
    const bookingIndex = this.placedBookings.findIndex(booking => booking.id === bookingId);
  
    if (bookingIndex !== -1) {
      const booking = this.placedBookings[bookingIndex];
      booking.status = 'pending';
  
      this.placedBookings.splice(bookingIndex, 1);
      this.pendingBookings.push(booking);
  
      this.updateCalendar();
    } else {
      console.error(`Bokning med ID ${bookingId} kunde inte hittas i placedBookings.`);
    }
  }


  // Detta fungerar inte men ligger kvar då det är en del av konfigurationen för kalendern.
  blockedDatesRange(info: any) {
    const startDate = new Date(info.start);
    const endDate = new Date(info.end);
    const datesBlocked = [];

    while (startDate <= endDate) {
      const dateString = startDate.toISOString().split('T')[0];
      datesBlocked.push(dateString);
      startDate.setDate(startDate.getDate() + 1);
    }
    this.blockedDatesArray = [...this.blockedDatesArray, ...datesBlocked];
    // this.blockedDates.emit(this.blockedDatesArray);
    console.log("Datum att blockera: ", this.blockedDatesArray);
    // this.blockedDates.emit(this.unBookableDates);
    // this.updateCalendar();

  }
  // Uppdatera kalendern så att blockerade datum visas
  // Detta fungerar ju inte
  updateCalendar() {
    this.calendarOptions.eventSources = [
      {
        events: this.getFilteredEvents(),
      },
      {
        events: this.blockedDatesArray.map(date => ({
          title: 'Ej bokningsbar',
          start: date,
          color: 'grey',
          textColor: 'white',
          display: 'background' 
        }))
      }
    ];
  }

  // Det som är utkommenterat nedan är för att kunna välja och blockera datum
  // så att man inte skall kunna boka dem i bokningsformuläret.
  // Det fungerar inte i nuläget så jag kommeterar ut det för att förhindra förvirring.

  // handleDateSelect(info: any) {
  //   const dateString = info.startStr;
  //   if (this.isBlockingDates) {
  //     if (!this.blockedDatesArray.includes(dateString)) {
  //       this.blockedDatesArray.push(dateString);
  //       console.log("Datum tillagt för blockering: ", dateString);
  //     }
  //   } else if (this.isUnblockingDates) {
  //     if (this.blockedDatesArray.includes(dateString)) {
  //       this.unblockDate(dateString);
  //     }
  //   }
  //   this.updateCalendar();
  // }

  // confirmBlockedDates() {
  //   this.updateCalendar();
  //   console.log("Blockerade datum: ", this.blockedDatesArray);
  //   this.isBlockingDates = false;
  // }

  // cancelBlockedDates() {
  //   this.blockedDatesArray = [];
  //   console.log("Blockering av datum avbruten", this.blockedDatesArray);
  //   this.isBlockingDates = false;
  // }

  // toggleBlockDates() {
  //   this.isBlockingDates = !this.isBlockingDates;
  //   this.isUnblockingDates = false;
  //   if (!this.isBlockingDates) {
  //     this.cancelBlockedDates();
  //   }
  // }


  // // Nedan är för att avblockera blockerade datum.
  // // Det fungerar inta just nu...
  // unblockDate(date: string) {
  //   this.blockedDatesArray = this.blockedDatesArray.filter(d => d !== date);
  //   this.updateCalendar();
  //   console.log("Datum avblockerat: ", date);
  // }

  // unblockDates(dates: string[]) {
  //   this.blockedDatesArray = this.blockedDatesArray.filter(d => !dates.includes(d));
  //   this.updateCalendar();
  //   console.log("Datum avblockerade: ", dates);
  // }

  // toggleUnblockDates() {
  //   this.isUnblockingDates = !this.isUnblockingDates;
  //   this.isBlockingDates = false; // Se till att blockering är avaktiverad
  //   console.log("isUnblockingDates: ", this.isUnblockingDates);
  //   console.log("blockedDatesArray: ", this.blockedDatesArray);
  // }

  enableDraggable() {
    let draggableEl = document.getElementById('external-events');

    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: '.draggable-booking',
        eventData: (eventEl: any) => {
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
    console.log("Klickar på bokning: ", { title: info.event.title, id: info.event.extendedProps.id});
    this.dialog.open(BookingDialogComponent, {
      data: info.event.extendedProps,
    });
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['pendingBookings']) {
      console.log("pendingBookings uppdaterat i calendar.component:", this.pendingBookings);
    }
    if (changes['bookings']) {
      console.log("bookings uppdaterat i calendar.component:", this.bookings)
      this.calendarOptions.events = this.getFilteredEvents();
    }
  }
}
