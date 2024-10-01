import { Injectable } from '@nestjs/common';
import { QueryDbService } from './query-db.service';
import axios from 'axios';

@Injectable()
export class QueryService {
    constructor(private readonly queryDbService: QueryDbService) { }

    // Scrape CSV file and generate queries
    async processAndStoreData(): Promise<void> {
        const locations = await this.scrapeCSV();

        const services = [
            'Private Investigators',
            'Cybersecurity Experts'
        ];


        const queries = [];

        for (const location of locations) {
            for (const service of services) {
                // Initialize status to null (or set it to true/false as needed)
                queries.push({
                    query: `${service} in ${location.replace(/"/g, '')}`,
                    status: null
                });
            }
        }

        // Store the queries in the database
        await this.queryDbService.storeQueries(queries);
    }



    // Scrape the CSV file from Google Sheets
    async scrapeCSV(): Promise<string[]> {
        const url = 'https://docs.google.com/spreadsheets/d/1Ym7CiRhAG0gQmXU89wk51WIGb_n04K5I3-fxvlihB2g/export?format=csv';

        try {
            // Fetch CSV data directly using Axios
            const response = await axios.get(url);
            const csvData = response.data;

            // Manually process the CSV file
            const lines = csvData.split('\n').map(line => line.trim());

            // Remove the header ('Location') and return the rest
            return lines.slice(1);
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
