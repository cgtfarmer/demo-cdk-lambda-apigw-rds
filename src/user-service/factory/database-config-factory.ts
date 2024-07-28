import { ClientConfig } from 'pg';
import EnvironmentAccessor from '../accessor/environment-accessor';
import LambdaParameterSecretClient from '../accessor/lambda-parameter-secret-client';
import DbSecret from '../dto/DbSecret';

export default class DatabaseConfigFactory {

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

    const secretsManagerResponse = await this.lambdaParameterSecretClient.getSecret(dbCredsSecretId);

    const secret: DbSecret = JSON.parse(secretsManagerResponse.SecretString);

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
