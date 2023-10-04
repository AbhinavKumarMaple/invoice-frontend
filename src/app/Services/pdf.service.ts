import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { AccountantService } from './accountant.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(private accountantService: AccountantService) { }

  generatePDF(data: any, accountantData: any) {
    const pdf = new jsPDF('p', 'pt', 'A4');

    let x = 20;
    let y = 40;
    let maxWidth = 100;

    pdf.setFontSize(16);
    pdf.text('LOGO', x, y);
    x += 550;

    pdf.setFontSize(12);
    pdf.setFont('Helvetica', 'bold');
    pdf.text(accountantData.name, x, y, { align: 'right' });
    y += 20;
    pdf.setFontSize(8);
    pdf.setFont('Helvetica', 'bold');
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
    pdf.text('invoice No:   ' + data.invoiceNumber.toString(), x, y);
    y += 20;
    const formattedDate = moment(data.date).format('D MMMM YYYY');
    pdf.text('Invoice Date:   ' + formattedDate, x, y);
    y += 20;
    pdf.text('Due Date:   3-August-2023', x, y);
    y -= 40;
    x += 550
    pdf.text(data.customerName, x, y, { align: 'right' });
    y += 20;
    pdf.text('Sam Wooldrige', x, y, { align: 'right' });
    y += 20;
    pdf.text('4 Rawmec Business Park', x, y, { align: 'right' });
    y += 20;
    pdf.text('Hoddesdon-EN11', x, y, { align: 'right' });
    y += 20;
    pdf.text('United Kingdom', x, y, { align: 'right' });
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
    const text = data.serviceDescription;
    const lines = pdf.splitTextToSize(text, maxWidth);
    for (const line of lines) {
      pdf.text(line, x, y);
      y += 10;
    }
    x += 120
    y = z;

    pdf.text(data.netAmount.toString(), x, y);
    x += 120;
    pdf.text(data.vatRate.toString() + '%', x, y);
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
    pdf.text('Bank Name:   ' + data.bankAccount.toString(), x, y);
    x += 150;
    pdf.text('A/C Name:    Finnac', x, y);
    y += 20;
    x = 20;
    pdf.text('Account No.:    00646200', x, y);
    x += 150;
    pdf.text('Sort Code:    30-94-71', x, y);

    const fileName = 'Invoice.pdf';
    pdf.save(fileName);
  }

  getAccountantData(data: any) {
    this.accountantService.getAccountantInfo().subscribe(response => {
      this.generatePDF(data, response.body);
    })
  }
}
