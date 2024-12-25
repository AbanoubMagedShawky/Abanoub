import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'https://finance-system.koyeb.app/api/payment/payment';

  constructor(private http: HttpClient) { }

  makePayment(bonusRequestId: string): Observable<any> {
    const body = { bonusRequestId };
    return this.http.post<any>(this.apiUrl, body);
  }
}