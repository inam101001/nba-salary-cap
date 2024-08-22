
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ScrapeService } from '../scrape/scrape.service';
import { DatabaseService } from '../database/database.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly scrapeService: ScrapeService,
    private readonly databaseService: DatabaseService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /*@Cron('0 0 * * *')
  async handleCron() {
    try {
        
        // URL of the webpage to scrape.
        const url =
          "https://www.sportsbusinessclassroom.com/breaking-down-nba-141m-salary-cap-projection-2024-25/#:~:text=In%20late%20January%2C%20the%20NBA,campaign's%20%24136%20million%20salary%20cap";
  
        // Call scrapeTables method to get the tables from the URL.
        const tables = await this.scrapeService.scrapeTables(url);
        
        // Call seedTables method to save the scraped tables into the database.
        await this.databaseService.seedTables(tables);

        //await this.notificationsService.sendEmail("Successfullllllll")
        console.log("Successful");
    
        
      } catch (error) {
        // If an error occurs, send an email notification with the error message.
        await this.notificationsService.sendEmail(
          'Error scraping or seeding tables: ' + error.message,
        );
      }
  }*/
}
