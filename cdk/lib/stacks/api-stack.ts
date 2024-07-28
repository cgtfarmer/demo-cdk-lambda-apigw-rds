import { join } from 'path';
import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ParamsAndSecretsLayerVersion, ParamsAndSecretsLogLevel, ParamsAndSecretsVersions, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { CorsHttpMethod, HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Port, Vpc } from 'aws-cdk-lib/aws-ec2';
import { DatabaseProxy } from 'aws-cdk-lib/aws-rds';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';

interface ApiStackProps extends StackProps {
  vpc: Vpc;

  rdsProxy: DatabaseProxy;

  rdsSecret: ISecret;

  rdsPort: string;

  rdsDbName: string;
}

export class ApiStack extends Stack {

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const paramsAndSecrets = ParamsAndSecretsLayerVersion.fromVersion(
      ParamsAndSecretsVersions.V1_0_103,
      {
        cacheSize: 500,
        logLevel: ParamsAndSecretsLogLevel.DEBUG,
      }
    );

    const demoLambda = new NodejsFunction(this, 'DemoLambda', {
      vpc: props.vpc,
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      entry: join(__dirname, '../../../src/user-service/index.ts'),
      bundling: {
        nodeModules: ['@types/aws-lambda'],
      },
      environment: {
        DB_HOSTNAME: props.rdsProxy.endpoint,
        DB_PORT: props.rdsPort,
        // UNSAFE:
        // RDS_USERNAME: props.rdsSecret.secretValueFromJson('username').toString(),
        // RDS_PASSWORD: props.rdsSecret.secretValueFromJson('password').toString(),
        DB_CREDS_SECRET_ID: props.rdsSecret.secretName,
        DB_DATABASE_NAME: props.rdsDbName,
      },
      memorySize: 256,
      timeout: Duration.seconds(20),
      paramsAndSecrets: paramsAndSecrets,
    });

    props.rdsSecret.grantRead(demoLambda);
    props.rdsProxy.grantConnect(demoLambda);
    // This direction is incorrect due to causing cyclic dependencies
    // props.rdsProxy.connections.allowFrom(demoLambda, Port.POSTGRES);
    demoLambda.connections.allowTo(props.rdsProxy, Port.POSTGRES);

    const demoLambdaIntegration =
      new HttpLambdaIntegration('DemoLambdaIntegration', demoLambda);

    const httpApi = new HttpApi(this, 'HttpApi', {
      createDefaultStage: false,
      corsPreflight: {
        allowHeaders: ['Authorization'],
        allowMethods: [CorsHttpMethod.ANY],
        allowOrigins: ['*'],
        maxAge: Duration.days(10),
      },
    });

    httpApi.addStage('DefaultStage', {
      stageName: '$default',
      autoDeploy: true,
      throttle: {
        burstLimit: 2,
        rateLimit: 1,
      }
    });

    httpApi.addRoutes({
      path: '/users',
      methods: [HttpMethod.GET, HttpMethod.POST],
      integration: demoLambdaIntegration,
    });

    httpApi.addRoutes({
      path: '/users/{id}',
      methods: [HttpMethod.GET, HttpMethod.PUT, HttpMethod.DELETE],
      integration: demoLambdaIntegration,
    });
  }
}
