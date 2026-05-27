import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { IonicModule, IonRouterOutlet, Platform } from '@ionic/angular';
import { Push } from './services/push';
import { LocationTracker } from './services/location-tracker';
import {
LocalNotifications
} from '@capacitor/local-notifications';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
   imports: [IonicModule, RouterModule]
})
export class AppComponent {
 constructor(
    private platform:Platform,
    private push:Push,
    private tracker:
      LocationTracker,
          private router:
    Router
  ) {

    this.platform.ready().then(
      async ()=>{

        this.push.initPush();
await this.tracker
      .startTracking();

      LocalNotifications
      .addListener(

        'localNotificationActionPerformed',

        (event)=>{

          const route =

          event.notification
          .extra?.route;

          if(route){

            this.router
            .navigate([route]);

          }

        }

      );

    });

  }

}