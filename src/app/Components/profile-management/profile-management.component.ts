import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AccountantService } from 'src/app/Services/accountant.service';
import { EmployeeService } from 'src/app/Services/employee.service';

@Component({
  selector: 'app-profile-management',
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss'],
})
export class ProfileManagementComponent implements OnInit {
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
  @ViewChild('fileInput') fileInput!: ElementRef;
  logoImage: any[] = [];
  logoUrl: any[] = [];
  loggedInAs: any = localStorage.getItem('loggedInAs');
  clientId: any;
  constructor(
    private accountantService: AccountantService,
    private employeeService: EmployeeService,
  ) { }

  AccountInfo: any = [];
  BusinessDetails: any = [];
  AddressDetails: any = [];
  BankDetails: any = [];
  selectedFile: any;
  ngOnInit() {
    if (this.loggedInAs == 'employee') {
      this.clientInfo();
    }
    else if (this.loggedInAs == 'customer') {
      this.accountantInfo();
    }
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
    this.showbankdetails = false;
  }
  handleSidenav() {
    this.isMenuVisible = !this.isMenuVisible;
  }
  accountantInfo() {
    this.accountantService.getAccountantInfo().subscribe((response) => {
      this.AddressDetails = response.body.address;
      this.BusinessDetails = response.body;
      this.AccountInfo = response.body;
      this.BankDetails = response.body.banks;
      localStorage.setItem('accId', response.body._id);
    });

    this.accountantService.getImage().subscribe((res) => {
      this.logoImage = res.body;

      this.convertDataToUrl(this.logoImage);
    });
  }

  clientInfo() {
    this.employeeService.employeeInfo().subscribe(response => {
      this.clientId = response.body._id;
      this.AddressDetails = response.body.address;
      this.BusinessDetails = response.body;
      this.AccountInfo = response.body;
      this.BankDetails = response.body.banks;
      this.logoImage = response.body.logo;
      this.convertDataToUrl(this.logoImage);
    })
  }

  manageCreadentials() {
    let payload = {
      username: this.AccountInfo.username,
      email: this.AccountInfo.email,
    };
    if (this.loggedInAs == 'employee') {
      this.employeeService.update(this.clientId, payload).subscribe(res => {
        window.location.reload();
      })
    }
    else if (this.loggedInAs == 'customer') {
      this.accountantService.update(payload).subscribe((response: any) => {
        window.location.reload();
      });
    }
  }

  updateBusinessDetails() {
    let payload = {
      businessName: this.BusinessDetails.businessName,
      contactNumber: this.BusinessDetails.contactNumber,
      vatNumber: this.BusinessDetails.vatNumber,
      crnNumber: this.BusinessDetails.crnNumber,
    };

    if (this.loggedInAs == 'employee') {
      this.employeeService.update(this.clientId, payload).subscribe(res => {
        window.location.reload();
      })
    }
    else if (this.loggedInAs == 'customer') {
      this.accountantService.update(payload).subscribe((response: any) => {
        window.location.reload();
      });
    }
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
    if (this.loggedInAs == 'employee') {
      this.employeeService.update(this.clientId, payload).subscribe(res => {
        window.location.reload();
      })
    }
    else if (this.loggedInAs == 'customer') {
      this.accountantService.update(payload).subscribe((response: any) => {
        console.log(response);
        window.location.reload();
      });
    }
  }
  UpdateBankDetails(bank: any) {
    let payload = {
      bankName: bank.bankName,
      accountName: bank.accountName,
      accountNumber: bank.accountNumber,
      sortCode: bank.sortCode,
      _id: bank._id,
    };
    if (this.loggedInAs == 'employee') {
      this.employeeService.updateBank(payload).subscribe(res => {
        window.location.reload();
      })
    }
    else if (this.loggedInAs == 'customer') {
      this.accountantService.updateBank(payload).subscribe((response: any) => {
        console.log(response);
        window.location.reload();
      });
    }
  }
  removeBank(bank: any) {
    let payload = {
      _id: [bank._id],
    };
    if (this.loggedInAs == 'employee') {
      this.employeeService.deleteBank(payload).subscribe(res => {
        window.location.reload();
      })
    }
    else if (this.loggedInAs == 'customer') {
      this.accountantService.removeBank(payload).subscribe((response: any) => {
        console.log(response);
        window.location.reload();
      });
    }

  }
  OpenBankAccountForm() {
    this.addbankaccount = true;
  }
  cancelAddingForm() {
    this.addbankaccount = false;
  }
  addBankAccount() {
    let payload = {
      bankName: this.bankName,
      accountName: this.accountName,
      accountNumber: this.accountNumber,
      sortCode: this.sortCode,
    };
    if (this.loggedInAs == 'employee') {
      this.employeeService.addBank(payload).subscribe(res => {
        window.location.reload();
      })
    }
    else if (this.loggedInAs == 'customer') {
      this.accountantService.addBank(payload).subscribe((response) => {
        console.log(response);
        window.location.reload();
      });
    }
  }

  openFileExplorer(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;

    const formData = new FormData();
    formData.append('image', this.selectedFile);
    this.accountantService.addImage(formData).subscribe((res) => {
      this.accountantInfo();
      window.location.reload();
    });
  }

  convertDataToUrl(data: any): void {
    data.forEach((image: any) => {
      this.logoUrl.push(`data:image/jpeg;base64,${image.data}`);
    });
  }

  handleMenu(event: any) {
    console.log(event);
    this.isMenuVisible = event;
  }
}
