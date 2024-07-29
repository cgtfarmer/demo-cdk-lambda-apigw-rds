import DatabaseClient from './database-client';
import UserEntity from '../entity/user-entity';

export default class UserRepository {

  private readonly dbClient: DatabaseClient;

  constructor(dbClient: DatabaseClient) {
    this.dbClient = dbClient;

    this.dbClient.initConnection();
  }

  public async findAll() {
    console.log(`[UserRepository#findAll]`);

    let sql = `
      SELECT *
      FROM users
    `;

    const results: UserEntity[] = await this.dbClient.executeStatement(sql);

    return results;
  }

  public async findById(id: number) {
    console.log(`[UserRepository#findById] ${id}`);

    const sql = `
      SELECT *
      FROM users
      WHERE id = $1
    `;

    const values = [String(id)];

    const results: UserEntity[] = await this.dbClient.executeStatementWithParams(sql, values);

    return results[0];
  }

  public async create(user: UserEntity) {
    console.log(`[UserRepository#create] ${JSON.stringify(user)}`);

    const sql = `
      INSERT INTO users (first_name, last_name, age, weight, smoker)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;

    const values = [
      user.first_name,
      user.last_name,
      String(user.age),
      String(user.weight),
      String(user.smoker),
    ];

    const results: UserEntity[] = await this.dbClient.executeStatementWithParams(sql, values);

    user.id = results[0].id;

    return user;
  }

  public async update(user: UserEntity) {
    console.log(`[UserRepository#update] ${JSON.stringify(user)}`);

    const sql = `
      UPDATE users
      SET first_name = $1,
          last_name = $2,
          age = $3,
          weight = $4,
          smoker = $5
      WHERE id = $6
    `;

    const values = [
      user.first_name,
      user.last_name,
      String(user.age),
      String(user.weight),
      String(user.smoker),
      String(user.id)
    ];

    await this.dbClient.executeStatementWithParams(sql, values);

    return user;
  }

  public async destroy(id: number) {
    console.log(`[UserRepository#destroy] ${id}`);

    const sql = `
      DELETE FROM users
      WHERE id = $1
    `;

    const values = [String(id)];

    await this.dbClient.executeStatementWithParams(sql, values);
  }
}
