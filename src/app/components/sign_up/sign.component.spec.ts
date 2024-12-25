import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SignupComponent } from './sign.component';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError, Observable } from 'rxjs';

interface SignupUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  department: string;
  status: string;
  permissions: string[];
  createdAt: string;
}

interface SignupResponse {
  user: SignupUser;
  token: string;
}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockResponse: SignupResponse = {
    user: {
      _id: '123',
      username: 'testuser',
      email: 'test@example.com',
      role: 'student',
      department: 'test',
      status: 'active',
      permissions: [],
      createdAt: new Date().toISOString()
    },
    token: 'fake-token'
  };

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        SignupComponent
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form fields', () => {
    expect(component.email).toBe('');
    expect(component.password).toBe('');
    expect(component.username).toBe('');
    expect(component.role).toBe('');
    expect(component.errorMessage).toBe('');
    expect(component.isLoading).toBeFalse();
  });

  it('should check for existing token on init', () => {
    spyOn(localStorage, 'getItem').and.returnValue('fake-token');
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/navBar']);
  });

  it('should not navigate if no token exists', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    component.ngOnInit();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to login page', () => {
    component.navigateToLogin();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show error for empty fields', fakeAsync(() => {
    component.email = '';
    component.password = '';
    component.username = '';
    component.role = '';

    component.onSignup();
    tick();

    expect(component.errorMessage).toBe('Please fill in all required fields');
    expect(component.isLoading).toBeFalse();
    expect(authService.register).not.toHaveBeenCalled();
  }));

  it('should show error for invalid email', fakeAsync(() => {
    component.email = 'invalid-email';
    component.password = 'password123';
    component.username = 'testuser';
    component.role = 'student';

    component.onSignup();
    tick();

    expect(component.errorMessage).toBe('Please enter a valid email address');
    expect(component.isLoading).toBeFalse();
    expect(authService.register).not.toHaveBeenCalled();
  }));

  it('should handle successful registration', fakeAsync(() => {
    component.email = 'test@example.com';
    component.password = 'password123';
    component.username = 'testuser';
    component.role = 'student';

    authService.register.and.returnValue(of(mockResponse));

    component.onSignup();
    tick();

    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(localStorage.getItem('userRole')).toBe('student');
    expect(router.navigate).toHaveBeenCalledWith(['/navBar'], { replaceUrl: true });
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('');
  }));

  it('should handle registration error', fakeAsync(() => {
    const errorResponse = {
      error: { message: 'Registration failed' }
    };

    component.email = 'test@example.com';
    component.password = 'password123';
    component.username = 'testuser';
    component.role = 'student';

    authService.register.and.returnValue(throwError(() => errorResponse));

    component.onSignup();
    tick();

    expect(component.errorMessage).toBe('Registration failed');
    expect(component.isLoading).toBeFalse();
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('should trigger shake animation on error', fakeAsync(() => {
    component.email = '';
    component.password = '';
    component.username = '';
    component.role = '';

    component.onSignup();
    tick();

    expect(component.shakeError).toBeTrue();

    tick(500);
    expect(component.shakeError).toBeFalse();
  }));

  it('should validate email format', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.com',
      'user+label@domain.co.uk'
    ];

    const invalidEmails = [
      'invalid-email',
      'test@',
      '@domain.com',
      'test@domain',
      'test@.com'
    ];

    validEmails.forEach(email => {
      component.email = email;
      component.password = 'password123';
      component.username = 'testuser';
      component.role = 'student';
      component.onSignup();
      expect(component.errorMessage).not.toBe('Please enter a valid email address');
    });

    invalidEmails.forEach(email => {
      component.email = email;
      component.password = 'password123';
      component.username = 'testuser';
      component.role = 'student';
      component.onSignup();
      expect(component.errorMessage).toBe('Please enter a valid email address');
    });
  });

  it('should handle loading state correctly', fakeAsync(() => {
    component.email = 'test@example.com';
    component.password = 'password123';
    component.username = 'testuser';
    component.role = 'student';

    authService.register.and.returnValue(of(mockResponse).pipe(delay(1000)));

    component.onSignup();
    expect(component.isLoading).toBeTrue();

    tick(1000);
    expect(component.isLoading).toBeFalse();
  }));
});

// Helper function to simulate delay
function delay(ms: number) {
  return <T>(obs$: Observable<T>) =>
    new Observable<T>(subscriber => {
      const sub = obs$.subscribe({
        next(x) {
          setTimeout(() => subscriber.next(x), ms);
        },
        error(err) {
          setTimeout(() => subscriber.error(err), ms);
        },
        complete() {
          setTimeout(() => subscriber.complete(), ms);
        },
      });
      return sub;
    });
}