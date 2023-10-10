import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from 'src/app/Services/customer.service';
import { EmployeeService } from 'src/app/Services/employee.service';
import { InvoiceService } from 'src/app/Services/invoice.service';
import { ServiceDescriptionService } from 'src/app/Services/service-description.service';
import { VatRateService } from 'src/app/Services/vat-rate.service';
import * as moment from 'moment';
import { createApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-invoice-update',
  templateUrl: './invoice-update.component.html',
  styleUrls: ['./invoice-update.component.scss']
})
export class InvoiceUpdateComponent implements OnInit {
  invoiceForm!: FormGroup;
  editableData: any;
  isEdit: boolean = false;
  vatRateOptions: any;
  paymentMethod: string[] = ['Cash', 'Cheque', 'Bank Transfer'];
  serviceDescriptionList: any;
  customerList: any;
  banksList: any;
  netAmountInput: any;
  selectedVatRate: any;
  selectedCustomer: any;
  vatRate: any;
  loggedInAs: any = localStorage.getItem('loggedInAs');
  customerID: any = localStorage.getItem('id');
  openVatList: boolean = false;
  openCustomerList: boolean = false;
  openBankList: boolean = false;
  openServiceList: boolean = false;
  openPaymentList: boolean = false;
  description: any[] = [];
  createdFor: any;
  activeMenuItem: any = localStorage.getItem('activeMenuItem');

  constructor(private dialogRef: MatDialogRef<InvoiceUpdateComponent>,
    private formbuilder: FormBuilder,
    private vatService: VatRateService,
    private invoiceService: InvoiceService,
    private vatRateService: VatRateService,
    private customerService: CustomerService,
    private serviceDescription: ServiceDescriptionService,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data?: any,
  ) {
    this.editableData = data;
    if (data) {
      console.log(data)
      this.isEdit = true;
    }
  }

  ngOnInit(): void {
    this.getVatRate();
    this.getCustomer();
    this.getServiceDescription();

    this.invoiceForm = this.formbuilder.group({
      customerName: [this.isEdit ? this.editableData.customerName : '', [Validators.required,]],
      netAmount: [this.isEdit ? this.editableData.netAmount : '', [Validators.required]],
      vatRate: [this.isEdit ? this.editableData.vatRate : '', [Validators.required]],
      vatAmount: [this.isEdit ? this.editableData.vatAmount : '', [Validators.required]],
      totalGross: [this.isEdit ? this.editableData.totalGross : '', [Validators.required]],
      bankAccount: [this.isEdit ? this.editableData.bankAccount : '', [Validators.required]],
      date: [this.isEdit ? this.editableData.date : new Date(), [Validators.required]],
      serviceDescription: [this.isEdit ? this.editableData.serviceDescription : '', [Validators.required]],
      paymentMethod: [this.isEdit ? this.editableData.paymentMethod : '', [Validators.required]],
      note: [this.isEdit ? this.editableData.note : '', [Validators.required]],
    });
    this.createdFor = this.isEdit ? this.editableData.createdFor : '';
  }

  cancelDialog(): void {
    this.dialogRef.close();
  }

  getVatRate() {
    if (this.loggedInAs == 'employee') {
      this.vatService.getVatRate().subscribe(response => {
        this.vatRateOptions = response.body;
      })
    } else {
      this.vatService.getVatRate().subscribe(response => {
        if (response) {
          this.vatRateOptions = response.body;
        }
      })
    }
  }

  getServiceDescription() {
    this.serviceDescription.getServiceDesc().subscribe(response => {
      this.serviceDescriptionList = response.body;
    })
  }

  getCustomer() {
    if (this.loggedInAs == 'employee') {
      this.customerService.getAllCustomer().subscribe(response => {
        this.customerList = response.body.customers;
      })
    }
    else if (this.loggedInAs == 'customer') {
      this.employeeService.employeeUnderAccountant().subscribe(response => {
        this.customerList = response.body;
      })
    }
  }

  setBank(bank: any) {
    let bankName = this.invoiceForm.get('bankAccount');
    bankName?.patchValue(bank);
    this.openBankList = false;
  }

  setDesc(data: any) {
    let description = this.invoiceForm.get('serviceDescription');
    description?.patchValue(data);
    this.openServiceList = false;
  }

  setPayment(data: any) {
    let method = this.invoiceForm.get('paymentMethod');
    method?.patchValue(data);
    this.openPaymentList = false;
  }

  dropdownSelected(selectedOption: any) {
    this.createdFor = selectedOption._id;
    this.banksList = selectedOption?.banks;
    let customer = this.invoiceForm.get('customerName');
    customer?.patchValue(selectedOption.name ? selectedOption.name : selectedOption.businessName);
    this.openCustomerList = false;
  }

  calculateGross(value?: any) {
    let vat = this.invoiceForm.get('vatAmount');
    let gross = this.invoiceForm.get('totalGross');
    let vatRate = this.invoiceForm.get('vatRate');

    this.openVatList = false;

    if (value) {
      vatRate?.patchValue(value);
      vat?.patchValue((this.invoiceForm.value.netAmount * value) / 100)
      gross?.patchValue(Number(this.invoiceForm.value.netAmount) + Number(this.invoiceForm.value.vatAmount))
    }
    else {
      vat?.patchValue((this.invoiceForm.value.netAmount * this.invoiceForm.value.vatRate) / 100)
      gross?.patchValue(Number(this.invoiceForm.value.netAmount) + Number(this.invoiceForm.value.vatAmount))
    }
  }


  saveInvoice() {
    const vatRateData = {
      vatRate: this.invoiceForm.value.vatRate
    }
    const data = {
      customerName: this.invoiceForm.value.customerName,
      createdFor: this.createdFor,
      netAmount: this.invoiceForm.value.netAmount,
      vatRate: this.invoiceForm.value.vatRate,
      vatAmount: this.invoiceForm.value.vatAmount,
      totalGross: this.invoiceForm.value.totalGross,
      bankAccount: this.invoiceForm.value.bankAccount,
      date: moment(this.invoiceForm.value.date).format('YYYY-MM-DD'),
      serviceDescription: this.description,
      paymentMethod: this.invoiceForm.value.paymentMethod,
      paymentStatus: 'Unpaid',
      note: this.invoiceForm.value.note
    };
    console.log(data);
    if (this.isEdit) {
      if (this.activeMenuItem == 'generatedInvoice') {
        this.invoiceService.updateGeneratedInvoiceById(this.editableData._id, data).subscribe();
        this.cancelDialog();
        window.location.reload();
      }
      else {
        this.invoiceService.updateById(this.editableData._id, data).subscribe(response => {
          alert('Invoice updated successfully');
          this.vatRateService.update(data.vatRate._id, data.vatRate.vatRate).subscribe();
          this.cancelDialog();
          window.location.reload();
        })
      }
    }
    else {
      this.invoiceService.create(data).subscribe(response => {
        if (response) {
          alert('Invoice created successfully.')
          this.cancelDialog();
          this.vatRateService.generate(vatRateData).subscribe(response => {
            if (response.error) {
              alert(response.error.message);
            }
          });
          this.description.forEach((desc: any) => {
            let data = {
              description: desc
            }
            this.serviceDescription.generate(data).subscribe(response => {
              console.log(response)
            });
          })
        }
      })
    }
  }

  addDescription() {
    this.description.push(
      this.invoiceForm.value.serviceDescription
    )

  }

}
