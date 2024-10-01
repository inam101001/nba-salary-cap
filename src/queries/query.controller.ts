import { Controller, Get, Query, Post } from '@nestjs/common';
import { QueryService } from './query.service';

@Controller('queries')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  // Endpoint to scrape data and store it in the database
  @Post('/scrape')
  async scrapeAndStore(): Promise<string> {
    await this.queryService.processAndStoreData();
    return 'Data scraped and stored successfully.';
  }

  // Endpoint to search for a service in a specific location
  @Get('/find')
  async find(
    @Query('service') service: string,
    @Query('location') location: string,
  ): Promise<any> {
    const result = await this.queryService.findServiceInLocation(service, location);
    if (result.length === 0) {
      return `No results found for ${service} in ${location}.`;
    }
    return result;
  }
}
