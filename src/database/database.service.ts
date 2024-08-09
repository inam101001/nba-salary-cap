
import { Injectable } from '@nestjs/common';
import { Database } from 'arangojs';

@Injectable()
export class DatabaseService {
  private db: Database;

  constructor() {
    // Initialize the ArangoDB database connection with the given URL, database name, and authentication credentials.
    this.db = new Database({
      url: 'http://localhost:8560', // URL of the ArangoDB server.
      databaseName: '_system', // Name of the database to connect to.
      auth: { username: 'root', password: 'Ie2jHVy3pz8WLg2J' }, // Authentication credentials for ArangoDB.
    });
  }

  /**
   * Seeds the provided tables into the ArangoDB database.
   * @param tables - An array of tables, where each table is an array of rows.
   */
  async seedTables(tables: any[]): Promise<void> {
    // Iterate over each table in the provided tables array.
    for (const table of tables) {
      // Create a unique collection name based on the index of the table in the array.
      const collectionName = `table_${tables.indexOf(table)}`;
      // Get the collection object from the database.
      const collection = this.db.collection(collectionName);

      // Check if the collection exists. If it does not, create it.
      if (!(await collection.exists())) {
        await collection.create();
      }

      // Iterate over each row in the current table.
      for (const row of table) {
        // Create a document object with the row data.
        const document = { data: row };
        // Save the document into the collection.
        await collection.save(document);
      }
    }
  }
}
