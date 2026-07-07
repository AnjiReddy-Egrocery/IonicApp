import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dst.ayyapatelugu',
  appName: 'AyyappaTelugu',
  webDir: 'www',
 server: {
   cleartext: true, 
  iosScheme: 'capacitor',
  androidScheme: 'capacitor',
  allowNavigation: [
    'www.ayyappatelugu.com',
    '*.ayyappatelugu.com' // ఇది అన్ని సబ్-డొమైన్స్‌ను అనుమతిస్తుంది
  ]

  },
 
  plugins: {
    SplashScreen: {
      launchShowDuration: 2500,
      launchAutoHide: true,
     
      androidScaleType: "CENTER_CROP",
      backgroundColor: "#ffffff"
    },

   ios: {
  contentInset: "never"
},
 
    // ✅ ADD LOCATION PERMISSIONS
    Geolocation: {
      locationPermission: 'whenInUse'
    },
  

  GoogleMaps: {
    apiKey: "AIzaSyCvb7BWjj8jsmp15D1NGogyfHaWWocS2Ys"
  },
  PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
}
  
};

export default config;