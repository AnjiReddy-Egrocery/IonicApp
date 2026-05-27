import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PushNotifications } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';


import { App } from '@capacitor/app';
@Injectable({
  providedIn: 'root'
})
export class Push {

  constructor(
    private router: Router
  ) {}

  async initPush() {

    // PERMISSION
    const permission =
      await PushNotifications.requestPermissions();

    if (
      permission.receive !== 'granted'
    ) {

      console.log(
        '❌ Permission denied'
      );

      return;
    }

    // REGISTER DEVICE
    await PushNotifications.register();

     App.addListener(

      'appStateChange',

      async ({ isActive }) => {

        if (isActive) {

          console.log(
            '✅ App Active'
          );

          const delivered =
            await PushNotifications
              .getDeliveredNotifications();

          console.log(
            'DELIVERED:',
            delivered
          );

        }

      }

    );

    // TOKEN + TOPIC SUBSCRIBE
    PushNotifications.addListener(

      'registration',

      async (token) => {

        console.log(
          '🔥 TOKEN:',
          token.value
        );

        try {

          await FCM.subscribeTo({
            topic: 'all_users'
          });

          console.log(
            '✅ Subscribed to all_users'
          );

        } catch (error) {

          console.log(
            '❌ Subscribe Error:',
            error
          );

        }

      }
    );

    // FOREGROUND NOTIFICATION
    PushNotifications.addListener(

      'pushNotificationReceived',

      (notification) => {

        console.log(
          '📩 Notification Received',
          notification
        );

      }
    );

    // CLICKED NOTIFICATION
    PushNotifications.addListener(

      'pushNotificationActionPerformed',

      (notification) => {

        console.log(
          '👉 Notification Clicked',
          notification
        );

        const data =
          notification.notification.data;

        const type =
          data?.notificationFor;

        switch (type) {
            case 'news':
              this.router.navigate(
                ['/viewallnews_details'],
                {
                  queryParams: {
                     newsId:data.newsId?.replace(/'/g, '')
                  }
                  
                }
              );
              break;

            case 'activity':
              this.router.navigate(
                ['/karyakaram-details'],
                {
                  queryParams: {
                     activitiesId:data.activitiesId?.replace(/'/g, '')
                  }
                  
                }
              );
              break;

            case 'ayyappacalender':
                this.router.navigate(
                  ['/calender']
                );
               break;

           case 'telugucalender':

              this.router.navigate(
                ['/telugu-calender']
              );

              break;


          case 'panchagam':

            this.router.navigate(
              ['/panchangam']
            );

            break;

          case 'temple':
              this.router.navigate(
                ['/ayyappatemplelistdetails'],
                {
                  queryParams: {
                     templeId:data.templeId?.replace(/'/g, '')
                  }
                  
                }
              );
              break;
          
            case 'annadhanam':
              this.router.navigate(
                ['/ayyappaanadanamlistdetails'],
                {
                  queryParams: {
                     annadhanamId:data.annadhanamId?.replace(/'/g, '')
                  }
                  
                }
              );
              break;

          default:

            this.router.navigate(
              ['/login']
            );

            break;
        }

      }
    );

  }

}