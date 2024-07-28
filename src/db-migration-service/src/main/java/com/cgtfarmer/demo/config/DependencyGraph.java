package com.cgtfarmer.demo.config;

import liquibase.Liquibase;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DependencyGraph {

  private Liquibase liquibaseClient;
}
