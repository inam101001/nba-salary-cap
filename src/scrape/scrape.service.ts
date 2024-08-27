import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ScrapeService {
  /**
   * Scrapes tables from the provided URL and returns them as arrays of rows and cells.
   * @param url - The URL of the webpage to scrape.
   * @returns A promise that resolves to an array of tables, each table being an array of rows.
   */
  async scrapeTables(url: string): Promise<any[]> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    const tables = await page.evaluate(() => {
      const tables: any[] = [];

      document.querySelectorAll('table').forEach((table: HTMLTableElement) => {
        const headers: string[] = [];
        const rows: any[] = [];

        // Capture headers from the first row (assuming it's the header row).
        table.querySelectorAll('tr th').forEach((header: HTMLTableCellElement) => {
          headers.push(header.textContent?.trim() || '');
        });

        // If no <th> elements, fall back to using the first row as headers.
        if (headers.length === 0) {
          table.querySelectorAll('tr:first-child td').forEach((header: HTMLTableCellElement) => {
            headers.push(header.textContent?.trim() || '');
          });
        }

        // Capture each row's data and map it to the headers.
        table.querySelectorAll('tr').forEach((row: HTMLTableRowElement, rowIndex: number) => {
          // Skip the header row
          if (rowIndex === 0) return;

          const rowData: any = {};
          row.querySelectorAll('td').forEach((cell: HTMLTableCellElement, cellIndex: number) => {
            const header = headers[cellIndex] || `Column${cellIndex + 1}`;
            rowData[header] = cell.textContent?.trim() || '';
          });

          rows.push(rowData);
        });

        tables.push(rows);
      });

      return tables;
    });

    await browser.close();

    return tables;
  }
}
