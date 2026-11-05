# Unit and Widget Test Instructions

From the frontend repository, run `flutter test --coverage`. Review the test output and `coverage/lcov.info`. CI enforces at least 80% line coverage using the repository's existing threshold. Run `flutter analyze` separately for static checks.

These tests cover isolated Dart logic and widget behavior. They do not exercise a running backend, PostgreSQL, or Android platform integration.
