import { Injectable } from '@nestjs/common';
import { Database, aql } from 'arangojs';

@Injectable()
export class DatabaseService {
  private db: Database;

  constructor() {
    this.db = new Database({
      url: 'http://localhost:8560',
      databaseName: 'nba_db',
      auth: { username: 'inam', password: 'inaminam' },
    });
  }

  /**
   * Seeds the provided tables into the ArangoDB database.
   * @param tables - An array of tables, where each table is an array of rows with headers as keys.
   */
  async seedTables(tables: any[]): Promise<string> {
    for (const table of tables) {
      const collectionName = `table_${tables.indexOf(table)}`;
      const collection = this.db.collection(collectionName);

      if (!(await collection.exists())) {
        await collection.create();
      }

      for (const row of table) {
        // Assuming the first column is the unique identifier
        const uniqueIdentifier = Object.values(row)[0];

        // Use an AQL query to check if a document with the same unique identifier already exists in the collection.
        const cursor = await this.db.query(aql`
          FOR doc IN ${collection}
          FILTER doc.data.${Object.keys(row)[0]} == ${uniqueIdentifier}
          RETURN doc
        `);

        const existingDocs = await cursor.all();

        if (existingDocs.length > 0) {
          const existingDoc = existingDocs[0];

          // Update the existing document with the new data.
          await collection.update(existingDoc._key, { data: row });
        } else {
          // If no matching document is found, insert the new document.
          await collection.save({ data: row });
        }
      }
    }

    return 'Seeding process completed successfully.';
  }
}
