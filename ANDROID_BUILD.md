# Chess AI Android APK

This repository contains the web version of Chess AI and an automated Android APK build.

## Build locally

Requirements:
- Node.js 22+
- Android Studio with an Android SDK

Install dependencies:

```bash
npm install
```

Create the Android project:

```bash
npm run android:setup
```

Sync the web app:

```bash
npm run android:sync
```

Build an installable debug APK:

```bash
npm run android:build
```

The APK will be at:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

## Build from GitHub

Every push to `main` that changes the Chess AI web app or Android configuration automatically starts the **Build Chess AI Android APK** workflow. You can also start it manually from GitHub Actions.

The workflow creates `Chess-AI.apk` and uploads it as the **Chess-AI-Android** workflow artifact.

This is a debug APK intended for direct installation/testing on Android devices. A Google Play release should use a separately managed release signing key.
