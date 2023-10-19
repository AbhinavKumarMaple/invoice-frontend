import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from 'src/app/Services/customer.service';

@Component({
  selector: 'app-update-data',
  templateUrl: './update-data.component.html',
  styleUrls: ['./update-data.component.scss']
})
export class UpdateDataComponent implements OnInit {
  customerForm!: FormGroup;
  editableData: any;
  building?: any;
  street?: any;
  city?: any;
  landmark?: any;
  postalCode?: any;
  isEdit: boolean = false;
  bankList: any[] = [];



  constructor(private dialogRef: MatDialogRef<UpdateDataComponent>,
    private formbuilder: FormBuilder,
    private customerService: CustomerService,
    @Inject(MAT_DIALOG_DATA) public data?: any) {
    this.editableData = data;
    if (data) {
      console.log(data)
      const addressParts = this.editableData?.address?.split(',');
      this.building = addressParts[0].trim();
      this.street = addressParts[1]?.trim();
      this.landmark = addressParts[2]?.trim();
      this.postalCode = addressParts[3]?.trim();
      for (let i = 0; i < this.editableData.bankName.length; i++) {
        this.bankList.push({
          bankName: this.editableData.bankName[i],
          accountName: this.editableData.accountName[i],
          accountNumber: this.editableData.accountNumber[i],
          sortCode: this.editableData.sortNumber[i],
        })
      }
      console.log(this.bankList)
      this.isEdit = true;
    }
  }

  ngOnInit(): void {
    this.customerForm = this.formbuilder.group({
      customerName: [this.isEdit ? this.editableData.name : '', [Validators.required]],
      contactNumber: [this.isEdit ? this.editableData.contactNumber : '', [Validators.required,]],
      buildingName: [this.isEdit ? this.building : '', [Validators.required]],
      landmark: [this.isEdit ? this.landmark : '', [Validators.required]],
      street: [this.isEdit ? this.street : '', [Validators.required]],
      postalCode: [this.isEdit ? this.postalCode : '', [Validators.required]],
      bankName: [this.isEdit ? this.editableData.bankName : '', [Validators.required]],
      accountName: [this.isEdit ? this.editableData.accountName : '', [Validators.required]],
      accountNumber: [this.isEdit ? this.editableData.accountNumber : '', [Validators.required]],
      sortCode: [this.isEdit ? this.editableData.sortNumber : '', [Validators.required]],
    });
  }

  cancelDialog(): void {
    this.dialogRef.close();
  }

  saveCustomer() {
    const data = {
      name: this.customerForm.value.customerName,
      contactNumber: this.customerForm.value.contactNumber,
      address: {
        address: this.customerForm.value.buildingName,
        landmark: this.customerForm.value.landmark,
        streetLane: this.customerForm.value.street,
        postalCode: this.customerForm.value.postalCode,
      },
      banks: this.bankList
    }

    console.log(this.bankList)

    if (this.isEdit) {
      this.customerService.update(this.editableData._id, data).subscribe(response => {
        alert('Customer Updated Successfully...');
        this.cancelDialog();
        window.location.reload();
      });
    }
    else {
      this.customerService.create(data).subscribe(response => {
        alert('Customer Added Successfully...')
        this.cancelDialog();
        window.location.reload();
      })
    }
  }

  addBankToList() {
    this.bankList.push({
      bankName: this.customerForm.value.bankName,
      accountNumber: this.customerForm.value.accountNumber,
      accountName: this.customerForm.value.accountName,
      sortCode: this.customerForm.value.sortCode
    })
  }

}
