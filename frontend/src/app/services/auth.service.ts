import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  
  private apiUrl = 'http://localhost:3000/auth';
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable(); // Detta får jag kolla om det behövs..

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.userSubject.next(response.user);
        localStorage.setItem('idToken', response.idToken);
      })
    );
  }

  getUser(): Observable<any> {
    return this.user$;
  }

  getToken(): string | null {
    return localStorage.getItem('idToken');
  }

  logout(): void {
    localStorage.removeItem('idToken');
    this.userSubject.next(null);
  }
}
