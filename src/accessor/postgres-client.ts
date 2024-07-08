import { Client } from 'pg';
import DatabaseClient from '../repository/database-client';

export default class PostgresClient implements DatabaseClient {

  private readonly dbConnection: Client;

  constructor(dbConnection: Client) {
    this.dbConnection = dbConnection;
  }

  public async initConnection() {
    console.log('[DatabaseConnection#getConnection] Initializing...');

    await this.dbConnection.connect();

    console.log('[DatabaseConnection#getConnection] Initialized');

    return this.dbConnection;
  }

  public async executeStatement(sql: string) {
    console.log(`[DbClient#executeStatement] SQL: ${sql}`);

    const results = await this.dbConnection.query(sql);

    return results.rows;
  }

  public async executeStatementWithParams(sql: string, values: string[]) {
    console.log(`[DbClient#executeStatement] SQL: ${sql}, VALUES: ${values}`);

    const results = await this.dbConnection.query(sql, values);

    return results.rows;
  }

  public async endConnection() {
    await this.dbConnection.end()
  }
}
