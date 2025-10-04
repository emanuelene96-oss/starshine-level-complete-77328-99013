import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.37e4975a2ec24955ac59dfd7525997ab',
  appName: 'starshine-level-complete-77328',
  webDir: 'dist',
  server: {
    url: 'https://37e4975a-2ec2-4955-ac59-dfd7525997ab.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    AdMob: {
      appId: 'YOUR_ADMOB_APP_ID', // Replace with your AdMob App ID (ca-app-pub-XXXXX~XXXXXX)
      testingDevices: ['YOUR_TEST_DEVICE_ID'], // Optional: Add test device IDs
      initializeForTesting: true // Set to false in production
    }
  }
};

export default config;
