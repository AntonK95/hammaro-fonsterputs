import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class BookingService {

  private apiUrl = 'http://localhost:3000/bookings';
  private bookingsSubject = new BehaviorSubject<any>([]); // Skapar en delad state för alla bokningar
  bookings$ = this.bookingsSubject.asObservable();  // Gör det till en observable

  constructor( private http: HttpClient ) { }

  // getAllBookings(): Observable<any> {
  //   return this.http.get<any[]>(this.apiUrl);
  // }

  getAllBookings(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(bookings => this.bookingsSubject.next(bookings)) // Uppdaterar delat state
    );
  }

  getConfirmedBookings(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/calendar`);
  }
}
