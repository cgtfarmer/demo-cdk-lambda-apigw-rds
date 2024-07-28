// Runtime: Java 17
package com.cgtfarmer.demo;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.CloudFormationCustomResourceEvent;
import com.cgtfarmer.demo.config.DependencyGraph;
import com.cgtfarmer.demo.config.DependencyGraphFactory;
import com.cgtfarmer.demo.config.LiquibaseConfiguration;
import com.cgtfarmer.demo.dto.AsyncLambdaResponse;
import com.cgtfarmer.demo.exception.ExceptionUtils;
import com.cgtfarmer.demo.factory.LiquibaseCliCommandFactory;
import liquibase.integration.commandline.LiquibaseCommandLine;

/**
 * Lambda Handler.
 *
 * Note: RequestHandler<X, Y>
 *   X = event type
 *   Y = return type
 */
public class Handler implements RequestHandler<CloudFormationCustomResourceEvent, AsyncLambdaResponse> {

  @Override
  public AsyncLambdaResponse handleRequest(
      CloudFormationCustomResourceEvent event,
      Context context
  ) {
    LambdaLogger logger = context.getLogger();

    logger.log("Hello, world!");

    int returnCode = 0;
    try {
      DependencyGraph graph = new DependencyGraphFactory().create(logger);

      logger.log("--- Liquibase Config:");
      logger.log(graph.getLiquibaseConfiguration().toString());

      // Liquibase liquibaseClient = graph.getLiquibaseClient();

      LiquibaseConfiguration liquibaseConfiguration = graph.getLiquibaseConfiguration();

      String[] command = new LiquibaseCliCommandFactory(liquibaseConfiguration).update();

      Class.forName("org.postgresql.Driver");

      LiquibaseCommandLine cli = new LiquibaseCommandLine();
      returnCode = cli.execute(command);

      logger.log("Return Code: " + returnCode);

      // Class.forName("org.postgresql.Driver");

      // Scope.child(Scope.Attr.logService.name(), new LambdaLogService(logger), () -> {
      //   Connection conn = DriverManager.getConnection(
      //       liquibaseConfiguration.getUrl(),
      //       liquibaseConfiguration.getUsername(),
      //       liquibaseConfiguration.getPassword()
      //   );

      //   Liquibase liquibaseClient = new Liquibase(
      //       liquibaseConfiguration.getChangelogFilepath(),
      //       new ClassLoaderResourceAccessor(),
      //       new JdbcConnection(conn)
      //   );

      //   liquibaseClient.update(new Contexts(), new LabelExpression());

      //   liquibaseClient.close();
      // });
    } catch (Exception e) {
      logger.log("DB migration failed: " + ExceptionUtils.mapStackTraceToString(e));

      AsyncLambdaResponse response = AsyncLambdaResponse.builder()
          .Status("FAILED")
          .Reason(e.getMessage())
          .build();

      logger.log(response.toString());

      return response;
    }

    if (returnCode != 0) {
      AsyncLambdaResponse response = AsyncLambdaResponse.builder()
          .Status("FAILED")
          .Reason("Return code reported a failure: " + returnCode)
          .build();

      logger.log(response.toString());

      return response;
    }

    AsyncLambdaResponse response = AsyncLambdaResponse.builder()
        .Status("SUCCESS")
        .build();

    logger.log(response.toString());

    return response;
  }
}
