import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';

import { Anadanam } from './anadanam';
import { Ayyappatemplelist } from './ayyappatemplelist';
import { Templelist } from './templelist';

@Injectable({
  providedIn: 'root'
})
export class LocationTracker {
  private nearbyPlaces: any[] = [];

getNearbyPlaces(): any[] {
  return this.nearbyPlaces;
}

  private watchId: string | null = null;

  // Prevent duplicate notifications
  private notified = new Set<string>();

  // API Cache
  private annadanamList: any[] = [];
  private templeList: any[] = [];
  private ayyappaTempleList: any[] = [];

  // Notification interval
  private lastNotificationTime = 0;
  private readonly NOTIFICATION_INTERVAL = 5 * 60 * 1000; // 5 Minutes

  constructor(
    private anadanamService: Anadanam,
    private templeService: Ayyappatemplelist,
    private ayyappaTempleService: Templelist
  ) {}

  async startTracking(type: 'annadanam' | 'temple' | 'ayyappa') {

    if (this.watchId) {
      return;
    }

    await LocalNotifications.requestPermissions();
    await Geolocation.requestPermissions();

    // Load API only once
    if (type === 'annadanam' && this.annadanamList.length === 0) {
      const res = await this.anadanamService.getMapList();
      this.annadanamList = res?.result || [];
    }

    if (type === 'temple' && this.templeList.length === 0) {
      const res = await this.templeService.getTempleList();
      this.templeList = res?.result || [];
    }

    if (type === 'ayyappa' && this.ayyappaTempleList.length === 0) {
      const res = await this.ayyappaTempleService.getTempleList();
      this.ayyappaTempleList = res?.result || [];
    }

    this.watchId = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      },
      async (position, err) => {

        if (err || !position) {
          console.log(err);
          return;
        }

        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        console.log(
          'USER LOCATION',
          userLat,
          userLng
        );

        switch (type) {

          case 'annadanam':
            await this.checkAnnadanam(userLat, userLng);
            break;

          case 'temple':
            await this.checkTemples(userLat, userLng);
            break;

          case 'ayyappa':
            await this.checkAyyappaTemples(userLat, userLng);
            break;

        }

      }
    );

  }
    async checkAnnadanam(
    userLat: number,
    userLng: number
  ) {

    const nearbyList: any[] = [];

    this.annadanamList.forEach((item: any) => {

      const distance = this.calculateDistance(
        userLat,
        userLng,
        Number(item.latitude),
        Number(item.longitude)
      );

      console.log(
        `${item.annadhanamName} = ${distance.toFixed(2)} KM`
      );

      if (distance <= 5) {

        nearbyList.push({
          ...item,
          distance
        });

      }

    });

    if (nearbyList.length > 0) {

      await this.sendNearbyNotification(
        '🍛 Annadanam',
        nearbyList,
        '/anadanam'
      );

    }

  }

  async checkTemples(
    userLat: number,
    userLng: number
  ) {

    const nearbyList: any[] = [];

    this.templeList.forEach((item: any) => {

      const distance = this.calculateDistance(
        userLat,
        userLng,
        Number(item.latitude),
        Number(item.longitude)
      );

      console.log(
        `${item.templeName} = ${distance.toFixed(2)} KM`
      );

      if (distance <= 5) {

        nearbyList.push({
          ...item,
          distance
        });

      }

    });

    if (nearbyList.length > 0) {

      await this.sendNearbyNotification(
        '🏛 Temple',
        nearbyList,
        '/temples'
      );

    }

  }

  async checkAyyappaTemples(
    userLat: number,
    userLng: number
  ) {

    const nearbyList: any[] = [];

    this.ayyappaTempleList.forEach((item: any) => {

      const distance = this.calculateDistance(
        userLat,
        userLng,
        Number(item.latitude),
        Number(item.longitude)
      );

      console.log(
        `${item.templeName} = ${distance.toFixed(2)} KM`
      );

      if (distance <= 5) {

        nearbyList.push({
          ...item,
          distance
        });

      }

    });

    if (nearbyList.length > 0) {

      await this.sendNearbyNotification(
        '🙏 Ayyappa Temple',
        nearbyList,
        '/ayyappatemples'
      );

    }

  }
    calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

    return R * c;

  }

  async sendNearbyNotification(

    title: string,

    nearbyList: any[],

    route: string

  ) {

    if (nearbyList.length === 0) {
      return;
    }

    // Sort nearest first
    nearbyList.sort((a, b) => a.distance - b.distance);

    // Prevent notification spam (5 minutes)
    const now = Date.now();

    if (
      now - this.lastNotificationTime <
      this.NOTIFICATION_INTERVAL
    ) {
      return;
    }

    this.lastNotificationTime = now;

    // Save nearby list
    this.nearbyPlaces = nearbyList
    await Preferences.set({

      key: 'nearby_places',

      value: JSON.stringify(nearbyList)

    });

    // Save route
    await Preferences.set({

      key: 'nearby_route',

      value: route

    });

    const nearest = nearbyList[0];

    let body = '';

    if (nearbyList.length === 1) {

      body =
        `${nearest.templeName ||
        nearest.annadhanamName}
        
${nearest.distance.toFixed(1)} KM దూరంలో ఉంది`;

    } else {

      body =
        `${nearbyList.length} places మీ సమీపంలో ఉన్నాయి.
        
Nearest:
${nearest.templeName ||
nearest.annadhanamName}

${nearest.distance.toFixed(1)} KM`;

    }

    await LocalNotifications.schedule({

      notifications: [

        {

          id: 1001,

          title,

          body,

          extra: {

            route,

            count: nearbyList.length

          },

          schedule: {

            at: new Date(
              Date.now() + 1000
            )

          }

        }

      ]

    });

    console.log(
      'Notification Sent',
      nearbyList.length
    );

  }
    /**
   * Stop Location Tracking
   */
  async stopTracking(): Promise<void> {

    try {

      if (this.watchId) {

        await Geolocation.clearWatch({
          id: this.watchId
        });

        console.log('✅ Location tracking stopped');

        this.watchId = null;
      }

    } catch (e) {

      console.error('Stop Tracking Error', e);

    }

  }

  /**
   * Clear all delivered notifications
   */
  async clearNotifications(): Promise<void> {

    try {

      await LocalNotifications.removeAllDeliveredNotifications();

      console.log('✅ Notifications Cleared');

    } catch (e) {

      console.error(e);

    }

  }

  /**
   * Clear API cache
   */
  clearCache(): void {

    this.annadanamList = [];
    this.templeList = [];
    this.ayyappaTempleList = [];

    this.notified.clear();

    console.log('✅ Cache Cleared');

  }

  /**
   * Reset complete tracker
   */
  async resetTracking(): Promise<void> {

    await this.stopTracking();

    await this.clearNotifications();

    this.clearCache();

    this.lastNotificationTime = 0;
    this.nearbyPlaces = [];

    await Preferences.remove({
      key: 'nearby_places'
    });

    await Preferences.remove({
      key: 'nearby_route'
    });

    console.log('✅ Tracker Reset Completed');

  }

}