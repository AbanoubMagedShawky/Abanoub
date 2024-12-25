import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  imports : [FormsModule , CommonModule]
})
export class UserManagementComponent implements OnInit {
  showAddUserForm = false;
  newUser = { name: '', email: '', role: 'user' };
  users = [
    { name: 'John Doe', email: 'john.doe@example.com', role: 'admin' },
    { name: 'Jane Smith', email: 'jane.smith@example.com', role: 'user' },
    { name: 'Mark Taylor', email: 'mark.taylor@example.com', role: 'user' }
  ];

  constructor() {}

  ngOnInit(): void {}

  // Add User
  onAddUser() {
    if (this.newUser.name && this.newUser.email && this.newUser.role) {
      this.users.push({ ...this.newUser });
      this.newUser = { name: '', email: '', role: 'user' }; // Clear the form
      this.showAddUserForm = false;
    }
  }

  // Edit User
  onEditUser(user: any) {
    // Implement edit functionality (optional)
    alert(`Edit user: ${user.name}`);
  }

  // Delete User
  onDeleteUser(user: any) {
    const index = this.users.indexOf(user);
    if (index > -1) {
      this.users.splice(index, 1);
    }
  }
}
