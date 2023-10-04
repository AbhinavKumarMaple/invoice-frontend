import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/Services/employee.service';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.scss'],
})
export class UpdateEmployeeComponent implements OnInit {
  name: any;
  contactNumber: any;
  username: any;
  email: any;
  password: any;
  editableData: any;
  isEdit: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UpdateEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private employeeService: EmployeeService
  ) {
    if (data) {
      this.isEdit = true;
      this.editableData = {
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

  addEmployee() {
    let payload = {
      name: this.name,
      contactNumber: this.contactNumber,
      username: this.username,
      email: this.email,
      password: this.password,
    };

    if (this.isEdit) {
      this.employeeService.update(this.editableData).subscribe(response => {
        alert('Employee added successfully...');
        this.onNoClick();
        window.location.reload();
      })
    }
    else {
      this.employeeService.addEmployee(payload).subscribe((response: any) => {
        alert('Employee added successfully...');
        this.onNoClick();
        window.location.reload();
      })
    }
  }
}
