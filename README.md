# VoicePost

VoicePost is an audio recording mobile application optimized for easy uploading experience on iOS and Android.

# Development

## Set up

   ```bash
   npm install
   ```

You also need to set up [Xcode](https://docs.expo.dev/workflow/ios-simulator/) and [Android Studio](https://docs.expo.dev/workflow/android-studio-emulator/).

## Start development server

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

## EAS quick reference

These command build app for preview on EAS

```
eas build --platform ios --profile preview
eas build --platform android --profile preview
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
