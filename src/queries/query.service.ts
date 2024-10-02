import { Injectable } from '@nestjs/common';
import { QueryDbService } from './query-db.service';
import axios from 'axios';

@Injectable()
export class QueryService {
    constructor(private readonly queryDbService: QueryDbService) { }

    // Scrape CSV file and generate queries
    async processAndStoreData(): Promise<void> {
        const locations = await this.scrapeCSV(); // Assuming this method now returns an array of objects

        const services = [
            'Plumbers'
        ];

        const queries = [];

        for (const { city, country } of locations) {
            for (const service of services) {
                // Construct the query string and status
                queries.push({
                    query: `${service} in ${city}, ${country}`,
                    city: city,
                    country: country,
                    status: null
                });
            }
        }

        // Store the queries in the database
        await this.queryDbService.storeQueries(queries);
    }




    // Scrape the CSV file from Google Sheets
    // Scrape the CSV file from Google Sheets
    async scrapeCSV(): Promise<{ city: string; country: string }[]> {
        const url = 'https://docs.google.com/spreadsheets/d/1Ym7CiRhAG0gQmXU89wk51WIGb_n04K5I3-fxvlihB2g/export?format=csv';

        try {
            const response = await axios.get(url);
            const csvData = response.data;

            // Manually process the CSV file
            const lines = csvData.split('\n').map(line => line.trim());

            // Remove the header and create an array of objects
            const locations = lines.slice(1).map(line => {
                const [city, country] = line.split(',').map(item => item.trim());
                return { city, country };
            });

            return locations;
        } catch (error) {
            console.error('Error fetching CSV data:', error);
            throw new Error('Failed to fetch CSV data');
        }
    }



    // Public method to query a service in a specific location
    async findServiceInLocation(service: string, location: string): Promise<any> {
        return await this.queryDbService.findQuery(service, location);
    }
}
