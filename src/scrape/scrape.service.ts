/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ScrapeService {
  /**
   * Scrapes tables from the provided URL and returns them as arrays of rows and cells.
   * @param url - The URL of the webpage to scrape.
   * @returns A promise that resolves to an array of tables, each table being an array of rows.
   */
  async scrapeTables(url: string): Promise<any[]> {
    // Fetch the HTML content from the provided URL using Axios.
    const { data } = await axios.get(url);
    // Load the HTML content into Cheerio for parsing.
    const $ = cheerio.load(data);

    // Initialize an array to store the extracted tables.
    const tables = [];

    // Iterate over each <table> element in the HTML.
    $('table').each((i, table) => {
      // Initialize an array to store rows of the current table.
      const rows = [];

      // Iterate over each <tr> (table row) element in the current table.
      $(table)
        .find('tr')
        .each((j, row) => {
          // Initialize an array to store cells of the current row.
          const cells = [];

          // Iterate over each <td> (table cell) and <th> (table header) element in the current row.
          $(row)
            .find('td, th')
            .each((k, cell) => {
              // Extract and trim the text content of the cell, and push it to the cells array.
              cells.push($(cell).text().trim());
            });
          // Push the array of cells (current row) to the rows array.
          rows.push(cells);
        });
      // Push the array of rows (current table) to the tables array.
      tables.push(rows);
    });

    // Return the array of tables.
    return tables;
  }
}
