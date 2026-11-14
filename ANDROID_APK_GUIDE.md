# Nursing Service Agency — Android APK Build Guide (Capacitor)

This project is pre-configured for **Progressive Web App (PWA)** installation and **Android APK compilation using Capacitor**.

---

## 1. Prerequisites

Install the following tools on your local workstation before generating the Android APK:

- **Node.js** (v20 LTS or newer)
- **Java Development Kit (JDK) 21** (required by Capacitor 8 / Android Gradle build)
- **Android Studio** (with Android SDK Platform 36, Android SDK Build-Tools, and Android SDK Platform-Tools)

---

## 2. Project Installation & Web Build

1. Install npm dependencies:
   ```bash
   npm install
   ```

2. Build the production web bundle (`dist/`):
   ```bash
   npm run build
   ```

---

## 3. Capacitor Configuration & Android Sync

Capacitor configuration is defined in `capacitor.config.json`:
- **App ID**: `com.nursingserviceagency.app`
- **App Name**: `Nursing Service Agency`
- **Web Directory**: `dist`

The native `android/` project is already generated and integrated. Whenever you update web source files, sync the fresh bundle into Android:

```bash
npm run cap:sync
```

*(If starting from a clean repository without `android/`, run `npx cap add android && npx cap sync android`.)*

---

## 4. Generate an Installable Android APK

### Option A: Using Gradle CLI (Debug APK for Testing)

1. Navigate into the `android` directory:
   ```bash
   cd android
   ```
2. Build the debug APK:
   - **macOS / Linux**:
     ```bash
     ./gradlew assembleDebug
     ```
   - **Windows**:
     ```cmd
     gradlew.bat assembleDebug
     ```
3. Locate the generated APK at:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Option B: Build a Release APK (CLI)

1. Inside `android/`:
   ```bash
   ./gradlew assembleRelease
   ```
2. Sign the release APK using your Android keystore in Android Studio or `apksigner` before distributing.

### Option C: Using Android Studio (Debug or Signed Release APK)

1. Open the Android project in Android Studio:
   ```bash
   npm run cap:open
   ```
2. Wait for Gradle Sync to finish.
3. For a test APK: click **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
4. For a signed distribution APK: click **Build > Generate Signed Bundle / APK...**, choose **APK**, select or create a keystore, and choose the `release` build variant.

---

## 5. Installing the APK on an Android Device

- **Via USB (`adb`)**:
  ```bash
  adb install android/app/build/outputs/apk/debug/app-debug.apk
  ```
- **Directly on phone**: Copy `app-debug.apk` onto your Android device and open it to install (allow *Install unknown apps* if prompted).
