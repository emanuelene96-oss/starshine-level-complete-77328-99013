# AdMob Integration for Android

This project has been integrated with Google AdMob to show rewarded ads when users run out of hints. Follow these steps to complete the setup.

## 📋 Prerequisites

1. A Google AdMob account (create one at [admob.google.com](https://admob.google.com))
2. Your game registered in AdMob Console
3. Android Studio installed on your machine

## 🚀 Setup Instructions

### Step 1: Get Your AdMob IDs

1. Go to [AdMob Console](https://apps.admob.com/)
2. Create a new app or select an existing one
3. Navigate to **App Settings** and copy your **App ID** (format: `ca-app-pub-XXXXX~XXXXXX`)
4. Go to **Ad units** and create a new **Rewarded** ad unit
5. Copy your **Ad Unit ID** (format: `ca-app-pub-XXXXX/XXXXXX`)

### Step 2: Update Configuration Files

Update the following files with your AdMob credentials:

#### `capacitor.config.ts`
```typescript
plugins: {
  AdMob: {
    appId: 'ca-app-pub-XXXXX~XXXXXX', // Your AdMob App ID
    testingDevices: ['YOUR_TEST_DEVICE_ID'], // Optional test device
    initializeForTesting: true // Set to false in production
  }
}
```

#### `src/hooks/useAdMob.ts`
```typescript
const ADMOB_APP_ID = 'ca-app-pub-XXXXX~XXXXXX'; // Your App ID
const REWARDED_AD_UNIT_ID = 'ca-app-pub-XXXXX/XXXXXX'; // Your Rewarded Ad Unit ID
const TEST_MODE = true; // Set to false in production
```

### Step 3: Export and Build for Android

1. **Export to GitHub**
   - Click the "Export to Github" button in your Lovable project
   - Clone your repository locally

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Add Android Platform**
   ```bash
   npx cap add android
   ```

4. **Update Native Dependencies**
   ```bash
   npx cap update android
   ```

5. **Build the Project**
   ```bash
   npm run build
   ```

6. **Sync Capacitor**
   ```bash
   npx cap sync
   ```

7. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

### Step 4: Configure AdMob in Android Studio

When Android Studio opens:

1. Wait for Gradle sync to complete
2. Open `android/app/src/main/AndroidManifest.xml`
3. Add your AdMob App ID inside the `<application>` tag:
   ```xml
   <meta-data
       android:name="com.google.android.gms.ads.APPLICATION_ID"
       android:value="ca-app-pub-XXXXX~XXXXXX"/>
   ```

### Step 5: Test Your App

1. **Test Mode (Recommended for Development)**
   - Keep `testMode: true` and `initializeForTesting: true`
   - Test ads will be shown without affecting real ad inventory
   - No risk of policy violations

2. **Get Your Test Device ID**
   - Run the app once
   - Check logcat in Android Studio for your test device ID
   - Add it to the configuration files

3. **Run on Device/Emulator**
   ```bash
   npx cap run android
   ```

4. **Testing the Ads Flow**
   - Play the game until you use all 3 hints
   - Tap the "Hint" button when out of hints
   - You should see the ad prompt dialog
   - Click "Watch Ad" to load and display a test ad
   - Complete the ad to earn 3 more hints

### Step 6: Production Release

Before publishing to Google Play Store:

1. **Update Configuration to Production Mode**
   - Set `TEST_MODE: false` in `useAdMob.ts`
   - Set `initializeForTesting: false` in `capacitor.config.ts`
   - Remove or clear the `testingDevices` array

2. **Build Signed APK/AAB**
   - In Android Studio: Build > Generate Signed Bundle / APK
   - Follow Android signing process

3. **AdMob Console Setup**
   - Link your app to Google Play Store
   - Configure payment information
   - Review ad placement policies

## 🎮 How It Works

### In the Game

1. **Hints System**: Players start with 3 free hints per session
2. **Watch Ads for More**: When hints run out, players can watch a rewarded ad to get 3 more hints
3. **Seamless Integration**: Ads only show when players explicitly choose to watch them

### Technical Flow

```
User taps Hint → Check hints available
                ↓
        Yes: Use hint
        No: Show ad prompt
                ↓
        User agrees to watch ad
                ↓
        AdMob SDK loads ad
                ↓
        Ad displays (full screen)
                ↓
        User completes ad
                ↓
        Grant reward: 3 hints restored
```

## 📱 Testing on Different Platforms

### Web Browser
- AdMob doesn't run in web browsers
- The hook automatically grants rewards without showing ads when not on native platform
- This allows testing the game logic without building for Android

### Android Emulator
- Fully supported
- Test ads will display if in test mode
- Make sure the emulator has Google Play Services

### Physical Android Device
- Best for final testing
- Most accurate representation of user experience
- Required for testing actual ad loading times

## 🔧 Troubleshooting

### Ads Not Loading
- **Check Internet Connection**: Ads require network access
- **Verify App ID**: Ensure your AdMob App ID is correct in AndroidManifest.xml
- **Check AdMob Console**: Make sure your app is approved and ads are enabled
- **Test Mode**: Enable test mode to verify SDK integration

### Ad Shows But Reward Not Granted
- Check the console logs for AdMob events
- Verify the reward listener is properly set
- Make sure the ad was completed (not skipped)

### Build Errors
- Run `npx cap sync` after any configuration changes
- Clean and rebuild in Android Studio
- Check that Google Play Services is installed on the device/emulator

### "AdMob App ID is missing" Error
- Ensure you've added the `<meta-data>` tag in AndroidManifest.xml
- Verify the App ID format is correct (ca-app-pub-XXXXX~XXXXXX)

## 📚 Resources

- [AdMob Get Started Guide](https://developers.google.com/admob/android/quick-start)
- [Capacitor AdMob Plugin](https://github.com/capacitor-community/admob)
- [Capacitor Android Setup](https://capacitorjs.com/docs/android)
- [Android Studio Download](https://developer.android.com/studio)

## 🎯 Next Steps

1. Replace placeholder AdMob IDs with your actual credentials
2. Add the App ID to AndroidManifest.xml
3. Test the integration in Android Studio
4. Publish to Google Play Store once satisfied
5. Monitor ad performance in AdMob Console

## ⚠️ Important Notes

- **Test Mode**: Always test with test ads during development to avoid policy violations
- **Ad Limits**: Don't show ads too frequently - respect user experience
- **Policies**: Follow AdMob's policies and Google Play Store guidelines
- **GDPR/Privacy**: Implement proper consent mechanisms if targeting EU users

For any issues with Lovable or Capacitor, check out the [Lovable documentation](https://docs.lovable.dev/).
