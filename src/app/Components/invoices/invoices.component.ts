import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceUpdateComponent } from '../invoice-update/invoice-update.component';
import { InvoiceService } from 'src/app/Services/invoice.service';
import { CsvServiceService } from 'src/app/Services/csv-service.service';
import { saveAs } from 'file-saver';
import { PdfService } from 'src/app/Services/pdf.service';
import { Subject } from 'rxjs';
import { AccountantService } from 'src/app/Services/accountant.service';
import { EmployeeService } from 'src/app/Services/employee.service';
import * as moment from 'moment';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent implements OnInit {
  loggedInAs: any = localStorage.getItem('loggedInAs');
  invoiceList: any;
  color: any;
  page: number = 1;
  limit: number = 7;
  selectedInvoice: any;
  tableHeaders: any = ['invoiceNumber', 'paymentStatus', 'date', 'employeeName', 'serviceDescription', 'netAmount', 'vatRate', 'vatAmount', 'totalGross', 'bankAccount', 'note'];
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
    this.getAcountantBanks();
  }

  onTextChange(searchTerm: string) {
    this._searchTerm$.next(searchTerm);
  }

  filterCustomers(searchTerm: string) {
    console.log(searchTerm)
    if (!searchTerm || searchTerm.trim() === '') {
      this.filteredCustomerList = this.invoiceList;
    } else {
      this.filteredCustomerList = this.invoiceList.filter((invoice: any) =>
        invoice.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  getInvoiceList(dateRange: any) {

    if (this.loggedInAs == 'employee') {
      this.invoiceService.getAllByEmp(dateRange).subscribe(response => {
        this.invoiceList = response.body;
        this.filteredCustomerList = this.invoiceList;
        console.log(this.filteredCustomerList)
      })
    }
    else if (this.loggedInAs == 'customer') {
      this.invoiceService.getAllByAccountant(this.page, this.limit, dateRange).subscribe(response => {
        this.invoiceList = response.body;
        this.filteredCustomerList = this.invoiceList;
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
    this.viewGenerateInvoice = true;
  }

  rowCount(event: any) {
    this.noOfRowsSelected = event;
  }

  convertToCSV() {
    const columnsToDownload = this.tableHeaders;
    const csvContent = this.csvService.convertToCSV(this.invoiceList, columnsToDownload);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, 'invoice.csv');
  }
  generateInvoice() {
    this.openBankList = !this.openBankList;
  }

  downloadPdf(data: any) {
    this.openBankList = false;
    if (this.loggedInAs == 'employee') {
      this.pdfService.getEmployeeData(this.selectedInvoice, data);
    }
    else {
      this.pdfService.getAccountantData(this.selectedInvoice, data);
    }
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

  getAcountantBanks() {
    this.accountantService.getAccountantInfo().subscribe(response => {
      this.bankList = response.body.banks;
    })
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
}
