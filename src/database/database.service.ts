
import { Injectable } from '@nestjs/common';
import { Database , aql} from 'arangojs';

@Injectable()
export class DatabaseService {
  private db: Database;

  constructor() {
    // Initialize the ArangoDB database connection with the given URL, database name, and authentication credentials.
    this.db = new Database({
      url: 'http://localhost:8560', // URL of the ArangoDB server.
      databaseName: 'nba_db', // Name of the database to connect to.
      auth: { username: 'inam', password: 'inaminam' }, // Authentication credentials for ArangoDB.
    });
  }

  /**
   * Seeds the provided tables into the ArangoDB database.
   * @param tables - An array of tables, where each table is an array of rows.
   */
  async seedTables(tables: any[]): Promise<string> {
    // Iterate over each table in the provided tables array.
    for (const table of tables) {
      const collectionName = `table_${tables.indexOf(table)}`;
      const collection = this.db.collection(collectionName);

      // Check if the collection exists. If it does not, create it.
      if (!(await collection.exists())) {
        await collection.create();
      }

      // Iterate over each row in the current table.
      for (const row of table) {
        const document = { data: row };

        // Use an AQL query to check if a document with the same data already exists in the collection.
        const cursor = await this.db.query(aql`
          FOR doc IN ${collection}
          FILTER doc.data == ${row}
          RETURN doc
        `);

        const existingDocs = await cursor.all();

        if (existingDocs.length > 0) {
          const existingDoc = existingDocs[0];

          // Check if the existing data is different from the new data.
          if (JSON.stringify(existingDoc.data) !== JSON.stringify(row)) {
            // Update the existing document with the new data.
            await collection.update(existingDoc._key, { data: row });
          }
        } else {
          // If no matching document is found, insert the new document.
          await collection.save(document);
        }
      }
    }

    // Return a success message when the operation is complete.
    return 'Seeding process completed successfully.';
  }
}
