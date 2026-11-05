# Build Instructions

## Prerequisites

- Flutter/Dart matching Flutter 3.47.2 and the repository's `.flutter-version`.
- Android SDK/Gradle for local APK compilation.
- Docker Engine and Docker Compose for the local backend/API plus PostgreSQL integration environment.
- The frontend repository at `finance-ai-frontend`; integration service source is the pinned backend commit recorded in `frontend-android-ci-code-generation-plan.md`.

## Build Steps

1. Resolve locked Flutter packages: `flutter pub get --enforce-lockfile`.
2. Format and analyze: `dart format --output=none --set-exit-if-changed lib test integration_test` and `flutter analyze`.
3. Build the Android debug APK: `flutter build apk --debug`.
4. Expected artifact: `build/app/outputs/flutter-apk/app-debug.apk`.

The Actions workflow uploads this unsigned debug APK for seven days. It is for QA installation and is not a signed store release.
