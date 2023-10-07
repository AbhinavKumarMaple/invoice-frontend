import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountantService } from 'src/app/Services/accountant.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { InvoiceService } from 'src/app/Services/invoice.service';
import { CustomerService } from 'src/app/Services/customer.service';
import { EmployeeService } from 'src/app/Services/employee.service';
import { outputAst } from '@angular/compiler';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() tableHeaders: string[] = [];
  @Input() tableData: any[] = [];
  @Output() rowSelected = new EventEmitter<any>();
  @Output() noOfRowsSelected = new EventEmitter<any>();

  user: any = localStorage.getItem('loggedInAs');
  title: any;
  sortedHeader: any;
  isAscending: any;
  @Input() component: any;
  noOfRows: any = 0;
  openBankList: boolean[] = [];


  constructor(private accountantService: AccountantService,
    private clipboard: Clipboard,
    private invoiceService: InvoiceService,
    private customerService: CustomerService,
    private employeeService: EmployeeService) {

  }

  ngOnInit(): void {
    this.toTitleCase();
  }

  isArrayOfObjects(obj: any): boolean {
    return Array.isArray(obj);
  }

  onCheckboxChange(row: any): void {
    row.selected ? this.noOfRows++ : this.noOfRows--;
    if (row.selected) {
      this.rowSelected.emit(row);
    }
    this.noOfRowsSelected.emit(this.noOfRows);
  }

  private toTitleCase(): any {
    this.title = this.tableHeaders.map(header => header.replace(/([A-Z])/g, ' $1').toUpperCase());
  }

  onInviteClick(employee: any) {
    const data = {
      email: employee.email,
    }
    this.accountantService.generateEmpInviteLink(data).subscribe(response => {
      alert(response.body.message + ' Link copied to clipboard.');
      this.clipboard.copy(response.body.inviteLink);
    });
  }

  sort(column: string) {
    const key = column.toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    if (this.sortedHeader === key) {
      this.isAscending = !this.isAscending;
    } else {
      this.sortedHeader = key;
      this.isAscending = true;
    }

    this.tableData.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (aValue === bValue) return 0;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return this.isAscending ? aValue - bValue : bValue - aValue;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return this.isAscending ? -1 : 1;
      }
    });
  }

  delete(data: any) {

    if (this.component == 'invoice') {
      this.invoiceService.delete(data._id).subscribe(response => {
        console.log(data)
        alert('Invoice deleted successfully...');
        window.location.reload();
      })
    }
    else if (this.component == 'customer') {
      this.customerService.removeCustomer(data._id).subscribe(response => {
        alert('Customer deleted successfully...');
        window.location.reload();
      })
    }
    else if (this.component == 'employee') {
      this.employeeService.delete(data._id).subscribe(response => {
        alert('Client deleted successfully...');
        window.location.reload();
      })
    }
  }
  getAllInvoices(header: any, row: any) {
    console.log(header)
    console.log(row);
    if (header == 'name') {

    }
  }

}
