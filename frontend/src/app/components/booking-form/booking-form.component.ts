import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class BookingFormComponent implements OnInit {
  @Output() newBooking = new EventEmitter<any>(); // Skickar bokningen till föräldern

  bookingForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      date: ['', Validators.required], // Datum väljs manuellt
      product: ['', Validators.required], // Produktval
    });
  }

  submitBooking() {
    if (this.bookingForm.valid) {
      this.newBooking.emit(this.bookingForm.value); // Skicka bokningen vidare
      alert('Bokning skickad!');
      console.log('Skickad bokning:', this.bookingForm.value);
      this.bookingForm.reset(); // Nollställ formuläret
    }
  }
}
