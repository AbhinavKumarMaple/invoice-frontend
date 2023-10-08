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

  constructor(private accountantService: AccountantService, private employeeService: EmployeeService, private invoiceService: InvoiceService) { }

  generatePDF(data: any, accountantData: any, bankData: any, clientData?: any) {
    console.log(data)
    const pdf = new jsPDF('p', 'pt', 'A4');

    let x = 20;
    let y = 40;
    let maxWidth = 100;

    pdf.setFontSize(16);
    pdf.text('LOGO', x, y);
    x += 550;

    pdf.setFontSize(12);
    pdf.setFont('Helvetica', 'bold');
    pdf.text(accountantData.businessName, x, y, { align: 'right' });
    y += 20;
    pdf.setFontSize(8);
    pdf.setFont('Helvetica', 'bold');
    pdf.text(accountantData.name, x, y, { align: 'right' });
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
    pdf.text(clientData.businessName, x, y, { align: 'right' });
    y += 20;
    pdf.setFontSize(8);
    pdf.setFont('Helvetica', 'normal');
    pdf.text(clientData.address?.buildingNameNumber, x, y, { align: 'right' });
    y += 20;
    pdf.text(clientData.address?.streetName, x, y, { align: 'right' });
    y += 20;
    pdf.text(clientData.address?.landmark, x, y, { align: 'right' });
    y += 20;
    pdf.text(clientData.address?.postalCode, x, y, { align: 'right' });
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

  getAccountantData(data: any, bankData: any, clientData: any) {
    this.accountantService.getAccountantInfo().subscribe(response => {
      console.log(data)
      console.log(bankData)
      console.log(clientData)
      console.log(response.body)
      let generatedData = {
        invoiceNumber: data.invoiceNumber,
        date: data.date,
        dueDate: '',
        customerName: data.customerName,
        netAmount: data.netAmount,
        vatRate: data.vatRate,
        vatAmount: data.vatAmount,
        totalGross: data.totalGross,
        bankAccount: data.bankAccount,
        note: data.note,
        banks: [bankData],
        customerAddress: {
          street: clientData.buildingNameNumber,
          city: clientData.landmark,
          state: clientData.streetName,
          postalCode: clientData.postalCode
        },
        accountantAddress: {
          street: response.body.buildingNameNumber,
          city: response.body.landmark,
          state: response.body.streetName,
          postalCode: response.body.postalCode
        },
        vatRegNo: response.body.vatNumber,
        crn: response.body.crnNumber
      }
      this.invoiceService.generateInvoice(generatedData).subscribe(res => {
        alert('Invoice generated successfully...');
      })
      this.generatePDF(data, response.body, bankData, clientData);
    })
  }

  getEmployeeData(data: any, bankData: any) {
    this.employeeService.employeeInfo().subscribe(response => {
      console.log(response.body);
      this.generatePDF(data, response.body, bankData);
    })
  }

}
