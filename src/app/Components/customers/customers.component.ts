import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { UpdateDataComponent } from '../update-data/update-data.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from 'src/app/Services/customer.service';
import { saveAs } from 'file-saver';
import { CsvServiceService } from 'src/app/Services/csv-service.service';
import { BehaviorSubject, Observable, Subject, debounce, distinctUntilChanged, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomersComponent implements OnInit {
  searchTerm: any;
  isMenuVisible: boolean = false;
  isFilterOpen: boolean = false;
  tableHeaders: string[] = [
    '_id',
    'name',
    'contactNumber',
    'address',
    'bankName',
    'accountName',
    'accountNumber',
    'sortNumber',
  ];
  customerList: any;
  selectedCustomer: any;
  dataForCSV: any;
  private _searchTerm$ = new Subject<string>();
  filteredCustomerList: any;
  color: any;
  customer: string = 'customer';
  noOfRowsSelected: any;
  startDate: any;
  endDate: any;
  openDateRange: boolean = false;

  constructor(public dialog: MatDialog, private customerService: CustomerService, private csvService: CsvServiceService) {
    this._searchTerm$.subscribe((searchTerm) => {
      this.filterCustomers(searchTerm);
    });
  }

  ngOnInit(): void {
    this.getCustomerList();
    this.color = localStorage.getItem('loggedInAs');
  }

  openDialog(data?: any): void {
    const dialogRef = this.dialog.open(UpdateDataComponent, {
      data: data,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

  onTextChange(searchTerm: string) {
    this._searchTerm$.next(searchTerm);
  }

  filterCustomers(searchTerm: string) {
    if (!searchTerm || searchTerm.trim() === '') {
      this.filteredCustomerList = this.customerList;
    } else {
      this.filteredCustomerList = this.customerList.filter((customer: any) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  handleSidenav() {
    this.isMenuVisible = true;
  }

  openFilter() {
    this.isFilterOpen = true;
  }

  getCustomerList() {
    this.customerService.getAllCustomer().subscribe((response) => {
      this.customerList = response.body.customers;
      this.dataForCSV = this.customerList.map((c: any) => {
        return {
          _id: c._id,
          name: c.name,
          contactNumber: c.contactNumber,
          address: c.address.address + " " + c.address.streetLane + " " + c.address.landmark + " " + c.address.postalCode,
          bankName: c.banks[0].bankName,
          accountName: c.banks[0].accountName,
          accountNumber: c.banks[0].accountNumber,
          sortNumber: c.banks[0].sortCode
        }
      })
      this.customerList = this.customerList.map((c: any) => {
        return {
          _id: c._id,
          name: c.name,
          contactNumber: c.contactNumber,
          address:
            c.address.address +
            ',' +
            c.address.streetLane +
            ',' +
            c.address.landmark +
            ',' +
            c.address.postalCode,
          bankName: c.banks[0].bankName,
          accountName: c.banks[0].accountName,
          accountNumber: c.banks[0].accountNumber,
          sortNumber: c.banks[0].sortCode,
        };
      });
      this.filteredCustomerList = this.customerList
    });
  }

  rowSelected(event: any) {
    this.selectedCustomer = event;
  }

  convertToCSV() {
    const columnsToDownload = this.tableHeaders;
    const csvContent = this.csvService.convertToCSV(this.dataForCSV, columnsToDownload);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, 'customers.csv');
  }

  rowCount(event: any) {
    this.noOfRowsSelected = event;
  }
}
