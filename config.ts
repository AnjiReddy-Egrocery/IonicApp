import type { CapacitorConfig } from '@capacitor/cli';

export const config: CapacitorConfig = {
  appId: 'com.dst.ayyapatelugu',
  appName: 'AyyappaTelugu',
  webDir: 'www',
  bundledWebRuntime: false, // Top-level only
  plugins: {
    SplashScreen: {
     launchShowDuration: 0,
     launchAutoHide: false,
    }
  }
};
