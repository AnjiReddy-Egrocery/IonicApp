import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Auth } from 'src/app/services/auth';
import { IonicModule } from '@ionic/angular';
import { PushNotifications } from '@capacitor/push-notifications';


@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
 
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonicModule]
})
export class SplashPage implements OnInit {

  notificationClicked = false;

   constructor(private router: Router, private authService: Auth) {}

 async ngOnInit() {

    PushNotifications.addListener(

      'pushNotificationActionPerformed',

      (notification) => {
            this.notificationClicked = true;
        console.log(
          'SPLASH CLICK:',
          notification
        );

        const data =
          notification.notification.data;

        const type =
          data?.notificationFor;

        switch (type) {

          case 'news':

            const newsId =
              data.newsId
                ?.replace(/'/g, '')
                ?.trim();

            console.log(
              'SPLASH NEWS ID:',
              newsId
            );

            this.router.navigate(
              ['/viewallnews_details'],
              {
                queryParams: {
                  newsId: newsId
                }
              }
            );

            break;

          case 'activity':

            const activitiesId =
              data.activitiesId
                ?.replace(/'/g, '')
                ?.trim();

            this.router.navigate(
              ['/karyakaram-details'],
              {
                queryParams: {
                  activitiesId:
                    activitiesId
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

            const templeId =
              data.templeId
                ?.replace(/'/g, '')
                ?.trim();

            this.router.navigate(
              ['/ayyappatemplelistdetails'],
              {
                queryParams: {
                  templeId:
                    templeId
                }
              }
            );

            break;
            
    case 'annadhanam':

            const annadhanamId =
              data.annadhanamId
                ?.replace(/'/g, '')
                ?.trim();

            this.router.navigate(
              ['/ayyappaanadanamlistdetails'],
              {
                queryParams: {
                  annadhanamId:
                    annadhanamId
                }
              }
            );

            break;
            

          default:

            this.router.navigateByUrl(
              '/introslider',
              {
                replaceUrl: true
              }
            );

            break;
        }

      }
    );

    // normal open
    setTimeout(() => {

       if (!this.notificationClicked) {

        this.router.navigateByUrl(

          '/introslider',

          {
            replaceUrl: true
          }

        );

      }

    }, 2000);

  }

}

