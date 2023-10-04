import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CsvServiceService {

  constructor() { }

  convertToCSV(data: any[], columns: string[]): string {
    const csvContent = columns.join(',') + '\n' + data.map(row => {
      return columns.map(key => {
        if (Array.isArray(row[key])) {
          return row[key].map((item: any) => item.name).join('; ');
        } else {
          return row[key];
        }
      }).join(',');
    }).join('\n');

    return csvContent;
  }
}
