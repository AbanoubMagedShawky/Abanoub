import { CommonModule } from '@angular/common';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface LoginResponse {
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
    department: string;
    status: string;
    permissions: string[];
    createdAt: string;
    lastLogin: string;
  };
  token: string;
}

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string | undefined = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Check if user is already logged in
    if (localStorage.getItem('token')) {
      this.router.navigate(['/navBar']);
    }
  }

  navigateToSign() {
    this.router.navigate(['/sign']);
  }

  async onLogin(): Promise<void> {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    try {
      this.isLoading = true;
      this.errorMessage = '';

      const response = await this.authService.login(this.email, this.password).toPromise();
      const loginResponse = response as LoginResponse;

      // Store the token and user info
      localStorage.setItem('token', loginResponse.token);
      localStorage.setItem('user', JSON.stringify(loginResponse.user));
      localStorage.setItem('userId', loginResponse.user._id);
      localStorage.setItem('userRole', loginResponse.user.role);
      localStorage.setItem('userStatus', loginResponse.user.status);
      localStorage.setItem('userDepartment', loginResponse.user.department);

      // Navigate to dashboard
      this.router.navigate(['/navBar'], { replaceUrl: true });
    } catch (error: any) {
      this.errorMessage = error.error?.message || 'Login failed. Please check your credentials and try again.';
      console.error('Login error:', error);
    } finally {
      this.isLoading = false;
    }
  }
}