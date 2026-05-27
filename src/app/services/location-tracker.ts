import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Anadanam } from './anadanam';
import { Ayyappatemplelist } from './ayyappatemplelist';
import { Templelist } from './templelist';


@Injectable({
  providedIn: 'root'
})
export class LocationTracker {
 notified = new Set<string>();

  constructor(
    private anadanamService: Anadanam,
    private templeService: Ayyappatemplelist,
    private ayyappaTempleService: Templelist
  ) {}

  async startTracking() {

    await LocalNotifications.requestPermissions();

    await Geolocation.requestPermissions();

    Geolocation.watchPosition(

      {
        enableHighAccuracy:true,
        timeout:10000
      },

      async(position,err)=>{

        if(err || !position){
          console.log(err);
          return;
        }

        const userLat =
        position.coords.latitude;

        const userLng =
        position.coords.longitude;

        console.log(
          'USER:',
          userLat,
          userLng
        );

        await this.checkAnnadanam(
          userLat,
          userLng
        );

        await this.checkTemples(
          userLat,
          userLng
        );

        await this.checkAyyappaTemples(
          userLat,
          userLng
        );

      }

    );

  }

  async checkAnnadanam(
    userLat:number,
    userLng:number
  ){

    const response =
    await this.anadanamService
    .getMapList();

    response.result?.forEach(
      (item:any)=>{

      this.processDistance(

        userLat,
        userLng,

        Number(item.latitude),
        Number(item.longitude),

        'ANNA_'+
        item.annadhanamId,

        item.annadhanamName,

        '/anadanam',

        '🍛 Annadanam'

      );

    });

  }

  async checkTemples(
    userLat:number,
    userLng:number
  ){

    const response =
    await this.templeService
    .getTempleList();

    response.result?.forEach(
      (item:any)=>{

      this.processDistance(

        userLat,
        userLng,

        Number(item.latitude),
        Number(item.longitude),

        'TEMP_'+
        item.templeId,

        item.templeName,

        '/temples',

        '🏛 Temple'

      );

    });

  }

  async checkAyyappaTemples(
    userLat:number,
    userLng:number
  ){

    const response =
    await this.ayyappaTempleService
    .getTempleList();

    response.result?.forEach(
      (item:any)=>{

      this.processDistance(

        userLat,
        userLng,

        Number(item.latitude),
        Number(item.longitude),

        'AYY_'+
        item.templeId,

        item.templeName,

        '/ayyappatemples',

        '🙏 Ayyappa Temple'

      );

    });

  }

  processDistance(

    userLat:number,
    userLng:number,

    lat:number,
    lng:number,

    id:string,

    name:string,

    route:string,

    title:string

  ){

    const distance =
    this.calculateDistance(

      userLat,
      userLng,

      lat,
      lng

    );

    console.log(
      name,
      distance
    );

    const fiveKm =
    id+'_5';

    const twoKm =
    id+'_2';

    if(
      distance<=5 &&
      !this.notified.has(
        fiveKm
      )
    ){

      this.notified.add(
        fiveKm
      );

      this.sendNotification(

        title,

        `${name}
        5KM దగ్గరలో ఉంది`,

        route

      );

    }

    if(
      distance<=2 &&
      !this.notified.has(
        twoKm
      )
    ){

      this.notified.add(
        twoKm
      );

      this.sendNotification(

        title,

        `${name}
        2KM లో ఉంది`,

        route

      );

    }

  }

  calculateDistance(

    lat1:number,
    lon1:number,

    lat2:number,
    lon2:number

  ){

    const R = 6371;

    const dLat =
    (lat2-lat1)
    *Math.PI/180;

    const dLon =
    (lon2-lon1)
    *Math.PI/180;

    const a =

    Math.sin(
      dLat/2
    ) *
    Math.sin(
      dLat/2
    )

    +

    Math.cos(
      lat1*Math.PI/180
    )

    *

    Math.cos(
      lat2*Math.PI/180
    )

    *

    Math.sin(
      dLon/2
    )

    *

    Math.sin(
      dLon/2
    );

    const c =

    2*
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1-a)
    );

    return R*c;

  }

  async sendNotification(

    title:string,

    body:string,

    route:string

  ){

    await LocalNotifications
    .schedule({

      notifications:[

        {

          id:Date.now(),

          title:title,

          body:body,

          extra:{
            route:route
          },

          schedule:{

            at:new Date(
              Date.now()+1000
            )

          }

        }

      ]

    });

  }

}