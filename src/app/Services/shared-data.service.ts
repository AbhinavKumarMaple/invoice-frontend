import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  invoiceByUserId: any;

  constructor() { }

  storeData(data: any) {
    this.invoiceByUserId = data._id;
  }

  returnData(): any {
    return this.invoiceByUserId;
  }
}
