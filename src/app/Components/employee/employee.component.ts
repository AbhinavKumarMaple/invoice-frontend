import { Component, OnInit } from '@angular/core';
import { UpdateEmployeeComponent } from '../update-employee/update-employee.component';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/Services/employee.service';
import { Subject } from 'rxjs';
import { CsvServiceService } from 'src/app/Services/csv-service.service';
import { saveAs } from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  page: number = 1;
  limit: number = 7;
  isMenuVisible: boolean = false;
  constructor(public dialog: MatDialog, private employeeService: EmployeeService, private csvService: CsvServiceService) {
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
  searchedUserName: string = 'a';


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
    const currentDate = moment();
    const startDate = currentDate.clone().subtract(1, 'day');
    this.startDate = startDate.format('YYYY-MM-DD');
    this.endDate = currentDate.format('YYYY-MM-DD');
    let data = {
      startDate: this.startDate,
      endDate: this.endDate
    }
    this.getEmployeeUnderAccountant(data);
  }

  getEmployeeUnderAccountant(data?: any, userName?: any) {
    if (userName && userName?.length > 1) {
      this.employeeService.employeeUnderAccountant(this.page, this.limit, data, userName).subscribe(response => {
        console.log(response.body);
        this.employeeList = response.body.map((el: any) => {
          return {
            _id: el._id,
            businessName: el.businessName,
            address: (el.address?.buildingNameNumber ? el.address.buildingNameNumber : '') +
              (el.address?.streetName ? ' ' + el.address?.streetName : '') +
              (el.address?.landmark ? ' ' + el.address?.landmark : '') +
              (el.address?.postalCode ? ' ' + el.address?.postalCode : ''),
            contactNumber: el.contactNumber,
            vatNumber: el.vatNumber,
            crnNumber: el.crnNumber,
            userName: el.username,
            email: el.email,
            password: el.password,
            banks: el.banks,
            image: el.image,
          }
        });
        this.filteredCustomerList = this.employeeList;

      })
    }
    else {
      this.employeeService.employeeUnderAccountant(this.page, this.limit, data).subscribe(response => {
        console.log(response.body);
        this.employeeList = response.body.map((el: any) => {
          return {
            _id: el._id,
            businessName: el.businessName,
            address: (el.address?.buildingNameNumber ? el.address.buildingNameNumber : '') +
              (el.address?.streetName ? ' ' + el.address?.streetName : '') +
              (el.address?.landmark ? ' ' + el.address?.landmark : '') +
              (el.address?.postalCode ? ' ' + el.address?.postalCode : ''),
            contactNumber: el.contactNumber,
            vatNumber: el.vatNumber,
            crnNumber: el.crnNumber,
            userName: el.username,
            email: el.email,
            password: el.password,
            banks: el.banks,
            image: el.image,
          }
        });
        this.filteredCustomerList = this.employeeList;

      })
    }
  }

  rowSelected(event: any) {
    this.selectedEmployee = event;
  }

  rowCount(event: any) {
    this.noOfRowsSelected = event;
  }

  convertToCSV() {
    const columnsToDownload = this.tableHeader;
    const csvContent = this.csvService.convertToCSV(this.employeeList, columnsToDownload);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, 'client.csv');
  }

  handleMenu(event: any) {
    console.log(event)
    this.isMenuVisible = event;
  }

  leftPage() {
    let formatedStartDate = this.formatDate(this.startDate);
    let formatedEndDate = this.formatDate(this.endDate);
    let data = {
      startDate: formatedStartDate,
      endDate: formatedEndDate
    }
    if (this.page >= 1) {
      this.page -= 1;
      this.getEmployeeUnderAccountant(data);
    }
  }
  rightPage() {
    let formatedStartDate = this.formatDate(this.startDate);
    let formatedEndDate = this.formatDate(this.endDate);
    let data = {
      startDate: formatedStartDate,
      endDate: formatedEndDate
    }
    this.page += 1;
    this.getEmployeeUnderAccountant(data);
  }
  formatDate(date: Date): string {
    return moment(date).format('YYYY-MM-DD');
  }

  setLimit() {
    const currentDate = moment();
    const startDate = currentDate.clone().subtract(1, 'day');
    this.startDate = startDate.format('YYYY-MM-DD');
    this.endDate = currentDate.format('YYYY-MM-DD');
    let data = {
      startDate: this.startDate,
      endDate: this.endDate
    }
    this.getEmployeeUnderAccountant(data);
  }

  searchUser() {
    const currentDate = moment();
    const startDate = currentDate.clone().subtract(1, 'day');
    this.startDate = startDate.format('YYYY-MM-DD');
    this.endDate = currentDate.format('YYYY-MM-DD');
    let data = {
      startDate: this.startDate,
      endDate: this.endDate
    }
    if (this.searchedUserName.length > 1) {
      this.getEmployeeUnderAccountant(data, this.searchedUserName);
    }
    else {
      this.getEmployeeUnderAccountant(data);
    }
    this.openDateRange = false;
  }

}
