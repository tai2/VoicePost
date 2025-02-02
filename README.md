# VoicePost

VoicePost is an audio recording mobile application optimized for easy uploading experience on iOS and Android.

# Development

## Set up

   ```bash
   npm install
   ```

You also need to set up [Xcode](https://docs.expo.dev/workflow/ios-simulator/) and [Android Studio](https://docs.expo.dev/workflow/android-studio-emulator/).

## Local development

You can start development server and run the app on [Expo Go](https://expo.dev/go).

   ```bash
   npx expo start
   ```

This command opens iOS app inside Expo Go on Simulator

   ```bash
   npx expo start --ios
   ```

This command starts development server, builds iOS app, and runs it on Simulator

   ```bash
   npx expo run:ios
   ```

This command starts development server, builds iOS app, and runs it on a device

   ```bash
   npx expo run:ios --device
   ```

To create release builds on your local end, you have to generate projects with the `prebuild` and manually run builds according to [the expo guide](https://docs.expo.dev/guides/local-app-production/).

## EAS quick reference

These command build app for preview on EAS

```bash
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

These command build app for submit on EAS

```bash
eas build --platform ios
eas build --platform android
```

These command build and submit app on EAS

```bash
eas build --platform ios --auto-submit
eas build --platform android --auto-submit
```

## Unit testing

   ```bash
   npm test
   ```

## E2E testing

   Prerequisite: [Maestro](https://maestro.mobile.dev/)

   ```bash
   npm run e2e
   ```
