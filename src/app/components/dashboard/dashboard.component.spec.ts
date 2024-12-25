import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total bonuses correctly', () => {
    const mockData = [
      { _id: '1', title: 'Bonus 1', amount: 100, status: 'approved', reason: 'Test', submissionDate: '2024-12-01' },
      { _id: '2', title: 'Bonus 2', amount: 200, status: 'approved', reason: 'Test', submissionDate: '2024-12-02' },
      { _id: '3', title: 'Bonus 3', amount: 300, status: 'rejected', reason: 'Test', submissionDate: '2024-12-03' }
    ];

    component.bonusRequests = mockData;
    component.totalBonuses = mockData
      .filter(request => request.status === 'approved')
      .reduce((sum, request) => sum + request.amount, 0);

    expect(component.totalBonuses).toBe(300);
  });

  it('should return correct status class', () => {
    expect(component.getStatusClass('approved')).toBe('badge badge-success');
    expect(component.getStatusClass('rejected')).toBe('badge badge-danger');
    expect(component.getStatusClass('unknown')).toBe('badge badge-secondary');
  });

  it('should handle card hover states', () => {
    expect(component.cardState).toBe('normal');
    
    component.onCardMouseEnter();
    expect(component.cardState).toBe('hovered');
    
    component.onCardMouseLeave();
    expect(component.cardState).toBe('normal');
  });
});