import { Controller, Post } from '@nestjs/common';
import { NflService } from './nfl.service';
import { NflDbService } from './nfl-db.service';

@Controller('nfl-players')
export class NflController {
  private readonly url: string = 'https://www.spotrac.com/nfl/draft/contracts/_/year/2024'; // Replace with the actual URL
  private readonly collectionName: string = 'nfl_players_data'; // Replace with the actual collection name

  constructor(
    private readonly nflService: NflService,
    private readonly nflDbService: NflDbService,
  ) {}

  /**
   * Endpoint to scrape tables from a predefined URL and seed data into a predefined collection.
   * @returns A response indicating the result of the scraping and seeding process.
   */
  @Post('scrape-and-seed')
  async scrapeAndSeed() {
    try {
      // Scrape tables from the predefined URL.
      const tables = await this.nflService.scrapeTables(this.url);

      // Seed the scraped tables into the predefined collection.
      const result = await this.nflDbService.seedTableData(tables[0], this.collectionName); // Assuming first table for simplicity.

      return { message: result };
    } catch (error) {
      return { message: 'Error during scraping and seeding process: ' + error.message };
    }
  }
}
