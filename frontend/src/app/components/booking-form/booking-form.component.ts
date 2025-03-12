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

  submitBooking() {
    if (this.bookingForm.valid) {
      this.newBooking.emit(this.bookingForm.value); // Skicka bokningen vidare
      // alert('Bokning skickad!');
      console.log('Skickad bokning:', this.bookingForm.value);
      this.bookingForm.reset(); // Nollställ formuläret
    }
  }
}
