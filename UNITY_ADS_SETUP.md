# Unity Ads Integration for Android

This project has been integrated with Unity Ads to show rewarded ads when users run out of hints. Follow these steps to complete the setup.

## 📋 Prerequisites

1. A Unity account (create one at [unity.com](https://unity.com))
2. Your game registered in Unity Dashboard
3. Android Studio installed on your machine

## 🚀 Setup Instructions

### Step 1: Get Your Unity Game ID

1. Go to [Unity Dashboard](https://dashboard.unity3d.com/)
2. Create a new project or select an existing one
3. Navigate to **Monetization** > **Ads**
4. Enable Unity Ads for your project
5. Copy your **Game ID** (different for Android and iOS)
6. Note your **Ad Unit IDs** (usually `Rewarded_Android` for rewarded ads)

### Step 2: Update Configuration Files

Update the following files with your Unity credentials:

#### `capacitor.config.ts`
```typescript
plugins: {
  UnityAds: {
    unityGameId: 'YOUR_UNITY_GAME_ID', // Replace with your actual Game ID
    testMode: true // Set to false when publishing to production
  }
}
```

#### `src/hooks/useUnityAds.ts`
```typescript
const UNITY_GAME_ID = 'YOUR_UNITY_GAME_ID'; // Replace with your actual Game ID
const TEST_MODE = true; // Set to false in production
const AD_UNIT_ID = 'Rewarded_Android'; // Your rewarded ad unit ID
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

### Step 4: Configure Unity Ads in Android Studio

When Android Studio opens:

1. Wait for Gradle sync to complete
2. The Unity Ads SDK should be automatically included via the Capacitor plugin
3. Verify the Unity Ads dependency in `android/app/build.gradle`

### Step 5: Test Your App

1. **Test Mode (Recommended for Development)**
   - Keep `testMode: true` in the configuration
   - Test ads will be shown without affecting real ad inventory
   - No real money is involved

2. **Run on Device/Emulator**
   ```bash
   npx cap run android
   ```

3. **Testing the Ads Flow**
   - Play the game until you use all 3 hints
   - Tap the "Hint" button when out of hints
   - You should see the ad prompt dialog
   - Click "Watch Ad" to load and display a Unity test ad
   - Complete the ad to earn 3 more hints

### Step 6: Production Release

Before publishing to Google Play Store:

1. **Update Configuration to Production Mode**
   - Set `testMode: false` in both configuration files
   - Ensure you're using your real Unity Game ID

2. **Build Signed APK/AAB**
   - In Android Studio: Build > Generate Signed Bundle / APK
   - Follow Android signing process

3. **Unity Dashboard Setup**
   - Configure your monetization settings
   - Set up payment information
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
        Unity Ads SDK loads ad
                ↓
        Ad displays (full screen)
                ↓
        User completes ad (doesn't skip)
                ↓
        Grant reward: 3 hints restored
```

## 📱 Testing on Different Platforms

### Web Browser
- Unity Ads doesn't run in web browsers
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
- **Verify Game ID**: Ensure your Unity Game ID is correct
- **Check Unity Dashboard**: Make sure Unity Ads is enabled for your project
- **Test Mode**: Try enabling test mode to verify SDK integration

### Ad Shows But Reward Not Granted
- Make sure the user watches the ad completely (state === 'COMPLETED')
- Check the console logs for Unity Ads events
- Verify the reward callback is properly set

### Build Errors
- Run `npx cap sync` after any configuration changes
- Clean and rebuild in Android Studio
- Check that all dependencies are properly installed

## 📚 Resources

- [Unity Ads Documentation](https://docs.unity.com/ads/en-us/manual/UnityAdsHome)
- [Capacitor Plugin Documentation](https://github.com/OpenAnime/capacitor-plugin-unityads)
- [Capacitor Android Setup](https://capacitorjs.com/docs/android)
- [Android Studio Download](https://developer.android.com/studio)

## 🎯 Next Steps

1. Replace placeholder Unity Game IDs with your actual credentials
2. Test the integration in Android Studio
3. Publish to Google Play Store once satisfied
4. Monitor ad performance in Unity Dashboard

For any issues with Lovable or Capacitor, check out the [Lovable documentation](https://docs.lovable.dev/).
