// This is a shim for web and Android where the tab bar is generally opaque.
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default undefined;

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}


