import { Component } from '@angular/core';
import { PaymentService } from '../services/payment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  constructor(private paymentService: PaymentService) {}

  goToPaypal() {
    // يمكنك تحديث هذا الرابط حسب الحاجة
    window.location.href = 'https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-74H15686766497628';
  }
}