import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

interface Temple {
  templeName: string;
  templeNameTelugu: string;
  location: string;
  latitude: string;
  longitude: string;
}


declare var google: any;

@Component({
  selector: 'app-temple-near-map',
  templateUrl: './temple-near-map.component.html',
  styleUrls: ['./temple-near-map.component.scss'],
   standalone: true,
  imports: [IonicModule, CommonModule,  FormsModule],
})
export class TempleNearMapComponent  implements OnInit {
@Input() templeList: Temple[] = [];
  @Input() userLocation!: { lat: number; lng: number };

  selectedRadius = 10000; // default 10km
  filteredTemples: Temple[] = [];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.filterTemples();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  filterTemples() {
    this.filteredTemples = this.templeList.filter((temple) => {
      try {
        const templeLat = parseFloat(temple.latitude);
        const templeLng = parseFloat(temple.longitude);
        const results = new Float32Array(1);
        google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(this.userLocation.lat, this.userLocation.lng),
          new google.maps.LatLng(templeLat, templeLng)
        );
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(this.userLocation.lat, this.userLocation.lng),
          new google.maps.LatLng(templeLat, templeLng)
        );
        return distance <= this.selectedRadius;
      } catch {
        return false;
      }
    });
  }

  changeRadius(radius: number) {
    this.selectedRadius = radius;
    this.filterTemples();
  }

  startNavigation(lat: string, lng: string) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_system');
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
