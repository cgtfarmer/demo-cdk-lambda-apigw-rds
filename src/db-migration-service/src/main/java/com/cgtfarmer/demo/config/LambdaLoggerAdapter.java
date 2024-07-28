package com.cgtfarmer.demo.config;

import com.amazonaws.services.lambda.runtime.LambdaLogger;
import java.util.logging.Level;
import liquibase.logging.core.AbstractLogger;

public class LambdaLoggerAdapter extends AbstractLogger {

  private final LambdaLogger lambdaLogger;

  public LambdaLoggerAdapter(LambdaLogger lambdaLogger) {
    this.lambdaLogger = lambdaLogger;
  }

  @Override
  public void log(Level level, String message, Throwable e) {
    this.lambdaLogger.log(
      String.format("[%s] %s %s", level.getName(), message, e.getMessage())
    );
  }
}
