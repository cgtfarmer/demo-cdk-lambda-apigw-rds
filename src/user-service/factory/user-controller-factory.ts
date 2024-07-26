import { Client, ClientConfig } from 'pg';
import PostgresClient from '../accessor/postgres-client';
import UserMapper from '../mapper/user-mapper';
import UserRepository from '../repository/user-repository';
import DatabaseConfigProvider from '../accessor/database-config-provider';
import LambdaParameterSecretClient from '../accessor/lambda-parameter-secret-client';
import EnvironmentAccessor from '../accessor/environment-accessor';
import UserController from '../controller/user-controller';

export default class UserControllerFactory {

  constructor() {}

  public async create() {
    const environmentAccessor = new EnvironmentAccessor();

    const awsSessionToken = environmentAccessor.get('AWS_SESSION_TOKEN');

    const lambdaParameterSecretClient = new LambdaParameterSecretClient(awsSessionToken);

    const dbConfigProvider = new DatabaseConfigProvider(environmentAccessor, lambdaParameterSecretClient);

    const dbConfig = await dbConfigProvider.create();

    const dbClient = new Client(dbConfig);

    const postgresClient = new PostgresClient(dbClient);

    const userMapper = new UserMapper();

    const userRepository = new UserRepository(postgresClient, userMapper);

    return new UserController(userRepository);
  }
}
