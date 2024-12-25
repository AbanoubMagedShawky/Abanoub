import { UserManagementComponent } from './components/user-management/user-management.component';
import { ReportsComponent } from './components/reports/reports.component';
import { BonusManagementComponent } from './components/bonus-management/bonus-management.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';

import { Routes } from '@angular/router';
import { SignupComponent } from './components/sign_up/sign.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CreateBonusManagementComponent } from './components/create_bonus-management/create_bonus-management.component';
import { PaymentComponent } from './payment/payment.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'navBar', component: NavbarComponent },

    { path: 'login', component: LoginComponent },
    { path: 'createBouns', component: CreateBonusManagementComponent },
    { path: 'payment', component: PaymentComponent },
    { path: 'sign', component: SignupComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'bonus-management', component: BonusManagementComponent },
    { path: 'reports', component: ReportsComponent },
    { path: 'user-management', component: UserManagementComponent },
  ];

