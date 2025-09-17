import { Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ANDROID_SAFE_AREA_BOTTOM, ANDROID_SAFE_AREA_TOP, ANDROID_STATUS_BAR_HEIGHT } from '@/utils/constants/constant';

export const useSafeArea = () => {
  const insets = useSafeAreaInsets();
  
  // Android-specific safe area calculations
  const getAndroidSafeArea = () => {
    const { height: screenHeight } = Dimensions.get('window');
    
    return {
      top: Platform.OS === 'android' ? ANDROID_SAFE_AREA_TOP : insets.top,
      bottom: Platform.OS === 'android' ? ANDROID_SAFE_AREA_BOTTOM : insets.bottom,
      left: insets.left,
      right: insets.right,
    };
  };

  const safeArea = getAndroidSafeArea();

  return {
    ...safeArea,
    // Helper methods
    getTopPadding: () => safeArea.top,
    getBottomPadding: () => safeArea.bottom,
    getHorizontalPadding: () => Math.max(safeArea.left, safeArea.right),
    // Android-specific
    isAndroid: Platform.OS === 'android',
    statusBarHeight: Platform.OS === 'android' ? ANDROID_STATUS_BAR_HEIGHT : 0,
  };
};
