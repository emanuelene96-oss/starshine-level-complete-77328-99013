import { useEffect, useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { UnityAds } from '@openanime/capacitor-plugin-unityads';
import { toast } from '@/hooks/use-toast';

const UNITY_GAME_ID = 'YOUR_UNITY_GAME_ID'; // Replace with your Unity Game ID from Unity Dashboard
const TEST_MODE = true; // Set to false in production
const AD_UNIT_ID = 'Rewarded_Android'; // Default rewarded ad unit ID for Android

export const useUnityAds = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAdReady, setIsAdReady] = useState(false);
  const [isAdShowing, setIsAdShowing] = useState(false);
  const [adRewardCallback, setAdRewardCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    // Only initialize on native platforms
    if (!Capacitor.isNativePlatform()) {
      console.log('Unity Ads: Not on native platform, skipping initialization');
      return;
    }

    // Set up event listeners
    UnityAds.addListener('initialized', () => {
      console.log('Unity Ads: Initialized');
      setIsInitialized(true);
      // Load the first ad
      UnityAds.loadAds({ adUnitId: AD_UNIT_ID });
    });

    UnityAds.addListener('initializationError', ({ error }) => {
      console.error('Unity Ads: Initialization error:', error);
      toast({
        title: 'Ad System Error',
        description: 'Failed to initialize ads. Please try again later.',
        variant: 'destructive',
      });
    });

    UnityAds.addListener('adLoaded', () => {
      console.log('Unity Ads: Ad loaded');
      setIsAdReady(true);
      toast({
        title: 'Ad Ready',
        description: 'Watch an ad to get a hint!',
      });
    });

    UnityAds.addListener('adLoadError', ({ error }) => {
      console.error('Unity Ads: Ad load error:', error);
      setIsAdReady(false);
      toast({
        title: 'Ad Load Failed',
        description: 'Unable to load ad. Please try again.',
        variant: 'destructive',
      });
    });

    UnityAds.addListener('adShowStart', () => {
      console.log('Unity Ads: Ad showing started');
      setIsAdShowing(true);
    });

    UnityAds.addListener('adShown', ({ state }) => {
      console.log('Unity Ads: Ad shown with state:', state);
      setIsAdShowing(false);
      setIsAdReady(false);

      // If the ad was completed (not skipped), grant the reward
      if (state === 'COMPLETED' && adRewardCallback) {
        adRewardCallback();
        toast({
          title: 'Reward Granted!',
          description: 'You earned a hint for watching the ad.',
        });
      } else if (state === 'SKIPPED') {
        toast({
          title: 'Ad Skipped',
          description: 'Watch the full ad to earn your hint.',
          variant: 'destructive',
        });
      }

      // Load the next ad
      UnityAds.loadAds({ adUnitId: AD_UNIT_ID });
    });

    UnityAds.addListener('adShowError', ({ error }) => {
      console.error('Unity Ads: Ad show error:', error);
      setIsAdShowing(false);
      setIsAdReady(false);
      toast({
        title: 'Ad Display Error',
        description: 'Failed to show ad. Please try again.',
        variant: 'destructive',
      });
      // Try to load another ad
      UnityAds.loadAds({ adUnitId: AD_UNIT_ID });
    });

    // Initialize Unity Ads
    console.log('Unity Ads: Initializing...');
    UnityAds.initAds({
      unityGameId: UNITY_GAME_ID,
      testMode: TEST_MODE,
    });

    return () => {
      // Clean up listeners if needed
    };
  }, [adRewardCallback]);

  const showRewardedAd = useCallback((onReward: () => void) => {
    if (!Capacitor.isNativePlatform()) {
      console.log('Unity Ads: Not on native platform, granting reward directly');
      onReward();
      return;
    }

    if (!isInitialized) {
      toast({
        title: 'Ads Not Ready',
        description: 'Ad system is still initializing. Please wait.',
      });
      return;
    }

    if (!isAdReady) {
      toast({
        title: 'No Ad Available',
        description: 'No ad is ready yet. Please try again in a moment.',
      });
      return;
    }

    // Store the reward callback
    setAdRewardCallback(() => onReward);

    // Show the ad
    console.log('Unity Ads: Displaying ad');
    UnityAds.displayAd();
  }, [isInitialized, isAdReady]);

  return {
    isInitialized,
    isAdReady,
    isAdShowing,
    showRewardedAd,
  };
};
