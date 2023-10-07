import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountantService } from 'src/app/Services/accountant.service';
import { EmployeeService } from 'src/app/Services/employee.service';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.scss'],
})
export class UpdateEmployeeComponent implements OnInit {
  businessName: any;
  vatNumber: any;
  name: any;
  crnNumber: any;
  landmark: any;
  postalCode: any;
  buildingNameNumber: any;
  streetName: any;
  bankName: any;
  sortCode: any;
  accountName: any;
  accountNumber: any;
  contactNumber: any;
  username: any;
  email: any;
  password: any;
  editableData: any;
  isEdit: boolean = false;
  addbankaccount = false;
  bankList: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<UpdateEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private employeeService: EmployeeService,
    private accountantService: AccountantService
  ) {
    if (data) {
      this.isEdit = true;
      this.editableData = {
        _id: data._id,
        name: data.name,
        contactNumber: data.contactNumber,
        username: data.username,
        email: data.email,
        password: data.password,
      };
    }
  }

  ngOnInit(): void {
    this.name = this.isEdit ? this.editableData.name : '';
    this.contactNumber = this.isEdit ? this.editableData.contactNumber : '';
    this.username = this.isEdit ? this.editableData.username : '';
    this.email = this.isEdit ? this.editableData.email : '';
    this.password = this.isEdit ? this.editableData.password : '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  cancelDialog(): void {
    this.dialogRef.close();
  }

  addClient() {
    let data = {
      businessName: this.businessName,
      contactNumber: this.contactNumber,
      vatNumber: this.vatNumber,
      crnNumber: this.crnNumber,
      address: {
        buildingNameNumber: this.buildingNameNumber,
        streetName: this.streetName,
        landmark: this.landmark,
        postalCode: this.postalCode,
      },
      username: this.username,
      email: this.email,
      password: this.password,
      banks: this.bankList,
    }
    this.employeeService.addEmployee(data).subscribe(response => {
      alert('Client added successfully...');
      this.cancelDialog();
      window.location.reload();
    })
  }

  OpenBankAccountForm() {
    this.addbankaccount = true;
  }
  cancelAddingForm() {
    this.addbankaccount = false;
  }

  addBank() {
    this.bankList.push({
      bankName: this.bankName,
      accountName: this.accountName,
      accountNumber: this.accountNumber,
      sortCode: this.sortCode,
    })
    this.bankName = '';
    this.accountName = '';
    this.accountName = '';
    this.accountNumber = '';
  }

  removeBank(bankData: any) {
    this.bankList = this.bankList.filter((bank: any) => bank.bankName !== bankData.bankName);
  }
}
