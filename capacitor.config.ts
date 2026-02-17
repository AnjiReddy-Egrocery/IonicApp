import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dst.ayyapatelugu',
  appName: 'AyyappaTelugu',
  webDir: 'www',
  server: {
    cleartext: true,
    allowNavigation: ['www.ayyappatelugu.com']
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2500,
      launchAutoHide: true,
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
      backgroundColor: "#ffffff"
    },

    

    // ✅ ADD LOCATION PERMISSIONS
    Geolocation: {
      locationPermission: 'whenInUse'
    },
  

  GoogleMaps: {
    apiKey: "AIzaSyCvb7BWjj8jsmp15D1NGogyfHaWWocS2Ys"
  }
}
  
};

export default config;