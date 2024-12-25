import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://finance-system.koyeb.app/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      email,
      password
    });
  }

  // Helper method to get the stored token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Helper method to check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Logout method
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  register(email: string, password: string, username: string, department: string, role: string) {
    return this.http.post('https://finance-system.koyeb.app/api/auth/register', {
      email,
      password,
      username,
      department,
      role
    });
  }
}