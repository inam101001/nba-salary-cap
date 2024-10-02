import { Injectable } from '@nestjs/common';
import { Database } from 'arangojs';

@Injectable()
export class QueryDbService {
  private db: Database;
  private collectionName = 'QUERIES';

  constructor() {
    // Configure the ArangoDB connection directly here
    this.db = new Database({
      url: "http://localhost:8560/",
      databaseName: "scraper_db", 
      auth: { username: "inam", password: "inaminam" },
    });
  }

  // Store queries in the ArangoDB
  async storeQueries(queries: { query: string, status: boolean | null }[]): Promise<void> {
    const collection = this.db.collection(this.collectionName);

    // Create the collection if it doesn't exist
    if (!(await collection.exists())) {
      await collection.create();
    }

    // Insert all queries in a single batch
    await collection.import(queries);
  }


  // Find a specific query in the database
  async findQuery(service: string, location: string): Promise<any> {
    const collection = this.db.collection(this.collectionName);

    const cursor = await this.db.query({
      query: `
        FOR doc IN ${collection.name}
        FILTER doc.query == @query
        RETURN doc
      `,
      bindVars: { query: `${service} in ${location}` },
    });

    return cursor.all();
  }
}
