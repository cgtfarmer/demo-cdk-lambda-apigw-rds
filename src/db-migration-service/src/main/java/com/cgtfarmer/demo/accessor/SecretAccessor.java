package com.cgtfarmer.demo.accessor;

import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.cgtfarmer.demo.dto.DbSecret;
import com.cgtfarmer.demo.dto.SecretsManagerResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;

public class SecretAccessor {

  private final LambdaLogger logger;

  private final ObjectMapper mapper;

  private final LambdaParameterSecretClient lambdaParameterSecretClient;

  public SecretAccessor(
      LambdaLogger logger,
      ObjectMapper mapper,
      LambdaParameterSecretClient lambdaParameterSecretClient
  ) {
    this.logger = logger;
    this.mapper = mapper;
    this.lambdaParameterSecretClient = lambdaParameterSecretClient;
  }

  public DbSecret getDbSecret(String awsSessionToken, String secretId)
      throws InterruptedException, IOException {

    SecretsManagerResponse secretResponse = this.lambdaParameterSecretClient.getSecret(
        awsSessionToken,
        secretId
    );

    this.logger.log("--- Secret Response:");
    this.logger.log(secretResponse.toString());

    DbSecret secret = this.mapper.readValue(secretResponse.getSecretString(), DbSecret.class);

    this.logger.log("--- Secret:");
    this.logger.log(secret.toString());

    return secret;
  }
}
