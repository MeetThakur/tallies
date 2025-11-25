# 📱 Build APK Instructions

This guide will help you build an Android APK from your Tallies counter app.

## 🚀 Quick Start (Recommended)

### Option 1: EAS Build (Cloud Build)

**Easiest method - No Android Studio required!**

#### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

#### Step 2: Login to Expo
```bash
eas login
```
*Create a free account at https://expo.dev if you don't have one*

#### Step 3: Build APK
```bash
# Build preview APK (for testing)
eas build --platform android --profile preview

# Or build production AAB (for Play Store)
eas build --platform android --profile production
```

#### Step 4: Download APK
- Wait for build to complete (~5-15 minutes)
- Download APK from the link provided
- Install on your Android device

**Pros:**
✅ Works on any OS (Windows, Mac, Linux)  
✅ No Android Studio required  
✅ Automatic dependency handling  
✅ Cloud-based build  

**Cons:**
⚠️ Requires Expo account  
⚠️ Free tier: Limited builds per month  

---

## 🔧 Option 2: Local Build (Advanced)

**For developers who want full control**

### Prerequisites
1. **Install Android Studio**
   - Download from: https://developer.android.com/studio
   - Install Android SDK
   - Set up environment variables

2. **Install Java JDK**
   - JDK 17 recommended
   - Set JAVA_HOME environment variable

3. **Configure Android SDK**
   ```bash
   # Add to ~/.bashrc or ~/.zshrc (Mac/Linux)
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

### Build Steps

#### Step 1: Install Dependencies
```bash
cd counter
npm install
```

#### Step 2: Prebuild
```bash
npx expo prebuild --platform android
```
*This creates the `android/` folder*

#### Step 3: Build APK
```bash
cd android
./gradlew assembleRelease
```

#### Step 4: Find Your APK
```bash
# APK location:
android/app/build/outputs/apk/release/app-release.apk
```

### Signing APK (Production)

**Generate Keystore:**
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore tallies-release-key.keystore -alias tallies-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**Configure Signing:**
Create `android/app/gradle.properties`:
```properties
MYAPP_RELEASE_STORE_FILE=tallies-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=tallies-key-alias
MYAPP_RELEASE_STORE_PASSWORD=your-keystore-password
MYAPP_RELEASE_KEY_PASSWORD=your-key-password
```

**Build Signed APK:**
```bash
cd android
./gradlew assembleRelease
```

---

## 📲 Option 3: Testing with Expo Go

**For quick testing without building APK**

```bash
# Start dev server
npx expo start

# Scan QR code with Expo Go app on Android
```

**Note:** This doesn't create an APK, only for development testing.

---

## 🎯 Build Profiles Explained

### Development Profile
```bash
eas build --platform android --profile development
```
- Development client
- For internal testing
- Builds APK

### Preview Profile
```bash
eas build --platform android --profile preview
```
- Internal distribution
- For beta testers
- Builds APK (installable)

### Production Profile
```bash
eas build --platform android --profile production
```
- For Google Play Store
- Builds AAB (Android App Bundle)
- Optimized and signed

---

## 📦 File Sizes

| Build Type | Approximate Size |
|------------|------------------|
| Development APK | 40-60 MB |
| Preview APK | 30-40 MB |
| Production AAB | 25-35 MB |

---

## 🐛 Common Issues

### Issue: "command not found: eas"
**Solution:**
```bash
npm install -g eas-cli
# Or
yarn global add eas-cli
```

### Issue: "ANDROID_HOME not set"
**Solution:**
```bash
# Mac/Linux
export ANDROID_HOME=$HOME/Library/Android/sdk

# Windows (PowerShell)
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
```

### Issue: "SDK location not found"
**Solution:**
Create `android/local.properties`:
```properties
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
```

### Issue: Build fails with Gradle error
**Solution:**
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

---

## 🔐 App Signing Information

### For EAS Build:
- EAS handles signing automatically
- Credentials stored securely in Expo servers
- Download keystore: `eas credentials`

### For Local Build:
- Keep your keystore file safe
- **Never commit keystore to git**
- Back up your keystore (you can't recover it!)

---

## 📤 Distribution Options

### 1. Direct Install
- Send APK file to users
- Users enable "Install from Unknown Sources"
- Install manually

### 2. Google Play Store
- Build production AAB
- Create Play Console account ($25 one-time)
- Upload AAB through Play Console

### 3. Internal Testing
- Use EAS internal distribution
- Send download links to testers
- No Play Store needed

---

## 🎨 App Information

- **App Name:** Tallies
- **Package Name:** com.anonymous.tallies (default)
- **Version:** 1.0.0
- **Supported:** Android 5.0+ (API 21+)

---

## 📚 Additional Resources

- **Expo Documentation:** https://docs.expo.dev/build/setup/
- **EAS Build:** https://docs.expo.dev/build/introduction/
- **Android Studio:** https://developer.android.com/studio
- **Play Console:** https://play.google.com/console

---

## 💡 Recommended Workflow

1. **Development:** Use Expo Go for quick testing
2. **Beta Testing:** Build preview APK with EAS
3. **Production:** Build production AAB for Play Store

---

## ⚡ Quick Commands Cheat Sheet

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure (first time only)
eas build:configure

# Build preview APK
eas build -p android --profile preview

# Check build status
eas build:list

# Download credentials
eas credentials

# View build logs
eas build:view [BUILD_ID]
```

---

## ✅ Checklist Before Building

- [ ] All dependencies installed (`npm install`)
- [ ] App tested with Expo Go
- [ ] App icon added (1024x1024 PNG)
- [ ] Splash screen configured
- [ ] Version number updated in `app.json`
- [ ] Package name unique (if publishing)
- [ ] EAS CLI installed and logged in

---

**Need help?** Check the Expo documentation or create an issue on GitHub.

**Happy Building! 🚀**