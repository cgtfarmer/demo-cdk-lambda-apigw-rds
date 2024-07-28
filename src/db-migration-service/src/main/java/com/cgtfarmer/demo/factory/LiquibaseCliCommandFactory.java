package com.cgtfarmer.demo.factory;

import com.cgtfarmer.demo.config.LiquibaseConfiguration;

public class LiquibaseCliCommandFactory {

  private final LiquibaseConfiguration config;

  public LiquibaseCliCommandFactory(LiquibaseConfiguration config) {
    this.config = config;
  }

  public String[] update() {
    // Note: Might need this casing
    // String.format("--changeLogFile=", config.getChangeLogFile()),
    // String.format("--driver=%s", config.getDriver()),
    return new String[] {
        String.format("--url=%s", config.getUrl()),
        String.format("--username=%s", config.getUsername()),
        String.format("--password=%s", config.getPassword()),
        String.format("--changelog-file=%s", config.getChangelogFilepath()),
        String.format("--show-banner=%s", "false"),
        "update",
    };
  }
}
