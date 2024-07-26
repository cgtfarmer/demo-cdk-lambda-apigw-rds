import DatabaseClient from './database-client';
import User from '../model/user';
import UserMapper from '../mapper/user-mapper';

export default class UserRepository {

  private readonly dbClient: DatabaseClient;

  private readonly userMapper: UserMapper;

  constructor(dbClient: DatabaseClient, userMapper: UserMapper) {
    this.dbClient = dbClient;

    this.userMapper = userMapper;
  }

  public async findAll() {
    console.log(`[UserRepository#findAll]`);

    let sql = `
      SELECT *
      FROM users
    `;

    await this.dbClient.initConnection();

    const results = await this.dbClient.executeStatement(sql);

    await this.dbClient.endConnection();

    const users = results.map(e => this.userMapper.fromAny(e));

    return users;
  }

  public async findById(id: number) {
    console.log(`[UserRepository#findById] ${id}`);

    const sql = `
      SELECT *
      FROM users
      WHERE id = $1
    `;

    const values = [String(id)];

    await this.dbClient.initConnection();

    const results = await this.dbClient.executeStatementWithParams(sql, values);

    await this.dbClient.endConnection();

    const users = results.map(e => this.userMapper.fromAny(e));

    return users[0];
  }

  public async create(user: User) {
    console.log(`[UserRepository#create] ${user}`);

    const sql = `
      INSERT INTO users (firstName, lastName, age, weight, smoker)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;

    const values = [
      user.firstName,
      user.lastName,
      String(user.age),
      String(user.weight),
      String(user.smoker),
    ];

    await this.dbClient.initConnection();

    const results = await this.dbClient.executeStatementWithParams(sql, values);

    await this.dbClient.endConnection();

    user.id = results[0].id;

    return user;
  }

  public async update(user: User) {
    console.log(`[UserRepository#update] ${user}`);

    const sql = `
      UPDATE users
      SET firstName = $1,
          lastName = $2,
          age = $3,
          weight = $4,
          smoker = $5,
      WHERE id = $6
    `;

    const values = [
      user.firstName,
      user.lastName,
      String(user.age),
      String(user.weight),
      String(user.smoker),
      String(user.id)
    ];

    await this.dbClient.initConnection();

    await this.dbClient.executeStatementWithParams(sql, values);

    await this.dbClient.endConnection();

    return user;
  }

  public async destroy(id: number) {
    console.log(`[UserRepository#destroy] ${id}`);

    const sql = `
      DELETE FROM users
      WHERE id = ?
    `;

    const values = [String(id)];

    await this.dbClient.initConnection();

    await this.dbClient.executeStatementWithParams(sql, values);

    await this.dbClient.endConnection();
  }
}
