import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceUpdateComponent } from '../../invoice-update/invoice-update.component';
import { InvoiceService } from 'src/app/Services/invoice.service';
import { CsvServiceService } from 'src/app/Services/csv-service.service';
import { saveAs } from 'file-saver';
import { PdfService } from 'src/app/Services/pdf.service';
import { Subject } from 'rxjs';
import { AccountantService } from 'src/app/Services/accountant.service';
import { EmployeeService } from 'src/app/Services/employee.service';
import * as moment from 'moment';

@Component({
  selector: 'app-generated-invoice',
  templateUrl: './generated-invoice.component.html',
  styleUrls: ['./generated-invoice.component.scss']
})
export class GeneratedInvoiceComponent {
  loggedInAs: any = localStorage.getItem('loggedInAs');
  invoiceList: any;
  color: any;
  page: number = 1;
  limit: number = 7;
  selectedInvoice: any;
  tableHeaders: any = ['invoiceNumber', 'date', 'customerName', 'netAmount', 'vatRate', 'vatAmount', 'totalGross', 'bankAccount', 'note'];
  viewGenerateInvoice: boolean = false;
  private _searchTerm$ = new Subject<string>();
  filteredCustomerList: any;
  searchTerm: any;
  invoice: string = 'invoice'
  noOfRowsSelected: any;
  bankList: any;
  selectedBank: any;
  openBankList: any = false;
  startDate: any;
  endDate: any;
  openDateRange: boolean = false;
  selectedInvoiceList: any[] = [];
  generatedInvoice: string = 'generatedInvoice'
  searchedUserName: string = '';

  constructor(public dialog: MatDialog, private invoiceService: InvoiceService, private csvService: CsvServiceService, private pdfService: PdfService, private accountantService: AccountantService, private employeeService: EmployeeService) {
    this._searchTerm$.subscribe((searchTerm) => {
      this.filterCustomers(searchTerm);
    });
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
    this.getInvoiceList(data);

    this.color = localStorage.getItem('loggedInAs');
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
    this.getInvoiceList(data);
  }
  onTextChange(searchTerm: string) {
    this._searchTerm$.next(searchTerm);
  }

  filterCustomers(searchTerm: string) {
    if (!searchTerm || searchTerm.trim() === '') {
      this.filteredCustomerList = this.invoiceList;
    } else {
      this.filteredCustomerList = this.invoiceList.filter((invoice: any) =>
        invoice.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  getInvoiceList(dateRange: any, userName?: any) {
    if (userName && userName?.length > 1) {
      this.invoiceService.getGeneratedInvoice(this.page, this.limit, dateRange, userName).subscribe(response => {
        this.invoiceList = response.body;
        this.filteredCustomerList = this.invoiceList;
        console.log(this.filteredCustomerList)
      })
    }
    else {
      this.invoiceService.getGeneratedInvoice(this.page, this.limit, dateRange).subscribe(response => {
        this.invoiceList = response.body;
        this.filteredCustomerList = this.invoiceList;
        console.log(this.filteredCustomerList)
      })
    }
  }

  openDialog(data?: any): void {
    const dialogRef = this.dialog.open(InvoiceUpdateComponent, { data: data });
    dialogRef.afterClosed().subscribe((result) => { });
  }

  isMenuVisible: boolean = false;

  handleSidenav() {
    this.isMenuVisible = true
  }

  rowSelected(event: any) {
    this.selectedInvoice = event;
    this.selectedInvoiceList.push(event);
    this.viewGenerateInvoice = true;
  }

  rowCount(event: any) {
    this.noOfRowsSelected = event;
    if (this.noOfRowsSelected == 0) {
      this.viewGenerateInvoice = false;
    }
  }

  convertToCSV() {
    const columnsToDownload = this.tableHeaders;
    const csvContent = this.csvService.convertToCSV(this.invoiceList, columnsToDownload);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, 'invoice.csv');
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
      this.getInvoiceList(data);
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
    this.getInvoiceList(data);
  }

  onDateRangeChange() {

    let formatedStartDate = this.formatDate(this.startDate);
    let formatedEndDate = this.formatDate(this.endDate);
    this.openDateRange = false;
    let data = {
      startDate: formatedStartDate,
      endDate: formatedEndDate
    }
    this.getInvoiceList(data);
  }

  formatDate(date: Date): string {
    return moment(date).format('YYYY-MM-DD');
  }

  handleMenu(event: any) {
    console.log(event)
    this.isMenuVisible = event;
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
    if (this.searchedUserName != '') {
      this.getInvoiceList(data, this.searchedUserName);
    }
    this.openDateRange = false;
  }
}
