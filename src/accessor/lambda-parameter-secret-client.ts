
export default class LambdaParameterSecretClient {

  private static tokenHeaderKey = 'X-Aws-Parameters-Secrets-Token';

  private static secretAccessUrl = 'localhost:2773/secretsmanager/get';

  public static createWithEnvVars() {
    const awsSessionToken = process.env.AWS_SESSION_TOKEN;

    if (!awsSessionToken) throw new Error('Port is undefined');

    return new this(awsSessionToken);
  }

  public readonly headers: Headers;

  constructor(awsSessionToken: string) {
    this.headers = new Headers();

    this.headers.append(LambdaParameterSecretClient.tokenHeaderKey, awsSessionToken);
  }

  public async getSecret(secretId: string) {
    const url = `${LambdaParameterSecretClient.secretAccessUrl}?secretId=${secretId}`;

    const results = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    });

    const body = results.json();

    return body;
  }
}
