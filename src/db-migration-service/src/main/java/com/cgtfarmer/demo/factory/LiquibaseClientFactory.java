package com.cgtfarmer.demo.factory;

import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.cgtfarmer.demo.config.LiquibaseConfiguration;
import java.sql.Connection;
import java.sql.DriverManager;
import liquibase.Liquibase;
import liquibase.database.jvm.JdbcConnection;
import liquibase.resource.ClassLoaderResourceAccessor;

public class LiquibaseClientFactory {

  public Liquibase create(LambdaLogger logger, LiquibaseConfiguration liquibaseConfiguration)
      throws Exception {

    Connection conn = DriverManager.getConnection(
        liquibaseConfiguration.getUrl(),
        liquibaseConfiguration.getUsername(),
        liquibaseConfiguration.getPassword()
    );

    Liquibase liquibaseClient = new Liquibase(
        liquibaseConfiguration.getChangelogFilepath(),
        new ClassLoaderResourceAccessor(),
        new JdbcConnection(conn)
    );

    return liquibaseClient;
  }
}
