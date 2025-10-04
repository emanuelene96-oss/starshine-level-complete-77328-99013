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
    UnityAds: {
      unityGameId: 'YOUR_UNITY_GAME_ID', // Replace with your Unity Game ID
      testMode: true // Set to false in production
    }
  }
};

export default config;
