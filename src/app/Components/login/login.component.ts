import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountantService } from 'src/app/Services/accountant.service';
import { EmployeeService } from 'src/app/Services/employee.service';
import { TokenRefreshService } from 'src/app/Services/token-refresh.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  submitted = false;
  password: any;
  show = false;
  // customer
  customerBackgroundColor: string = ''; // Initialize as empty
  customerColor: string = ''; // Initialize as empty
  customerBorderRadius: number = 0; // Initialize border-radius to 0
  customerPadding: number = 10; // Initialize padding to 0
  customerShadow: string = '';
  // business
  businessBackgroundColor: string = ''; // Initialize as empty
  businessColor: string = ''; // Initialize as empty
  businessBorderRadius: number = 0; // Initialize border-radius to 0
  businessPadding: number = 10; // Initialize padding to 0
  businessShadow: string = '';
  borderColor: string = '';
  loggedInAs: any;

  setCustomerBackground() {
    this.customerBackgroundColor = '#0078F1'; // Change background color to blue
    this.businessBackgroundColor = ''; // Reset the other background color
    this.customerColor = 'white';
    this.businessColor = '';
    this.customerBorderRadius = 20; // Apply border radius of 20px
    this.customerPadding = 10; // Apply padding of 5px
    this.businessBorderRadius = 20; // Apply border radius of 20px
    this.customerShadow = 'rgba(0, 0, 0, 0.5) 0px 2px 8px';
    this.businessShadow = '';
    this.borderColor = '#0078F1';
    this.loggedInAs = 0;
  }

  setBusinessBackground() {
    this.businessBackgroundColor = '#5800A0'; // Change background color to red
    this.customerBackgroundColor = ''; // Reset the other background color
    this.customerColor = '';
    this.businessColor = 'white';
    this.businessBorderRadius = 20; // Apply border radius of 20px
    this.businessPadding = 10; // Apply padding of 5px
    this.customerBorderRadius = 0; // Reset border radius
    this.businessShadow = 'rgba(0, 0, 0, 0.5) 0px 2px 8px';
    this.customerShadow = '';
    this.borderColor = '#5800A0';
    this.loggedInAs = 1;
  }

  constructor(private route: Router,
    private formbuilder: FormBuilder,
    private employeeService: EmployeeService,
    private accountantService: AccountantService,
    private tokenRefreshService: TokenRefreshService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      const token = params['token'];

      if (token) {
        this.employeeService.loginByToken(token).subscribe(response => {
          if (response.status) {
            localStorage.setItem('loggedInAs', 'employee');
            this.tokenRefreshService.startTokenRefreshForEmployee();
            this.route.navigate(['/home/invoices'])
          }
          else {
            alert('Invalid token...');
          }
        })
      }
    })

    this.loginForm = this.formbuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.password = 'password';
    this.setCustomerBackground();
  }

  onSubmit() {
    const data = {
      email: this.loginForm.value.username,
      password: this.loginForm.value.password
    }

    const empData = {
      email: this.loginForm.value.username,
      password: this.loginForm.value.password
    }
    this.submitted = true;
    if (this.loginForm.valid) {
      if (this.loggedInAs == 0) {
        this.employeeService.login(empData).subscribe((response) => {
          if (response) {
            localStorage.setItem('loggedInAs', 'employee');
            this.tokenRefreshService.startTokenRefreshForEmployee();
            alert('Logged in successfully...');
            this.route.navigate(['/home/invoices'])
          }
        });
      }
      else if (this.loggedInAs == 1) {
        this.accountantService.login(data).subscribe(response => {
          if (response) {
            alert('Logged in successfully...');
            localStorage.setItem('loggedInAs', 'customer');
            this.tokenRefreshService.startTokenRefreshForCustomer();
            this.route.navigate(['/home/profile'])
            this.accountantService.getAccountantInfo().subscribe(response => {
              localStorage.setItem('id', response.body._id)
            })
          }
        });;
      }
    }
    else {
      alert('Invalid login details.')
    }
  }

  onClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }
}
