import { Component } from '@angular/core';
import { AccountantService } from 'src/app/Services/accountant.service';

@Component({
  selector: 'app-profile-management',
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss'],
})
export class ProfileManagementComponent {
  addbankaccount = false;
  showSecondIcon = false;
  showSecondIcon2 = false;
  showManageIcon = false;
  showbankdetails = false;
  isEditingbusiness: boolean = false;
  isEditingaddress: boolean = false;
  isEditingmanagementDetails: boolean = false;
  isEditingbankDetails: boolean = false;
  isMenuVisible: boolean = false;

  bankName: any;
  accountName: any;
  accountNumber: any;
  sortCode: any;
  constructor(private accountantService: AccountantService) {}

  AccountInfo: any = [];
  BusinessDetails: any = [];
  AddressDetails: any = [];
  BankDetails: any = [];
  ngOnInit() {
    this.accountantInfo();
  }
  editForBusiness() {
    this.showSecondIcon2 = !this.showSecondIcon2;
    this.isEditingbusiness = true;
  }
  editForAddress() {
    this.showSecondIcon = !this.showSecondIcon;
    this.isEditingaddress = true;
  }
  editForCredentials() {
    this.showManageIcon = !this.showManageIcon;
    this.isEditingmanagementDetails = true;
  }
  editBankDetails() {
    this.showbankdetails = !this.showbankdetails;
    this.isEditingbankDetails = true;
  }
  cancelBusinessEdit() {
    this.isEditingbusiness = false;
    this.showSecondIcon2 = false;
    window.location.reload();
  }
  cancelAddressEdit() {
    this.isEditingaddress = false;
    this.showSecondIcon = false;
  }
  cancelAccountEdit() {
    this.isEditingmanagementDetails = false;
    this.showManageIcon = false;
  }
  cancelBankEdit() {
    this.isEditingbankDetails = false;
    this.showbankdetails=false
  }
  handleSidenav() {
    this.isMenuVisible = true;
  }
  accountantInfo() {
    this.accountantService.getAccountantInfo().subscribe((response) => {
      console.log(response);
      this.AddressDetails = response.body.address;
      console.log(this.AddressDetails);
      this.BusinessDetails = response.body;
      console.log(this.BusinessDetails);
      this.AccountInfo = response.body;
      console.log(this.AccountInfo);
      this.BankDetails = response.body.banks;
      console.log(this.BankDetails);
    });
  }

  updateBusinessDetails() {
    let payload = {
      businessName: this.BusinessDetails.businessName,
      contactNumber: this.BusinessDetails.contactNumber,
      vatNumber: this.BusinessDetails.vatNumber,
      crnNumber: this.BusinessDetails.crnNumber,
    };
    console.log(payload);
    this.accountantService.update(payload).subscribe((response: any) => {
      console.log(response);
      // location.reload();
    });
  }
  updateAddress() {
    let payload = {
      address: {
        buildingNameNumber: this.AddressDetails.buildingNameNumber,
        streetName: this.AddressDetails.streetName,
        landmark: this.AddressDetails.landmark,
        postalCode: this.AddressDetails.postalCode,
      },
    };
    console.log(payload);
    this.accountantService.update(payload).subscribe((response: any) => {
      console.log(response);
      // location.reload();
    });
  }
  UpdateBankDetails(bank: any) {
    let payload = {
      bankName: bank.bankName,
      accountName: bank.bankName,
      accountNumber: bank.bankName,
      sortCode: bank.bankName,
      _id: bank._id,
    };
    console.log(payload)
    this.accountantService.updateBank(payload).subscribe((response: any) => {
      console.log(response);
    });
  }
  removeBank(bank: any) {
    let payload = {
      _id: [bank._id],
    };
    console.log(payload);
    this.accountantService.removeBank(payload).subscribe((response: any) => {
      console.log(response);
    });
  }
  OpenBankAccountForm() {
    this.addbankaccount = true;
  }
  cancelAddingForm() {
    this.addbankaccount = false;
  }
  addBankAccount() {
    console.log('hey');
    let payload = {
      bankName: this.bankName,
      accountName: this.accountName,
      accountNumber: this.accountNumber,
      sortCode: this.sortCode,
    };
    this.accountantService.addBank(payload).subscribe((response) => {
      console.log(response);
    });
  }
}
