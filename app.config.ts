import 'dotenv/config';

export default {
  expo: {
    name: 'Momentum',
    slug: 'momentum',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    ios: {
      supportsTablet: true,
      bundleIdentifier: process.env.EXPO_PUBLIC_IOS_BUNDLE_ID ?? 'com.example.momentum',
    },
    android: {
      package: process.env.EXPO_PUBLIC_ANDROID_PACKAGE ?? 'com.example.momentum',
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
      authProviderKey: process.env.EXPO_PUBLIC_AUTH_PROVIDER_KEY,
      analyticsKey: process.env.EXPO_PUBLIC_ANALYTICS_KEY,
      eas: {
        projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID ?? 'replace-with-eas-project-id',
      },
    },
  },
};
