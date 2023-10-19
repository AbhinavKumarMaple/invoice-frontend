import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { AccountantService } from './accountant.service';
import * as moment from 'moment';
import { CustomerService } from './customer.service';
import { EmployeeService } from './employee.service';
import { InvoiceService } from './invoice.service';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  logoUrl: any[] = [];
  employeeLogo: any;
  activeMenuItem: any = localStorage.getItem('activeMenuItem');

  constructor(private accountantService: AccountantService, private employeeService: EmployeeService, private invoiceService: InvoiceService, private customerService: CustomerService) { }

  generatePDF(data: any, accountantData: any, bankData: any, clientData?: any, image?: any, customerData?: any) {
    const pdf = new jsPDF('p', 'pt', 'A4');

    let x = 20;
    let y = 40;
    const imageWidth = 100;
    const imageHeight = 100;
    let maxWidth = 100;

    pdf.setFontSize(16);
    pdf.addImage(image ? image : 'LOGO', x, y, imageWidth, imageHeight);
    x += 550;

    pdf.setFontSize(12);
    pdf.setFont('Helvetica', 'bold');
    pdf.text(accountantData.businessName, x, y, { align: 'right' });
    y += 20;
    pdf.setFontSize(8);
    pdf.setFont('Helvetica', 'bold');
    pdf.text(accountantData.name ? accountantData.name : '', x, y, { align: 'right' });
    y += 20;
    pdf.text(accountantData.address.buildingNameNumber, x, y, { align: 'right' });
    y += 20;
    pdf.text(accountantData.address.landmark, x, y, { align: 'right' });
    y += 20;
    pdf.text(accountantData.address.streetName, x, y, { align: 'right' });
    y += 20;
    pdf.text(accountantData.address.postalCode.toString(), x, y, { align: 'right' });
    y += 20;
    pdf.text(accountantData.contactNumber.toString(), x, y, { align: 'right' });
    y += 20;
    pdf.text('CRN:' + accountantData.crnNumber.toString(), x, y, { align: 'right' });
    y += 20;
    pdf.text('VAT Reg. No:' + accountantData.vatNumber.toString(), x, y, { align: 'right' });
    y += 30;

    x = 20;
    pdf.setFontSize(10);
    pdf.setFont('Helvetica', 'bold');
    pdf.text('Invoice To Client', x, y);
    y += 20;
    pdf.setFontSize(8);
    pdf.setFont('Helvetica', 'normal');
    const formattedDate = moment(data.date).format('D MMMM YYYY');
    pdf.text('Invoice Date:   ' + formattedDate, x, y);
    y += 20;
    pdf.text('Due Date:   3-August-2023', x, y);
    y -= 40;
    x += 550
    pdf.setFontSize(10);
    pdf.setFont('Helvetica', 'bold');
    if (clientData?.businessName != null) {
      pdf.text(clientData.businessName, x, y, { align: 'right' });
    }
    else {
      pdf.text(customerData.name, x, y, { align: 'right' });
    }
    y += 20;
    pdf.setFontSize(8);
    pdf.setFont('Helvetica', 'normal');
    if (clientData?.address != null) {
      pdf.text(clientData.address?.buildingNameNumber, x, y, { align: 'right' });
    }
    else {
      pdf.text(customerData.address?.address, x, y, { align: 'right' });
    }
    y += 20;
    if (clientData?.address != null) {
      pdf.text(clientData.address?.streetName, x, y, { align: 'right' });
    }
    else {
      pdf.text(customerData.address?.streetLane, x, y, { align: 'right' });
    }
    y += 20;
    if (clientData?.address != null) {
      pdf.text(clientData.address?.landmark, x, y, { align: 'right' });
    }
    else {
      pdf.text(customerData.address?.landmark, x, y, { align: 'right' });
    }
    y += 20;
    if (clientData?.address != null) {
      pdf.text(clientData.address?.postalCode, x, y, { align: 'right' });
    }
    else {
      pdf.text(customerData.address?.postalCode, x, y, { align: 'right' });
    }
    y += 30;
    x = 20;
    pdf.setFontSize(10);
    pdf.setFont('Helvetica', 'bold');
    pdf.text('Description', x, y);
    x += 120;
    pdf.text('Net Amount $', x, y);
    x += 120;
    pdf.text('VAT Rate', x, y);
    x += 120;
    pdf.text('VAT Amount $', x, y);
    x += 120;
    pdf.text('Gross Amount $', x, y);
    x = 20;
    y += 20;
    let z = y;

    pdf.setFontSize(8);
    pdf.setFont('Helvetica', 'normal');
    const lines = data.serviceDescription;
    for (const line of lines) {
      const splitLines = pdf.splitTextToSize(line, maxWidth);
      for (const splitLine of splitLines) {
        pdf.text(splitLine, x, y);
        y += 20;
      }
    }
    x += 120
    y = z;

    pdf.text(data.netAmount.toString(), x, y);
    x += 120;
    pdf.text(data.vatRate?.toString() + '%', x, y);
    x += 120;
    pdf.text(data.vatAmount.toString(), x, y);
    x += 120;
    pdf.text(data.totalGross.toString(), x, y);
    y += 100;
    x += 70;
    pdf.text('Net Amount:    ' + data.netAmount.toString(), x, y, { align: 'right' });
    y += 20;
    pdf.text('VAT Amount:    ' + data.vatAmount.toString(), x, y, { align: 'right' });
    y += 20;
    pdf.text('Gross Amount:    ' + data.totalGross.toString(), x, y, { align: 'right' });
    y += 20;
    pdf.text('Due Date:    3-August-2023', x, y, { align: 'right' });
    y += 20;
    x = 20;
    pdf.setFontSize(10);
    pdf.setFont('Helvetica', 'bold');
    pdf.text('Bank Details:', x, y);
    y += 20;
    pdf.setFontSize(8);
    pdf.setFont('Helvetica', 'normal');
    pdf.text('Bank Name:   ' + bankData.bankName, x, y);
    x += 150;
    pdf.text('A/C Name:    ' + bankData.accountName, x, y);
    y += 20;
    x = 20;
    pdf.text('Account No.:    ' + bankData.accountNumber, x, y);
    x += 150;
    pdf.text('Sort Code:    ' + bankData.sortCode, x, y);
    y += 60;
    x = 20;
    pdf.text('Note:    ' + data.note, x, y);


    const fileName = 'Invoice.pdf';
    pdf.save(fileName);
  }

  getAccountantData(data: any, bankData: any, clientData: any, image: any) {
    this.accountantService.getAccountantInfo().subscribe(response => {
      const formData = new FormData();
      formData.append('invoiceNumber', data.invoiceNumber);
      formData.append('createdFor', clientData._id);
      formData.append('serviceDescription', data.serviceDescription);
      formData.append('date', data.date);
      formData.append('dueDate', '');
      formData.append('customerName', data.customerName);
      formData.append('netAmount', data.netAmount);
      formData.append('vatRate', data.vatRate);
      formData.append('vatAmount', data.vatAmount);
      formData.append('totalGross', data.totalGross);
      formData.append('bankAccount', data.bankAccount);
      formData.append('note', data.note);
      for (let i = 0; i < bankData.length; i++) {
        formData.append('banks[]', JSON.stringify(bankData[i]));
      }
      formData.append('customerAddress', JSON.stringify({
        street: clientData.buildingNameNumber,
        city: clientData.landmark,
        state: clientData.streetName,
        postalCode: clientData.postalCode
      }));
      formData.append('accountantAddress', JSON.stringify({
        street: response.body.buildingNameNumber,
        city: response.body.landmark,
        state: response.body.streetName,
        postalCode: response.body.postalCode
      }));
      formData.append('vatRegNo', response.body.vatNumber);
      formData.append('crn', response.body.crnNumber);
      formData.append('image', image);
      this.invoiceService.generateInvoice(formData).subscribe(res => {
        alert('Invoice generated successfully...');
      })
      this.generatePDF(data, response.body, bankData, clientData, image);
    })
  }

  getEmployeeData(data: any, bankData: any) {
    this.employeeService.employeeInfo().subscribe(response => {
      let responseBody = response.body;
      this.convertDataToUrl(response.body.logo);
      const formData = new FormData();
      formData.append('invoiceNumber', data.invoiceNumber);
      formData.append('date', data.date);
      formData.append('dueDate', '');
      formData.append('customerName', data.customerName);
      formData.append('netAmount', data.netAmount);
      formData.append('vatRate', data.vatRate);
      formData.append('vatAmount', data.vatAmount);
      formData.append('totalGross', data.totalGross);
      formData.append('bankAccount', data.bankAccount);
      formData.append('note', data.note);
      for (let i = 0; i < bankData.length; i++) {
        formData.append('banks[]', JSON.stringify(bankData[i]));
      }
      formData.append('customerAddress', JSON.stringify({
        street: response.body.buildingNameNumber,
        city: response.body.landmark,
        state: response.body.streetName,
        postalCode: response.body.postalCode
      }));
      formData.append('accountantAddress', JSON.stringify({
        street: response.body.buildingNameNumber,
        city: response.body.landmark,
        state: response.body.streetName,
        postalCode: response.body.postalCode
      }));
      formData.append('vatRegNo', response.body.vatNumber);
      formData.append('crn', response.body.crnNumber);
      formData.append('image', this.employeeLogo);
      if (this.activeMenuItem != 'generatedInvoice') {
        this.invoiceService.generateInvoice(formData).subscribe(res => {
          alert('Invoice generated successfully...');
        })
      }

      let customerData;
      this.customerService.getCustomerByID(data.createdFor).subscribe(response => {
        customerData = response.body;
        this.generatePDF(data, responseBody, bankData, null, this.employeeLogo, customerData);

      })
    })
  }

  convertDataToUrl(data: any): void {
    data.forEach((image: any) => {
      this.employeeLogo = `data:image/jpeg;base64,${image.data}`
    })

  }

}
