import { Component, EventEmitter, OnInit, Output, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Booking } from '../../models/booking.model';
import { BookingCalendarComponent } from "../booking-calendar/booking-calendar.component";
import { GetConfirmedBookingsComponent } from "../../services/get-confirmed-bookings/get-confirmed-bookings.component";
import { ProductListComponent } from "../../services/product-list/product-list.component";
import { BookingService } from '../../services/booking.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthServiceService } from '../../services/auth.service';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, 
            CommonModule, 
            BookingCalendarComponent, 
            GetConfirmedBookingsComponent, 
            ProductListComponent,
            MatFormField,
            MatInputModule
          ],
})
export class BookingFormComponent implements OnInit {
  @Input() confirmedBookings: Booking[] = [];
  @Output() newBooking = new EventEmitter<Booking>(); // Skickar bokningen till föräldern

  // @ViewChild(GetConfirmedBookingsComponent) getConfirmedBookingsComponent!: GetConfirmedBookingsComponent;
  bookingForm!: FormGroup;
  isExpanded = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private bookingService: BookingService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        postalCode: ['', Validators.required],
        city: ['', Validators.required]
      }),
      date: ['', Validators.required], // Datum väljs manuellt
      products: this.fb.array([], Validators.required), // Produktval
      notes: [''],
    });
    console.log("Confirmed bookings: ", this.confirmedBookings);
  }

  toggleForm() {
    this.isExpanded = !this.isExpanded;
    console.log(this.isExpanded);

    if(this.isExpanded) {
      const user = this.authService.getUser();
      // console.log("User from localStorage");
      if(user) {
        this.bookingForm.patchValue({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
          address: user.address
        })
      } else {
        console.log("No user data received");
      }
      // Här vill jag hämta alla bekräftade bokningar, detta för att spara api anrop.
      // console.log("Calling getConfirmedBookingsForCalendar");
      // this.getConfirmedBookingsForCalendar();
    }
  }

  get products(): FormArray {
    return this.bookingForm.get('products') as FormArray;
  }
  
  onProductSelected(product: any): void {
    this.products.push(this.fb.group({
      serviceName: [product.serviceName],
      price: [product.priceRange.min],
      timePerUnit: [product.timePerUnit],
      description: [product.description],
      quantity: [product.quantity, Validators.required]
    }));
  }

  onDateSelected(date: string) {
    this.bookingForm.patchValue({ date: date });
    console.log("Valt datum i formuläret: ", this.bookingForm.value.date);
  }

  calculateTotalTimeOfBooking(): number {
    return this.products.controls.reduce((total, product) => {
      const timePerUnit = product.get('timePerUnit')?.value || 0;
      const quantity = product.get('quantity')?.value || 0;
      return total + (timePerUnit * quantity);
    }, 0)
  }

  // Räkna ut om det finns tillräckligt med tid kvar för vald dag
  canBookOnDate(date: string): boolean {
    const bookingsPerDay: { [key: string]: number } = {};

    this.confirmedBookings.forEach(booking => {
      const bookingDate = booking.confirmedDate; // YYYY-MM-DD
      if (!bookingDate) return;
      const hours = booking.totalDuration / 60; // Omvandla minuter till timmar
      const roundedHours = Math.ceil(hours * 4) / 4;

      if (bookingsPerDay[bookingDate]) {
        bookingsPerDay[bookingDate] += roundedHours; // Lägg till om det redan finns bokningar på denna dag
      } else {
        bookingsPerDay[bookingDate] = roundedHours; // Skapa nytt entry
      }
    });

    const bookedHours = bookingsPerDay[date] || 0;
    const newBookingHours = this.calculateTotalTimeOfBooking() / 60;

    return (bookedHours + newBookingHours) <= 8;
  }

  submitBooking() {
    const selectedDate = this.bookingForm.get('date')?.value;
    if (this.bookingForm.valid && this.canBookOnDate(selectedDate)) {
      if (this.products.length === 0) {
        this.errorMessage = 'Minst en produkt/tjänst måste väljas';
        return;
      }

      const booking: Booking = {
        ...this.bookingForm.value,
        requestedDate: this.bookingForm.value.date,
        items: this.bookingForm.value.products,
        totalDuration: this.calculateTotalTimeOfBooking(),
        totalPrice: this.products.controls.reduce((total, product) => {
          const price = product.get('price')?.value || 0;
          const quantity = product.get('quantity')?.value || 0;
          return total + (price * quantity);
        }, 0),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      console.log("Skickar bokning via form: ", booking);
      // Kommentera ut nedan för att inte skicka till databasen / för felsökning
      this.bookingService.createBooking(booking).subscribe(
        (response) => {
          this.newBooking.emit(response); // Skicka bokningen vidare
          console.log('Skickad bokning:', response);
          this.bookingForm.reset(); // Nollställ formuläret
          this.errorMessage = null; // Rensa felmeddelandet
        },
        (error: HttpErrorResponse) => {
          console.error('Error creating booking:', error);
          this.errorMessage = error.error?.error || 'Ett fel uppstod vid skapandet av bokningen. Försök igen senare.';
        }
      );
    } else {
      this.errorMessage = 'Denna bokning väntas ta längre tid än vad som finns tillgängligt denna dag. Vänligen välj en annan dag.';
    }
  }
}
