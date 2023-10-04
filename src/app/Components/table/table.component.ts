import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountantService } from 'src/app/Services/accountant.service';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() tableHeaders: string[] = [];
  @Input() tableData: any[] = [];
  @Output() rowSelected = new EventEmitter<any>();
  user: any = localStorage.getItem('loggedInAs');
  title: any;

  constructor(private accountantService: AccountantService, private clipboard: Clipboard) {

  }

  ngOnInit(): void {
    this.toTitleCase();
  }

  onCheckboxChange(row: any): void {
    if (row.selected) {
      this.rowSelected.emit(row);
    }
  }

  private toTitleCase(): any {
    this.title = this.tableHeaders.map(header => header.replace(/([A-Z])/g, ' $1').toUpperCase());
  }

  onInviteClick(employee: any) {
    const data = {
      username: employee.username,
      password: employee.password
    }
    this.accountantService.generateEmpInviteLink(data).subscribe(response => {
      alert(response.body.message + ' Link copied to clipboard.');
      this.clipboard.copy(response.body.inviteLink);
    });
  }

}
