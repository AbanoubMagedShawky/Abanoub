// reports.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReportsComponent } from './reports.component';
import { FilterPipe } from './../../filter.pipe';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        FormsModule,
        FilterPipe
      ],
      declarations: [ ReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total bonus correctly', () => {
    component.reports = [
      { _id: '1', totalAmount: 1000, count: 2 },
      { _id: '2', totalAmount: 2000, count: 3 }
    ];
    expect(component.getTotalBonus()).toBe(3000);
  });

  it('should calculate total count correctly', () => {
    component.reports = [
      { _id: '1', totalAmount: 1000, count: 2 },
      { _id: '2', totalAmount: 2000, count: 3 }
    ];
    expect(component.getTotalCount()).toBe(5);
  });

  it('should handle empty reports array', () => {
    component.reports = [];
    expect(component.getTotalBonus()).toBe(0);
    expect(component.getTotalCount()).toBe(0);
  });

  it('should display loading state', () => {
    component.loading = true;
    fixture.detectChanges();
    const loadingElement = fixture.nativeElement.querySelector('.loading-container');
    expect(loadingElement).toBeTruthy();
  });

  it('should display error state', () => {
    component.error = 'Test error';
    fixture.detectChanges();
    const errorElement = fixture.nativeElement.querySelector('.error-container');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain('Test error');
  });
});