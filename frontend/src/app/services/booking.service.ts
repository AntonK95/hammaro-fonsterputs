import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})

export class BookingService {

  private apiUrl = 'http://localhost:3000/bookings';
  private bookingsSubject = new BehaviorSubject<any>([]); // Skapar en delad state för alla bokningar
  bookings$ = this.bookingsSubject.asObservable();  // Gör det till en observable

  constructor( private http: HttpClient ) { }

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  getAllBookings(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(bookings => this.bookingsSubject.next(bookings)) // Uppdaterar delat state
    );
  }

  getConfirmedBookingsForCalendar(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/calendar`);
  }

  updateBooking(id: string, bookingData: Partial<Booking>): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('idToken')}`  // Hämta token från localStorage
    });
  
    return this.http.put(`${this.apiUrl}/${id}`, bookingData, { headers });
  }
  
}
