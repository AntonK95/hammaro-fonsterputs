import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GetBookingsComponent } from "./components/get-bookings/get-bookings.component";
import { GetConfirmedBookingsComponent } from "./components/get-confirmed-bookings/get-confirmed-bookings.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    GetBookingsComponent, 
    GetConfirmedBookingsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
