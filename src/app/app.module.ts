import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDividerModule } from '@angular/material/divider';
import { AppRoutingModule } from './app-routing.module';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ProfileManagementComponent } from './Components/profile-management/profile-management.component';
import { ManagementSidenavComponent } from './Components/management-sidenav/management-sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomersComponent } from './Components/customers/customers.component';
import { EmployeeComponent } from './Components/employee/employee.component';
import { InvoicesComponent } from './Components/invoices/invoices.component';
import { TableComponent } from './Components/table/table.component';
import { SidenavComponent } from './Components/sidenav/sidenav.component';
import { UpdateDataComponent } from './Components/update-data/update-data.component';
import { InvoiceUpdateComponent } from './Components/invoice-update/invoice-update.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AccountantService } from './Services/accountant.service';
import { EmployeeService } from './Services/employee.service';
import { CustomerService } from './Services/customer.service';
import { InvoiceService } from './Services/invoice.service';
import { TokenRefreshService } from './Services/token-refresh.service';
import { AuthInterceptor } from './Interpreters/auth.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { UpdateEmployeeComponent } from './Components/update-employee/update-employee.component';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileManagementComponent,
    ManagementSidenavComponent,
    CustomersComponent,
    EmployeeComponent,
    InvoicesComponent,
    TableComponent,
    UpdateDataComponent,
    InvoiceUpdateComponent,
    SidenavComponent,
    UpdateEmployeeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    HttpClientModule,
    ClipboardModule,
  ],
  providers: [
    AccountantService,
    EmployeeService,
    CustomerService,
    InvoiceService,
    TokenRefreshService,
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
