import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';


interface BonusRequest {
  _id: string;
  title: string;
  reason: string;
  amount: number;
  status: string;
}

interface ApprovalDetails {
  status: string;
  reason: string;
}

@Component({
  selector: 'app-bonus-management',
  templateUrl: './bonus-management.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class BonusManagementComponent implements OnInit {
  bonusRequests: BonusRequest[] = [];
  approvalDetails: ApprovalDetails = {
    status: '',
    reason: ''
  };
  selectedRequest: BonusRequest | null = null;
  showDialog = false;
  
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPendingRequests();
  }

  loadPendingRequests() {
        const url = 'https://finance-system.koyeb.app/api/bonus/monthly?month=12&year=2024';
        const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    this.http.get<BonusRequest[]>(url,{headers})
      .subscribe({
        next: (data) => {
          this.bonusRequests = data.filter(request => request.status === 'pending');
        },
        error: (error) => console.error('Error:', error)
      });
  }

  openApprovalDialog(request: BonusRequest, status: 'approved' | 'rejected') {
    this.selectedRequest = request;
    this.approvalDetails.status = status;
    this.approvalDetails.reason = '';
    this.showDialog = true;
  }

  submitApproval() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);

    if (!this.selectedRequest) return;

    this.http.put(`https://finance-system.koyeb.app/api/bonus/${this.selectedRequest._id}/approve-reject`, this.approvalDetails,{headers})
      .subscribe({
        next: () => {
          this.loadPendingRequests();
          this.showDialog = false;
          this.selectedRequest = null;
        },
        error: (error) => console.error('Error:', error)
      });
  }
}