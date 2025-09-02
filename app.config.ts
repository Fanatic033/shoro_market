import type { ExpoConfig } from 'expo/config';

// const API_BASE_URL = process.env.API_BASE_URL ?? 'https://crmdev.shoro.kg/api';
const API_BASE_URL: string = 'http://192.168.8.207:8080/api'


const config: ExpoConfig = {
  name: 'shoro-expo',
  slug: 'shoromarket',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'shoroexpo',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.fanatic033.shoromarket',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    package: 'com.fanatic033.shoromarket',
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
    apiBaseUrl: API_BASE_URL,
    eas: {
      projectId: '683e27f3-ee4f-423c-ae2f-95ff18dfbfe0',
    },
  },
  owner: 'fanatic033',
  updates: {
    url: "https://u.expo.dev/683e27f3-ee4f-423c-ae2f-95ff18dfbfe0",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
};

export default config;


