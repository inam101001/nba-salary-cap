import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class NflService {
  /**
   * Scrapes tables from the provided URL and returns them as arrays of objects where headers are keys.
   * @param url - The URL of the webpage to scrape.
   * @returns A promise that resolves to an array of tables, each table being an array of objects.
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

        table.querySelectorAll('thead th').forEach((header: HTMLTableHeaderCellElement) => {
          headers.push(header.textContent?.trim() || '');
        });

        table.querySelectorAll('tbody tr').forEach((row: HTMLTableRowElement) => {
          const rowData: any = {};
          row.querySelectorAll('td').forEach((cell: HTMLTableCellElement, index: number) => {
            if (headers[index]) {
              rowData[headers[index]] = cell.textContent?.trim() || '';
            }
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
