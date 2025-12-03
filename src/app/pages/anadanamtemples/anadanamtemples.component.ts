import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Geolocation } from '@capacitor/geolocation';
import { AnadanamDialogComponent } from 'src/app/components/anadanam-dialog/anadanam-dialog.component';
import { Anadanam } from 'src/app/services/anadanam';

declare var google: any;

@Component({
  selector: 'app-anadanamtemples',
  templateUrl: './anadanamtemples.component.html',
  styleUrls: ['./anadanamtemples.component.scss'],
  standalone: true,
  imports: [     
    IonicModule,      // ✅ required for all ion-* components
    FormsModule,      // ✅ required for [(ngModel)]
    CommonModule,
  ]
})
export class AnadanamtemplesComponent  implements AfterViewInit {
  map: any;
  currentZoomLevel = 15;
  markers: any[] = [];
  userMarker: any;
activeInfoWindow: any = null;
  constructor(private http: HttpClient, private modalCtrl: ModalController,private anadanamService: Anadanam,
  ) {}

  ngAfterViewInit() {
    this.initMapFirst(); 
    this.loadMap();
  }

  initMapFirst() {
 const mapElement = document.getElementById('map')!;

  this.map = new google.maps.Map(mapElement, {
    center: { lat: 20.5937, lng: 78.9629 }, // India center
    zoom: this.currentZoomLevel,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false
  });
}

  async loadMap() {
    this.getUserLocation();   // loads GPS
  this.loadTempleData();    // loads markers
  }
 
 
 async getUserLocation() {
    try {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 4000
    });

    const lat = coordinates.coords.latitude;
    const lng = coordinates.coords.longitude;

    this.map.setCenter({ lat, lng });

    this.userMarker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
    });

  } catch (err) {
    console.warn("GPS Not available");
  }
  }
 async loadTempleData() {
  try {
    const res = await this.anadanamService.getMapList();
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
      title: temple.annadhanamNameTelugu
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="info-window-container">
          <h4>${temple.annadhanamNameTelugu}</h4>
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
              component: AnadanamDialogComponent,
              cssClass: 'alert-style-modal',   // ✅ must match exactly
              backdropDismiss: true,
              showBackdrop: true
            });
            await modal.present();
          }
  

}