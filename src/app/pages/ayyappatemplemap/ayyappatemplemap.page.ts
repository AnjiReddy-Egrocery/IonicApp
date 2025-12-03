import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { IonicModule, ModalController } from '@ionic/angular';
import { Templelist } from 'src/app/services/templelist';
import { TemplesMapComponent } from '../temples-map/temples-map.component';
import { Geolocation } from '@capacitor/geolocation';


declare var google: any;

@Component({
  selector: 'app-ayyappatemples-map',
  templateUrl: './ayyappatemplemap.page.html',
  styleUrls: ['./ayyappatemplemap.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicModule ]
})
export class AyyappatemplemapPage implements AfterViewInit {

   map: any;
     currentZoomLevel = 15;
     markers: any[] = [];
     userMarker: any;
   activeInfoWindow: any = null;
     constructor(private http: HttpClient, private modalCtrl: ModalController,private anadanamService: Templelist,
     ) {}
   
ngAfterViewInit() {
  setTimeout(() => {
    this.initMap();
  }, 300);
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
           <div class="info-window-container">
             <h4>${temple.templeName}</h4>
             <p>${temple.location}</p>
             <div class="navigation-button" onclick="window.startNavigation(${position.lat}, ${position.lng})">
               <span>Start Navigation</span>
               <img src="assets/navigation_icon.png" />
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
     
   
   }
  

   