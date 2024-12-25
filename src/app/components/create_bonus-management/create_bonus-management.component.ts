import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-bonus-form',
  templateUrl: './create_bonus-management.component.html',
  styleUrls: ['./create_bonus-management.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('formControls', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('0.3s {{delay}}ms ease-out', 
          style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class CreateBonusManagementComponent {
  bonusForm: FormGroup;
  selectedFile: File | null = null;
  successMessage: string | null = null;
  isSubmitting: boolean = false;
  previewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.bonusForm = this.fb.group({
      title: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]],
      amount: ['', [Validators.required, Validators.min(0)]],
      userId: ['', Validators.required]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Create preview URL for supported file types
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onSubmit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);

    if (this.bonusForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('title', this.bonusForm.get('title')?.value);
      formData.append('reason', this.bonusForm.get('reason')?.value);
      formData.append('amount', this.bonusForm.get('amount')?.value);
      formData.append('userId', this.bonusForm.get('userId')?.value);
      formData.append('file', this.selectedFile);

      this.http.post('https://finance-system.koyeb.app/api/bonus', formData, { headers })
        .subscribe({
          next: (response) => {
            this.successMessage = 'Bonus created successfully!';
            this.bonusForm.reset();
            this.selectedFile = null;
            this.previewUrl = null;
            setTimeout(() => this.successMessage = null, 3000);
          },
          error: (error) => {
            console.error('Error creating bonus:', error);
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
    }
  }

  getFieldError(fieldName: string): string {
    const control = this.bonusForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${fieldName} is required`;
      if (control.errors['minlength']) return `${fieldName} is too short`;
      if (control.errors['min']) return `${fieldName} must be positive`;
    }
    return '';
  }
}