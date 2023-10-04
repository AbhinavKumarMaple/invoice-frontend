import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceUpdateComponent } from '../invoice-update/invoice-update.component';
import { InvoiceService } from 'src/app/Services/invoice.service';
import { CsvServiceService } from 'src/app/Services/csv-service.service';
import { saveAs } from 'file-saver';
import { PdfService } from 'src/app/Services/pdf.service';
import { Subject } from 'rxjs';

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
  limit: number = 10;
  selectedInvoice: any;
  tableHeaders: any = ['invoiceNumber', 'date', 'serviceDescription', 'netAmount', 'vatRate', 'vatAmount', 'totalGross', 'paymentMethod', 'bankAccount', 'paymentStatus', 'note'];
  tableHeaderForCustomer: any = ['invoiceNumber', 'date', 'customerName', 'serviceDescription', 'netAmount', 'vatRate', 'vatAmount', 'totalGross', 'paymentMethod', 'bankAccount', 'paymentStatus', 'note'];
  viewGenerateInvoice: boolean = false;
  private _searchTerm$ = new Subject<string>();
  filteredCustomerList: any;
  searchTerm: any;

  constructor(public dialog: MatDialog, private invoiceService: InvoiceService, private csvService: CsvServiceService, private pdfService: PdfService) {
    this._searchTerm$.subscribe((searchTerm) => {
      this.filterCustomers(searchTerm);
    });
  }

  ngOnInit(): void {
    this.getInvoiceList();
    this.color = localStorage.getItem('loggedInAs');
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
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  getInvoiceList() {
    if (this.loggedInAs == 'employee') {
      this.invoiceService.getAllByEmp().subscribe(response => {
        this.invoiceList = response.body;
        this.filteredCustomerList = this.invoiceList;
      })
    }
    else if (this.loggedInAs == 'customer') {
      this.invoiceService.getAllByAccountant(this.page, this.limit).subscribe(response => {
        this.invoiceList = response.body;
        this.filteredCustomerList = this.invoiceList;
        console.log(this.invoiceList)
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

  convertToCSV() {
    const columnsToDownload = this.loggedInAs == 'employee' ? this.tableHeaders : this.tableHeaderForCustomer;
    const csvContent = this.csvService.convertToCSV(this.invoiceList, columnsToDownload);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, 'invoice.csv');
  }
  generateInvoice() {
    this.pdfService.getAccountantData(this.selectedInvoice);
  }
}
