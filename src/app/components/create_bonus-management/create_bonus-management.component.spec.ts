import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateBonusManagementComponent } from './create_bonus-management.component';

describe('CreateBonusManagementComponent', () => {
  let component: CreateBonusManagementComponent;
  let fixture: ComponentFixture<CreateBonusManagementComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateBonusManagementComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBonusManagementComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize with an invalid form', () => {
      expect(component.bonusForm.valid).toBeFalsy();
    });

    it('should initialize with empty form controls', () => {
      expect(component.bonusForm.get('title')?.value).toBe('');
      expect(component.bonusForm.get('reason')?.value).toBe('');
      expect(component.bonusForm.get('amount')?.value).toBe('');
      expect(component.bonusForm.get('userId')?.value).toBe('');
    });
  });

  describe('Form Validation', () => {
    it('should be valid when all required fields are filled correctly', () => {
      component.bonusForm.controls['title'].setValue('Test Bonus');
      component.bonusForm.controls['reason'].setValue('Test reason that is long enough');
      component.bonusForm.controls['amount'].setValue(1000);
      component.bonusForm.controls['userId'].setValue('user123');
      
      expect(component.bonusForm.valid).toBeTruthy();
    });

    it('should show error messages for invalid fields when touched', () => {
      const titleControl = component.bonusForm.controls['title'];
      titleControl.setValue('');
      titleControl.markAsTouched();
      
      expect(component.getFieldError('title')).toBe('title is required');
    });

    it('should validate reason minimum length', () => {
      const reasonControl = component.bonusForm.controls['reason'];
      reasonControl.setValue('short');
      reasonControl.markAsTouched();
      
      expect(component.getFieldError('reason')).toBe('reason is too short');
    });

    it('should validate amount is positive', () => {
      const amountControl = component.bonusForm.controls['amount'];
      amountControl.setValue(-100);
      amountControl.markAsTouched();
      
      expect(component.getFieldError('amount')).toBe('amount must be positive');
    });
  });

  describe('File Handling', () => {
    it('should handle file selection', () => {
      const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
      const event = { target: { files: [file] } };
      
      component.onFileSelected(event);
      
      expect(component.selectedFile).toBe(file);
    });

    it('should create preview URL for image files', () => {
      const imageFile = new File(['dummy image'], 'test.jpg', { type: 'image/jpeg' });
      const event = { target: { files: [imageFile] } };
      
      component.onFileSelected(event);
      
      expect(component.selectedFile).toBe(imageFile);
      // Note: actual preview URL testing would require FileReader mock
    });
  });

  describe('Form Submission', () => {
    it('should not submit if form is invalid', () => {
      component.onSubmit();
      expect(component.isSubmitting).toBeFalsy();
    });

    it('should not submit if no file is selected', () => {
      component.bonusForm.controls['title'].setValue('Test Bonus');
      component.bonusForm.controls['reason'].setValue('Test reason that is long enough');
      component.bonusForm.controls['amount'].setValue(1000);
      component.bonusForm.controls['userId'].setValue('user123');
      
      component.onSubmit();
      expect(component.isSubmitting).toBeFalsy();
    });

    it('should submit form data when valid with file', () => {
      // Set up form data
      component.bonusForm.controls['title'].setValue('Test Bonus');
      component.bonusForm.controls['reason'].setValue('Test reason that is long enough');
      component.bonusForm.controls['amount'].setValue(1000);
      component.bonusForm.controls['userId'].setValue('user123');
      
      // Mock file selection
      const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
      const event = { target: { files: [file] } };
      component.onFileSelected(event);

      // Submit form
      component.onSubmit();

      // Expect HTTP request
      const req = httpMock.expectOne('https://finance-system.koyeb.app/api/bonus');
      expect(req.request.method).toBe('POST');
      
      // Mock successful response
      req.flush({ message: 'Success' });

      // Check component state after submission
      expect(component.successMessage).toBeTruthy();
      expect(component.isSubmitting).toBeFalsy();
    });

    it('should handle submission errors', () => {
      // Set up form data
      component.bonusForm.controls['title'].setValue('Test Bonus');
      component.bonusForm.controls['reason'].setValue('Test reason that is long enough');
      component.bonusForm.controls['amount'].setValue(1000);
      component.bonusForm.controls['userId'].setValue('user123');
      
      // Mock file selection
      const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
      const event = { target: { files: [file] } };
      component.onFileSelected(event);

      // Spy on console.error
      spyOn(console, 'error');

      // Submit form
      component.onSubmit();

      // Expect HTTP request and mock error response
      const req = httpMock.expectOne('https://finance-system.koyeb.app/api/bonus');
      req.error(new ErrorEvent('Network error'));

      // Verify error handling
      expect(console.error).toHaveBeenCalled();
      expect(component.isSubmitting).toBeFalsy();
    });
  });

  describe('Component State', () => {
    it('should clear form and file data after successful submission', () => {
      // Set up and submit form
      component.bonusForm.controls['title'].setValue('Test Bonus');
      component.bonusForm.controls['reason'].setValue('Test reason that is long enough');
      component.bonusForm.controls['amount'].setValue(1000);
      component.bonusForm.controls['userId'].setValue('user123');
      
      const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
      const event = { target: { files: [file] } };
      component.onFileSelected(event);

      component.onSubmit();

      // Mock successful response
      const req = httpMock.expectOne('https://finance-system.koyeb.app/api/bonus');
      req.flush({ message: 'Success' });

      // Check reset state
      expect(component.bonusForm.pristine).toBeTruthy();
      expect(component.selectedFile).toBeNull();
      expect(component.previewUrl).toBeNull();
    });

    it('should clear success message after timeout', (done) => {
      component.successMessage = 'Success';
      
      setTimeout(() => {
        expect(component.successMessage).toBeNull();
        done();
      }, 3100);
    });
  });
});