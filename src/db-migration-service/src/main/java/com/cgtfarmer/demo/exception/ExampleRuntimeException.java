package com.cgtfarmer.demo.exception;

public class ExampleRuntimeException extends RuntimeException {

  public ExampleRuntimeException() {
    super();
  }

  public ExampleRuntimeException(String message) {
    super(message);
  }

  public ExampleRuntimeException(String message, Throwable cause) {
    super(message, cause);
  }

  public ExampleRuntimeException(Throwable cause) {
    super(cause);
  }
}
