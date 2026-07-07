import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { IonicModule, IonRouterOutlet, Platform } from '@ionic/angular';
import { Push } from './services/push';
import { LocationTracker } from './services/location-tracker';
import {
LocalNotifications
} from '@capacitor/local-notifications';
import { createFFmpeg } from '@ffmpeg/ffmpeg';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
   imports: [IonicModule, RouterModule]
})
export class AppComponent {
 constructor(
    private platform: Platform,
    private push: Push,
    private tracker: LocationTracker,
    private router: Router
  ) {
    this.platform.ready().then(async () => {
      // 1. Push notification init
      this.push.initPush();

      // 2. FFmpeg Init - ఇక్కడ FFmpeg ని లోడ్ చేయండి
      try {
        const ffmpeg = createFFmpeg({ log: true });
        await ffmpeg.load();
        (window as any).ffmpeg = ffmpeg;
        console.log("✅ FFmpeg Loaded Successfully in AppComponent");
      } catch (err) {
        console.error("❌ FFmpeg Load Failed:", err);
      }

      // 3. Local Notifications
      LocalNotifications.addListener('localNotificationActionPerformed', (event) => {
        const route = event.notification.extra?.route;
        if (route) {
          this.router.navigate([route]);
        }
      });
    });
  }
}