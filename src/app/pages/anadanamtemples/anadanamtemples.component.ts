import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Geolocation } from '@capacitor/geolocation';
import { AnadanamDialogComponent } from 'src/app/components/anadanam-dialog/anadanam-dialog.component';

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

  constructor(private http: HttpClient, private modalCtrl: ModalController) {}

  ngAfterViewInit() {
    this.loadMap();
  }

  async loadMap() {
  const mapElement: HTMLElement = document.getElementById('map')!;

  try {
    // Get device current location
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000, // increase timeout, 1 second is usually too low
      maximumAge: 0
    });

    const lat = coordinates.coords.latitude;
    const lng = coordinates.coords.longitude;

    this.map = new google.maps.Map(mapElement, {
      center: { lat, lng },
      zoom: this.currentZoomLevel,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false
    });

    // Add user marker
    this.userMarker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      title: 'You are here',
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });

    this.loadTempleData();

  } catch (err) {
    console.error('Could not get current location:', err);
    // Optionally show a message to user
  }
}
  loadTempleData() {
   const url = '/api/annadhanams/index';

  // If you need to send some data in the POST body
  const body = {}; // Replace with actual data if needed, or leave empty

  this.http.post<any>(url, body).subscribe(res => {
    if (res.errorCode === '200') {
      this.addMarkers(res.result);
    }
  });
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

      marker.addListener('click', () => infoWindow.open(this.map, marker));

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