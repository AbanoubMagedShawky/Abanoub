import { CommonModule } from '@angular/common';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

interface SignupResponse {
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
    department: string;
    status: string;
    permissions: string[];
    createdAt: string;
  };
  token: string;
}

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css'],
  standalone: true,
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(20px)'
      })),
      transition(':enter', [
        animate('0.6s ease-out')
      ])
    ]),
    trigger('shake', [
      state('false', style({ transform: 'translateX(0)' })),
      state('true', style({ transform: 'translateX(0)' })),
      transition('false => true', [
        animate('0.5s', style({ transform: 'translateX(-10px)' })),
        animate('0.5s', style({ transform: 'translateX(10px)' })),
        animate('0.5s', style({ transform: 'translateX(-10px)' })),
        animate('0.5s', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class SignupComponent implements OnInit {
  email: string = '';
  password: string = '';
  username: string = '';
  department: string = '';
  role: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  shakeError: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/navBar']);
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  async onSignup(): Promise<void> {
    if (!this.email || !this.password || !this.username || !this.role) {
      this.errorMessage = 'Please fill in all required fields';
      this.triggerShakeAnimation();
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      this.triggerShakeAnimation();
      return;
    }

    try {
      this.isLoading = true;
      this.errorMessage = '';

      const response = await this.authService.register(
        this.email,
        this.password,
        this.username,
        this.department,
        this.role
      ).toPromise();

      const signupResponse = response as SignupResponse;

      // Store user data
      localStorage.setItem('token', signupResponse.token);
      localStorage.setItem('user', JSON.stringify(signupResponse.user));
      localStorage.setItem('userId', signupResponse.user._id);
      localStorage.setItem('userRole', signupResponse.user.role);
      localStorage.setItem('userStatus', signupResponse.user.status);
      localStorage.setItem('userDepartment', signupResponse.user.department);

      // Navigate to dashboard
      this.router.navigate(['/navBar'], { replaceUrl: true });
    } catch (error: any) {
      this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      this.triggerShakeAnimation();
      console.error('Signup error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private triggerShakeAnimation(): void {
    this.shakeError = true;
    setTimeout(() => {
      this.shakeError = false;
    }, 500);
  }
}