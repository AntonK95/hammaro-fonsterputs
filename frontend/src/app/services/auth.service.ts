import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  
  private apiUrl = 'http://localhost:3000/auth';
  private regUserApiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        console.log("Login response: ", response);
        localStorage.setItem('idToken', response.idToken);
        localStorage.setItem("user", JSON.stringify(response.user));
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.regUserApiUrl}/users/register`, userData).pipe(
      tap(response => {
        console.log("Registreringssvar: ", response);
        // localStorage.setItem('idToken', response.idToken);
        // localStorage.setItem("user", JSON.stringify(response.user));
      })
    );
  }

  getUser(): any {
    if( typeof localStorage === 'undefined') {
      return false;
    }
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('idToken');
  }

  logout(): void {
    localStorage.removeItem('idToken');
    localStorage.removeItem('user');
  }
}
