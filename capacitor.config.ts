import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dst.ayyapatelugu',
  appName: 'AyyappaTelugu',
  webDir: 'www', 
 plugins: {
   SplashScreen: {
     launchShowDuration: 3000, // 3 seconds
     launchAutoHide: true, // auto hide after duration
     backgroundColor: "#FFFFFFFF", // white (set your color)
     androidScaleType: "CENTER_CROP",
     showSpinner: false // true if you want loading spinner
   },
  
 }
  };


export default config;
