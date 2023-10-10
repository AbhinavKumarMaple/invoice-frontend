import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
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
  building: any;
  street: any;
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: any;
  logoUrl: any;

  constructor(
    public dialogRef: MatDialogRef<UpdateEmployeeComponent>,
    private employeeService: EmployeeService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (data) {
      this.isEdit = true;
      this.editableData = data;
    }
  }

  ngOnInit(): void {
    this.contactNumber = this.isEdit ? this.editableData.contactNumber : '';
    this.username = this.isEdit ? this.editableData.userName : '';
    this.email = this.isEdit ? this.editableData.email : '';
    this.password = this.isEdit ? this.editableData.password : '';
    this.editableData.banks.forEach((bank: any) => {
      this.bankList.push({
        bankName: bank.bankName,
        accountName: bank.accountName,
        accountNumber: bank.accountNumber,
        sortCode: bank.sortCode,
      })
    });
    const addressParts = this.editableData?.address?.split(' ');
    this.buildingNameNumber = addressParts[0]?.trim();
    this.streetName = addressParts[1]?.trim();
    this.landmark = addressParts[2]?.trim();
    this.postalCode = addressParts[3]?.trim();
    this.businessName = this.isEdit ? this.editableData.businessName : '';
    this.vatNumber = this.isEdit ? this.editableData.vatNumber : '';
    this.crnNumber = this.isEdit ? this.editableData.crnNumber : '';
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
    if (this.isEdit) {
      this.employeeService.update(this.editableData._id, data).subscribe(res => {
        alert('Client updated successfully...');
        this.cancelDialog();
        window.location.reload();
        // this.employeeService.deleteImage(this.editableData._id).subscribe();

      })
    }
    else {
      this.employeeService.addEmployee(data).subscribe(response => {
        alert('Client added successfully...');
        this.cancelDialog();
        window.location.reload();
      })
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      // this.employeeService.addImage(formData,).subscribe();
    }

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

  openFileExplorer(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
    this.logoUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.selectedFile));
  }
}
