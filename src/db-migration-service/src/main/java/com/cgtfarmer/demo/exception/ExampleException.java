package com.cgtfarmer.demo.exception;

public class ExampleException extends RuntimeException {

  public ExampleException() {
    super();
  }

  public ExampleException(String message) {
    super(message);
  }

  public ExampleException(String message, Throwable cause) {
    super(message, cause);
  }

  public ExampleException(Throwable cause) {
    super(cause);
  }
}
