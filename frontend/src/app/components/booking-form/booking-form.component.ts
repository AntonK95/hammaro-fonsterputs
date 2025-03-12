import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Booking } from '../../models/booking.model';
import { BookingCalendarComponent } from "../booking-calendar/booking-calendar.component";
import { GetConfirmedBookingsComponent } from "../../services/get-confirmed-bookings/get-confirmed-bookings.component";
import { ProductListComponent } from "../../services/product-list/product-list.component";

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, BookingCalendarComponent, GetConfirmedBookingsComponent, ProductListComponent],
})
export class BookingFormComponent implements OnInit {
  @Input() confirmedBookings: Booking[] = [];
  @Output() newBooking = new EventEmitter<Booking>(); // Skickar bokningen till föräldern

  bookingForm!: FormGroup;
  isExpanded = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      date: ['', Validators.required], // Datum väljs manuellt
      products: this.fb.array([], Validators.required), // Produktval
    });
    console.log("Confirmed bookings: ", this.confirmedBookings);
  }

  toggleForm() {
    this.isExpanded = !this.isExpanded;
    console.log(this.isExpanded);
  }

  get products(): FormArray {
    return this.bookingForm.get('products') as FormArray;
  }
  
  onProductSelected(product: any): void {
    this.products.push(this.fb.group({
      serviceName: [product.serviceName],
      // price: [product.price],
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
      this.newBooking.emit(this.bookingForm.value); // Skicka bokningen vidare
      console.log('Skickad bokning:', this.bookingForm.value);
      this.bookingForm.reset(); // Nollställ formuläret
    } else {
      alert('Denna bokning väntas ta längre tid än vad som finns tilljängligt denna dag. Vänligen välj en annan dag.');
    }
  }
}
