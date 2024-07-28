package com.cgtfarmer.demo.config;

import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.cgtfarmer.demo.accessor.EnvironmentAccessor;
import com.cgtfarmer.demo.accessor.LambdaParameterSecretClient;
import com.cgtfarmer.demo.accessor.SecretAccessor;
import com.cgtfarmer.demo.factory.LiquibaseClientFactory;
import com.cgtfarmer.demo.factory.LiquibaseConfigFactory;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.io.IOException;
import java.net.http.HttpClient;
import java.sql.SQLException;
import liquibase.Liquibase;
import liquibase.exception.DatabaseException;
import lombok.Getter;

@Getter
public class DependencyGraphFactory {

  public DependencyGraph create(LambdaLogger logger)
      throws DatabaseException, InterruptedException, IOException, SQLException {

    EnvironmentAccessor environmentAccessor = new EnvironmentAccessor();

    HttpClient httpClient = HttpClient.newHttpClient();

    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    objectMapper.registerModule(new JavaTimeModule());

    LambdaParameterSecretClient lambdaParameterSecretClient =
        new LambdaParameterSecretClient(logger, httpClient, objectMapper);

    SecretAccessor secretAccessor = new SecretAccessor(
        objectMapper,
        lambdaParameterSecretClient
    );

    LiquibaseConfiguration liquibaseConfiguration = new LiquibaseConfigFactory(
        environmentAccessor,
        secretAccessor
    ).create();

    Liquibase liquibaseClient = new LiquibaseClientFactory().create(liquibaseConfiguration);

    return DependencyGraph.builder()
        .liquibaseClient(liquibaseClient)
        .build();
  }
}
