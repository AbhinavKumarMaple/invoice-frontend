import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  activeMenuItem: string = 'profile';
  color: any = localStorage.getItem('loggedinAs')
  loggedInAs: any = localStorage.getItem('loggedInAs')
  constructor(private router: Router) { }

  Profile() {
    this.activeMenuItem = 'profile';
    localStorage.setItem('activeMenuItem', 'profile');
    this.router.navigateByUrl('/home/profile');
  }
  Employees() {
    this.activeMenuItem = 'employees';
    localStorage.setItem('activeMenuItem', 'employees');
    this.router.navigateByUrl('/home/employees');
  }
  Customers() {
    this.activeMenuItem = 'customers';
    localStorage.setItem('activeMenuItem', 'customers');
    this.router.navigateByUrl('/home/customers');
  }
  Invoices() {
    this.activeMenuItem = 'invoices';
    localStorage.setItem('activeMenuItem', 'invoices');
    this.router.navigateByUrl('/home/invoices');
  }
}
