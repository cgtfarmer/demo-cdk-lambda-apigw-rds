import { ClientConfig } from "pg";
import EnvironmentAccessor from "./environment-accessor";
import LambdaParameterSecretClient from "./lambda-parameter-secret-client";

export default class DatabaseConfigProvider {

  private readonly environmentAccessor: EnvironmentAccessor;

  private readonly lambdaParameterSecretClient: LambdaParameterSecretClient;

  constructor(
    environmentAccessor: EnvironmentAccessor,
    lambdaParameterSecretClient: LambdaParameterSecretClient
  ) {
    this.environmentAccessor = environmentAccessor;

    this.lambdaParameterSecretClient = lambdaParameterSecretClient;
  }

  public async create() {
    const dbCredsSecretId = this.environmentAccessor.get('DB_CREDS_SECRET_ID');

    const secret = await this.lambdaParameterSecretClient.getSecret(dbCredsSecretId);

    const dbConfig: ClientConfig = {
      host: this.environmentAccessor.get('DB_HOSTNAME'),
      user: secret.username,
      password: secret.password,
      port: Number.parseInt(this.environmentAccessor.get('DB_PORT')),
      database: this.environmentAccessor.get('DB_DATABASE_NAME'),
    };

    return dbConfig;
  }
}
