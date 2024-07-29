import { Client } from 'pg';
import PostgresClient from '../accessor/postgres-client';
import UserRepository from '../repository/user-repository';
import DatabaseConfigFactory from '../factory/database-config-factory';
import LambdaParameterSecretClient from '../accessor/lambda-parameter-secret-client';
import EnvironmentAccessor from '../accessor/environment-accessor';
import UserController from '../controller/user-controller';
import UserMapper from '../mapper/user-mapper';
import UserService from '../service/user-service';

export default class DependencyGraph {

  private static singleton: DependencyGraph;

  public static async getInstance() {
    if (DependencyGraph.singleton) return DependencyGraph.singleton;

    const environmentAccessor = new EnvironmentAccessor();

    const awsSessionToken = environmentAccessor.get('AWS_SESSION_TOKEN');

    const lambdaParameterSecretClient = new LambdaParameterSecretClient(awsSessionToken);

    const dbConfigProvider = new DatabaseConfigFactory(
      environmentAccessor,
      lambdaParameterSecretClient
    );

    const dbConfig = await dbConfigProvider.create();

    const dbClient = new Client(dbConfig);

    const postgresClient = new PostgresClient(dbClient);

    const userRepository = new UserRepository(postgresClient);

    const userMapper = new UserMapper();

    const userService = new UserService(userRepository, userMapper);

    const userController = new UserController(userService);

    DependencyGraph.singleton = new DependencyGraph(userController);

    return DependencyGraph.singleton;
  }

  constructor(public readonly userController: UserController) {
  }
}
