
export default interface DatabaseClient {

  initConnection(): void;

  executeStatement(sql: string): Promise<any[]>;

  executeStatementWithParams(sql: string, params: string[]): Promise<any[]>;

  endConnection(): void;
}
