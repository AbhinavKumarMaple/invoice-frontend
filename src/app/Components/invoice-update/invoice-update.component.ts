import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from 'src/app/Services/customer.service';
import { InvoiceService } from 'src/app/Services/invoice.service';
import { ServiceDescriptionService } from 'src/app/Services/service-description.service';
import { VatRateService } from 'src/app/Services/vat-rate.service';

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
  paymentStatus: string[] = ['Unpaid', 'Paid'];
  serviceDescriptionList: any;
  customerList: any;
  banksList: any;
  netAmountInput: any;
  selectedVatRate: any;

  constructor(private dialogRef: MatDialogRef<InvoiceUpdateComponent>,
    private formbuilder: FormBuilder,
    private vatService: VatRateService,
    private invoiceService: InvoiceService,
    private vatRateService: VatRateService,
    private customerService: CustomerService,
    private serviceDescription: ServiceDescriptionService,
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
      invoiceNumber: [this.isEdit ? this.editableData.invoiceNumber : '', [Validators.required]],
      customerName: [this.isEdit ? this.editableData.customerName : '', [Validators.required,]],
      netAmount: [this.isEdit ? this.editableData.netAmount : '', [Validators.required]],
      vatRate: [this.isEdit ? this.editableData.vatRate : '', [Validators.required]],
      vatAmount: [this.isEdit ? this.editableData.vatAmount : '', [Validators.required]],
      totalGross: [this.isEdit ? this.editableData.totalGross : '', [Validators.required]],
      bankAccount: [this.isEdit ? this.editableData.bankAccount : '', [Validators.required]],
      date: [this.isEdit ? this.editableData.date : '', [Validators.required]],
      serviceDescription: [this.isEdit ? this.editableData.serviceDescription : '', [Validators.required]],
      paymentMethod: [this.isEdit ? this.editableData.paymentMethod : '', [Validators.required]],
      paymentStatus: [this.isEdit ? this.editableData.paymentStatus : '', [Validators.required]],
      note: [this.isEdit ? this.editableData.note : '', [Validators.required]],
    });
  }

  cancelDialog(): void {
    this.dialogRef.close();
  }

  getVatRate() {
    this.vatService.getVatRate().subscribe(response => {
      this.vatRateOptions = response.body;
    })
  }

  getServiceDescription() {
    this.serviceDescription.getServiceDesc().subscribe(response => {
      this.serviceDescriptionList = response.body;
    })
  }

  getCustomer() {
    this.customerService.getAllCustomer().subscribe(response => {
      this.customerList = response.body.customers;
    })
  }

  selectedCustomer: any; // Change the type to match your customer object type

  dropdownSelected(selectedOption: any) {
    this.banksList = selectedOption?.banks;
  }

  saveInvoice() {
    console.log(this.invoiceForm.value.vatRate)
    const vatRateData = {
      vatRate: this.invoiceForm.value.vatRate
    }
    if (this.isEdit) {
      this.invoiceService.updateById(this.invoiceForm.value).subscribe(response => {
        this.cancelDialog();
        window.location.reload();
      })
    }
    else {
      this.invoiceService.create(this.invoiceForm.value).subscribe(response => {
        if (response) {
          alert('Invoice created successfully.')
          this.cancelDialog();
          this.vatRateService.generate(vatRateData).subscribe(response => {
            window.location.reload();
          })
        }
      })
    }
  }

}
