import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { Ayyappatemplelist } from 'src/app/services/ayyappatemplelist';
import { Geolocation } from '@capacitor/geolocation';
import { TempleNearMapComponent } from 'src/app/components/temple-near-map/temple-near-map.component';
import { LocationTracker } from 'src/app/services/location-tracker';

declare var google: any;

@Component({
  selector: 'app-temples-map',
  templateUrl: './temples-map.component.html',
  styleUrls: ['./temples-map.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class TemplesMapComponent implements AfterViewInit {
    map: any;
     currentZoomLevel = 15;
     markers: any[] = [];
     userMarker: any;
   activeInfoWindow: any = null;

    userLocation: { latitude: number; longitude: number } | null = null;
  templeList: any[] = [];
     constructor(private http: HttpClient, private modalCtrl: ModalController,private anadanamService: Ayyappatemplelist,private locationTracker: LocationTracker
     ) {}
   
ngAfterViewInit() {
  setTimeout(() => {
    this.initMap();
  }, 300);
}

ionViewDidEnter() {
  this.locationTracker.startTracking('temple');
}

ionViewWillLeave() {
  this.locationTracker.stopTracking();
}

  initMap() {
   const mapEl = document.getElementById('map');
  if (!mapEl) {
    console.error('Map element missing');
    return;
  }

  this.map = new google.maps.Map(mapEl, {
    center: { lat: 12.9716, lng: 77.5946 },
    zoom: 15
  });

  console.log('Map initialized');

  console.log(
    'MAP SIZE:',
    document.getElementById('map')?.offsetWidth,
    document.getElementById('map')?.offsetHeight
  );

  // 👇 Load current location & markers
 this.loadTempleData();

  // Optional: Load user location marker
  this.loadUserLocation();
  }

 async loadUserLocation() {
    try {
    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true
    });

    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    this.map.setCenter({ lat, lng });

    // Add blue user marker
    this.userMarker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      title: "Your Location",
      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
    });

    console.log("User location:", lat, lng);

  } catch (e) {
    console.error("Location error:", e);
  }
  }
     
  
   
 
    async loadTempleData() {
     try {
       const res = await this.anadanamService.getTempleList();
       console.log("API RESPONSE =>", res);
   
       if (res?.errorCode == '200' && Array.isArray(res?.result)) {
         this.addMarkers(res.result);
       } else {
         console.warn("Invalid Response Format:", res);
       }
   
     } catch (err) {
       console.error("API Error:", err);
     }
   }
   
     addMarkers(locations: any[]) {
     locations.forEach(temple => {
       const position = {
         lat: parseFloat(temple.latitude),
         lng: parseFloat(temple.longitude)
       };
   
       const marker = new google.maps.Marker({
         position,
         map: this.map,
         title: temple.templeNameTelugu
       });
   
      const infoWindow = new google.maps.InfoWindow({
  content: `
    <div class="custom-card">

      <div class="card-inner">

        <div class="title">
          ${temple.templeName}
          
        </div>

        <div class="location">
          ${temple.location}
        </div>

        <div class="nav-row">
          <div class="nav-btn" onclick="window.startNavigation(${position.lat}, ${position.lng})">
            <span>Start Navigation</span>
            <img src="../../../assets/navigation_icon.png" />
          </div>
        </div>

      </div>

    </div>
  `
});
   
       marker.addListener('click', () => {
   
         // ❌ Old open info-window close చేయాలి
         if (this.activeInfoWindow) {
           this.activeInfoWindow.close();
         }
   
         // ✔️ New info-window open చేయండి
         infoWindow.open(this.map, marker);
   
         // ✔️ Save reference
         this.activeInfoWindow = infoWindow;
       });
   
       this.markers.push(marker);
     });
   
     (window as any).startNavigation = this.startNavigation.bind(this);
   }
   
     startNavigation(lat: number, lng: number) {
       const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
       window.open(url, '_system');
     }
   
     zoomIn() {
       this.currentZoomLevel++;
       this.map.setZoom(this.currentZoomLevel);
     }
   
     zoomOut() {
       this.currentZoomLevel--;
       this.map.setZoom(this.currentZoomLevel);
     }
   
     async openInfoDialog() {
               const modal = await this.modalCtrl.create({
                 component: TemplesMapComponent,
                 cssClass: 'alert-style-modal',   // ✅ must match exactly
                 backdropDismiss: true,
                 showBackdrop: true
               });
               await modal.present();
             }


              async displayNearByTemples() {
                console.log("USER LOCATION", this.userLocation);
  console.log("TEMPLES", this.templeList);
   if (!this.userLocation || !this.templeList?.length) return alert("Location or temple list not available.");

  const modal = await this.modalCtrl.create({
    component: TempleNearMapComponent,
    componentProps: {
      templeList: this.templeList,
      userLocation: this.userLocation
    },
    cssClass: 'alert-style-modal',
    backdropDismiss: true
  });

  await modal.present();
  }
}
