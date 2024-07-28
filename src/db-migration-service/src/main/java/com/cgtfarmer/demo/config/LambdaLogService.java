package com.cgtfarmer.demo.config;

import liquibase.logging.Logger;
import liquibase.logging.core.AbstractLogService;
import com.amazonaws.services.lambda.runtime.LambdaLogger;

public class LambdaLogService extends AbstractLogService {

  private final LambdaLogger lambdaLogger;

  public LambdaLogService(LambdaLogger lambdaLogger) {
    this.lambdaLogger = lambdaLogger;
  }

  @Override
  public int getPriority() {
    return PRIORITY_DATABASE;
  }

  @Override
  public Logger getLog(Class clazz) {
    return new LambdaLoggerAdapter(lambdaLogger);
  }
}
