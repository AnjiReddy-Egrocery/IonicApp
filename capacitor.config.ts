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
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#FFFFFFFF',
      showSpinner: false
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