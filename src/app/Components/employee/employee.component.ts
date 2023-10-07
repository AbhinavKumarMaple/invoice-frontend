import { Component, OnInit } from '@angular/core';
import { UpdateEmployeeComponent } from '../update-employee/update-employee.component';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/Services/employee.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  isMenuVisible: boolean = false;
  constructor(public dialog: MatDialog, private employeeService: EmployeeService) {
    this._searchTerm$.subscribe((searchTerm) => {
      this.filterCustomers(searchTerm);
    });
  }
  tableHeader: string[] = ['_id', 'businessName', 'address', 'contactNumber', 'vatNumber', 'crnNumber', 'userName', 'email', 'password', 'banks', 'inviteLink'];
  employeeList: any;
  selectedEmployee: any;
  private _searchTerm$ = new Subject<string>();
  filteredCustomerList: any;
  searchTerm: any;
  employee: string = 'employee';
  noOfRowsSelected: any;
  startDate: any;
  endDate: any;
  openDateRange: boolean = false;

  handleSidenav() {
    this.isMenuVisible = true
  }
  openDialog(data?: any): void {
    const dialogRef = this.dialog.open(UpdateEmployeeComponent, { data: data });

    dialogRef.afterClosed().subscribe((result) => {

    });

  }

  onTextChange(searchTerm: string) {
    this._searchTerm$.next(searchTerm);
  }

  filterCustomers(searchTerm: string) {
    console.log(searchTerm)
    if (!searchTerm || searchTerm.trim() === '') {
      this.filteredCustomerList = this.employeeList;
    } else {
      this.filteredCustomerList = this.employeeList.filter((employee: any) =>
        employee.businessName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }


  ngOnInit(): void {
    this.getEmployeeUnderAccountant();
  }

  getEmployeeUnderAccountant() {
    this.employeeService.employeeUnderAccountant().subscribe(response => {
      console.log(response.body);
      this.employeeList = response.body.map((el: any) => {
        return {
          _id: el._id,
          businessName: el.businessName,
          address: (el.address.buildingNameNumber ? el.address.buildingNameNumber : '') +
            (el.address?.streetName ? ' ' + el.address?.streetName : '') +
            (el.address?.landmark ? ' ' + el.address?.landmark : '') +
            (el.address?.postalCode ? ' ' + el.address?.postalCode : ''),
          contactNumber: el.contactNumber,
          vatNumber: el.vatNumber,
          crnNumber: el.crnNumber,
          userName: el.username,
          email: el.email,
          password: el.password,
          banks: el.banks
        }
      });
      this.filteredCustomerList = this.employeeList;

    })
  }

  rowSelected(event: any) {
    this.selectedEmployee = event;
  }

  rowCount(event: any) {
    this.noOfRowsSelected = event;
  }

}
