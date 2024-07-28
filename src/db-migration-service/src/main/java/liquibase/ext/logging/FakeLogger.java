package liquibase.ext.logging;

import java.util.logging.Level;
import liquibase.logging.core.AbstractLogger;

public class FakeLogger extends AbstractLogger {

  @Override
  public void log(Level level, String message, Throwable e) {
    System.out.println(
      String.format("[%s] %s %s", level.getName(), message, e.getMessage())
    );
  }
}
