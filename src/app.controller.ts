/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { ScrapeService } from './scrape/scrape.service';
import { DatabaseService } from './database/database.service';
import { NotificationsService } from './notifications/notifications.service';

@Controller()
export class AppController {
  constructor(
    private readonly scrapeService: ScrapeService, // Injects ScrapeService to handle web scraping.
    private readonly databaseService: DatabaseService, // Injects DatabaseService to handle database operations.
    private readonly notificationsService: NotificationsService, // Injects NotificationsService to send notifications.
  ) {}

  /**
   * Endpoint to trigger the web scraping and database seeding process.
   * @returns A response indicating the result of the scraping and seeding process.
   */
  @Get('scrape-and-seed')
  async scrapeAndSeed() {
    try {
      // URL of the webpage to scrape.
      const url =
        "https://www.sportsbusinessclassroom.com/breaking-down-nba-141m-salary-cap-projection-2024-25/#:~:text=In%20late%20January%2C%20the%20NBA,campaign's%20%24136%20million%20salary%20cap";

      // Call scrapeTables method to get the tables from the URL.
      const tables = await this.scrapeService.scrapeTables(url);
      
      // Call seedTables method to save the scraped tables into the database.
      await this.databaseService.seedTables(tables);

      return { message: 'Scraping and seeding process completed successfully.' };
      
    } catch (error) {
      // If an error occurs, send an email notification with the error message.
      await this.notificationsService.sendEmail(
        'Error scraping or seeding tables: ' + error.message,
      );
    }
  }
}
