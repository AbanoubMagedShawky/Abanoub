import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { trigger, transition, style, animate, state } from '@angular/animations';

interface BonusRequest {
  _id: string;
  title: string;
  reason: string;
  amount: number;
  status: string;
  submissionDate: string;
  processedDate?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CurrencyPipe, CommonModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('cardHover', [
      state('normal', style({
        transform: 'scale(1)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      })),
      state('hovered', style({
        transform: 'scale(1.02)',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
      })),
      transition('normal <=> hovered', animate('200ms ease-in-out'))
    ]),
    trigger('tableRow', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  bonusRequests: BonusRequest[] = [];
  totalBonuses: number = 0;
  cardState: string = 'normal';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    const url = 'https://finance-system.koyeb.app/api/bonus/monthly?month=12&year=2024';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    
    this.http.get<BonusRequest[]>(url, { headers }).subscribe({
      next: (data) => {
        this.bonusRequests = data.filter(request => request.status !== 'pending');
        this.totalBonuses = this.bonusRequests
          .filter(request => request.status === 'approved')
          .reduce((sum, request) => sum + request.amount, 0);
      },
      error: (error) => console.error('Error:', error)
    });
  }

  initiatePayment(bonusId: string) {
    const url = 'https://finance-system.koyeb.app/api/payment/payment';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    const body = { bonusRequestId: bonusId };

    this.http.post<{ redirectUrl: string }>(url, body, { headers }).subscribe({
      next: (response) => {
        window.open(response.redirectUrl, '_blank');
      },
      error: (error) => console.error('Payment error:', error)
    });
  }

  getStatusClass(status: string): string {
    return {
      approved: 'badge badge-success',
      rejected: 'badge badge-danger'
    }[status.toLowerCase()] || 'badge badge-secondary';
  }

  onCardMouseEnter() {
    this.cardState = 'hovered';
  }

  onCardMouseLeave() {
    this.cardState = 'normal';
  }
}