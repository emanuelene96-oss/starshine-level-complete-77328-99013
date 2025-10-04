import { useEffect, useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { 
  AdMob, 
  RewardAdOptions, 
  AdMobRewardItem,
  RewardAdPluginEvents,
  AdLoadInfo
} from '@capacitor-community/admob';
import { toast } from '@/hooks/use-toast';

const ADMOB_APP_ID = 'YOUR_ADMOB_APP_ID'; // Replace with your AdMob App ID (ca-app-pub-XXXXX~XXXXXX)
const REWARDED_AD_UNIT_ID = 'YOUR_REWARDED_AD_UNIT_ID'; // Replace with your Rewarded Ad Unit ID (ca-app-pub-XXXXX/XXXXXX)
const TEST_MODE = true; // Set to false in production

export const useAdMob = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAdReady, setIsAdReady] = useState(false);
  const [isAdShowing, setIsAdShowing] = useState(false);

  useEffect(() => {
    // Only initialize on native platforms
    if (!Capacitor.isNativePlatform()) {
      console.log('AdMob: Not on native platform, skipping initialization');
      return;
    }

    const initializeAdMob = async () => {
      try {
        console.log('AdMob: Initializing...');
        await AdMob.initialize({
          testingDevices: TEST_MODE ? ['YOUR_TEST_DEVICE_ID'] : [],
          initializeForTesting: TEST_MODE,
        });
        
        setIsInitialized(true);
        console.log('AdMob: Initialized successfully');

        // Set up event listeners
        AdMob.addListener(RewardAdPluginEvents.Loaded, (info: AdLoadInfo) => {
          console.log('AdMob: Rewarded ad loaded', info);
          setIsAdReady(true);
          toast({
            title: 'Ad Ready',
            description: 'Watch an ad to get hints!',
          });
        });

        AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error: any) => {
          console.error('AdMob: Failed to load ad:', error);
          setIsAdReady(false);
          toast({
            title: 'Ad Load Failed',
            description: 'Unable to load ad. Please try again.',
            variant: 'destructive',
          });
        });

        AdMob.addListener(RewardAdPluginEvents.Showed, () => {
          console.log('AdMob: Rewarded ad showing');
          setIsAdShowing(true);
        });

        AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
          console.log('AdMob: Rewarded ad dismissed');
          setIsAdShowing(false);
          setIsAdReady(false);
        });

        AdMob.addListener(RewardAdPluginEvents.FailedToShow, (error: any) => {
          console.error('AdMob: Failed to show ad:', error);
          setIsAdShowing(false);
          setIsAdReady(false);
          toast({
            title: 'Ad Display Error',
            description: 'Failed to show ad. Please try again.',
            variant: 'destructive',
          });
        });

        // Prepare the first ad
        await prepareRewardedAd();
      } catch (error) {
        console.error('AdMob: Initialization error:', error);
        toast({
          title: 'Ad System Error',
          description: 'Failed to initialize ads. Please try again later.',
          variant: 'destructive',
        });
      }
    };

    initializeAdMob();
  }, []);

  const prepareRewardedAd = async () => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      console.log('AdMob: Preparing rewarded ad...');
      const options: RewardAdOptions = {
        adId: REWARDED_AD_UNIT_ID,
        isTesting: TEST_MODE,
      };

      await AdMob.prepareRewardVideoAd(options);
    } catch (error) {
      console.error('AdMob: Failed to prepare ad:', error);
      setIsAdReady(false);
    }
  };

  const showRewardedAd = useCallback(async (onReward: () => void) => {
    if (!Capacitor.isNativePlatform()) {
      console.log('AdMob: Not on native platform, granting reward directly');
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
      // Try to prepare another ad
      await prepareRewardedAd();
      return;
    }

    try {
      console.log('AdMob: Showing rewarded ad...');
      
      // Set up one-time reward listener
      AdMob.addListener(
        RewardAdPluginEvents.Rewarded,
        (rewardItem: AdMobRewardItem) => {
          console.log('AdMob: User earned reward:', rewardItem);
          onReward();
          toast({
            title: 'Reward Granted!',
            description: 'You earned hints for watching the ad.',
          });
        }
      );

      // Show the ad (returns the reward item)
      await AdMob.showRewardVideoAd();
      
      // Prepare the next ad
      setTimeout(() => {
        prepareRewardedAd();
      }, 1000);
    } catch (error) {
      console.error('AdMob: Failed to show ad:', error);
      setIsAdShowing(false);
      toast({
        title: 'Ad Display Error',
        description: 'Failed to show ad. Please try again.',
        variant: 'destructive',
      });
      // Try to prepare another ad
      await prepareRewardedAd();
    }
  }, [isInitialized, isAdReady]);

  return {
    isInitialized,
    isAdReady,
    isAdShowing,
    showRewardedAd,
  };
};
