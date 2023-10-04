import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { ProfileManagementComponent } from './Components/profile-management/profile-management.component';
import { ManagementSidenavComponent } from './Components/management-sidenav/management-sidenav.component';
import { CustomersComponent } from './Components/customers/customers.component';
import { EmployeeComponent } from './Components/employee/employee.component';
import { InvoicesComponent } from './Components/invoices/invoices.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: ManagementSidenavComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/home/profile' },
      { path: 'profile', component: ProfileManagementComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'employees', component: EmployeeComponent },
      { path: 'invoices', component: InvoicesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
