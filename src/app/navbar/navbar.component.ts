import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true, // Indicates it's a standalone component
  imports: [CommonModule, RouterModule], // Import CommonModule for *ngIf and other directives
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  userRole: string | null = null;

  constructor(private router: Router) {
    // Retrieve the user role from localStorage
    this.userRole = localStorage.getItem('userRole');
  }

  logout() {
    // Clear all stored data
    localStorage.clear(); // Clears all localStorage data
    sessionStorage.clear(); // Clears all sessionStorage data

    // Redirect to the login page
    this.router.navigate(['/login']);
  }
}
