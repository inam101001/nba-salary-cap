import { Injectable } from '@nestjs/common';
import { Database, aql } from 'arangojs';

@Injectable()
export class NflDbService {
  private db: Database;

  constructor() {
    this.db = new Database({
      url: 'http://localhost:8560',
      databaseName: 'nba_db',
      auth: { username: 'inam', password: 'inaminam' },
    });
  }

  /**
   * Seeds the provided table data into a specific collection in ArangoDB.
   * @param tableData - An array of objects where each object represents a row with headers as keys.
   * @param collectionName - The name of the collection to store the data in.
   */
  async seedTableData(tableData: any[], collectionName: string): Promise<string> {
    const collection = this.db.collection(collectionName);

    if (!(await collection.exists())) {
      await collection.create();
    }

    for (const row of tableData) {
      const playerName = row["Player"]; // Use the "Player" field as the unique identifier/key

      if (!playerName) continue; // Skip rows without a player name

      const document = { data: row };

      const cursor = await this.db.query(aql`
        FOR doc IN ${collection}
        FILTER doc.data.Player == ${playerName}
        RETURN doc
      `);

      const existingDocs = await cursor.all();

      if (existingDocs.length > 0) {
        const existingDoc = existingDocs[0];

        // Update the existing document only if the data has changed
        if (JSON.stringify(existingDoc.data) !== JSON.stringify(row)) {
          await collection.update(existingDoc._key, { data: row });
        }
      } else {
        // If no matching document is found, insert the new document
        await collection.save(document);
      }
    }

    return 'Seeding process completed successfully.';
  }
}
