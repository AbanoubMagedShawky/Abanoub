// reports.component.ts
import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from './../../filter.pipe';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

interface ReportData {
  _id: string;
  totalAmount: number;
  count: number;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  imports: [CurrencyPipe, CommonModule, FormsModule, FilterPipe],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('50ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('searchAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class ReportsComponent implements OnInit {
  searchTerm: string = '';
  reports: ReportData[] = [];
  loading: boolean = false;
  error: string = '';
  currentMonth: string;
  currentYear: number;

  constructor(private http: HttpClient) {
    const date = new Date();
    this.currentMonth = date.toLocaleString('default', { month: 'long' });
    this.currentYear = date.getFullYear();
  }

  ngOnInit(): void {
    this.getReports();
  }

  getReports() {
    this.loading = true;
    this.error = '';
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<ReportData[]>('https://finance-system.koyeb.app/api/bonus/report/monthly?month=12&year=2024', { headers })
      .subscribe({
        next: (data) => {
          this.reports = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load report data. Please try again later.';
          this.loading = false;
          console.error('Error:', err);
        }
      });
  }

  getTotalBonus(): number {
    return this.reports.reduce((sum, report) => sum + report.totalAmount, 0);
  }

  getTotalCount(): number {
    return this.reports.reduce((sum, report) => sum + report.count, 0);
  }

  retryLoad(): void {
    this.getReports();
  }
}