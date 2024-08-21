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
    // Launch a new instance of Puppeteer browser.
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the provided URL.
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Extract the tables from the page.
    const tables = await page.evaluate(() => {
      const tables: any[] = [];
      document.querySelectorAll('table').forEach((table: HTMLTableElement) => {
        const rows: any[] = [];
        table.querySelectorAll('tr').forEach((row: HTMLTableRowElement) => {
          const cells: any[] = [];
          row.querySelectorAll('td, th').forEach((cell: HTMLTableCellElement) => {
            cells.push(cell.textContent?.trim() || '');
          });
          rows.push(cells);
        });
        tables.push(rows);
      });
      return tables;
    });

    // Close the Puppeteer browser.
    await browser.close();

    return tables;
  }
}
