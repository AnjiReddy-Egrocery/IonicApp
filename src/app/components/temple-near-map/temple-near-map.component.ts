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
@Input() templeList: any[] = [];
  @Input() userLocation: any;

  nearbyTemples: any[] = [];
  filteredTemples: any[] = [];
  selectedRadius: number = 10; // Default 10km
  isLoading: boolean = false;

  radiusOptions = [
    { value: 5, label: '5 KM' },
    { value: 10, label: '10 KM' },
    { value: 20, label: '20 KM' }
  ];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.filterNearbyTemples();
  }

  filterNearbyTemples() {
    this.isLoading = true;
    
    if (!this.userLocation || !this.templeList?.length) {
      this.nearbyTemples = [];
      this.filteredTemples = [];
      this.isLoading = false;
      return;
    }

    const radiusInMeters = this.selectedRadius * 1000;
    
    // Filter temples
    this.nearbyTemples = this.templeList.filter(temple => {
      // Skip invalid temples
      if (!temple.templeNameTelugu || temple.templeNameTelugu.trim() === '' ||
          temple.location?.toLowerCase() === 'ayyappa' ||
          temple.location?.toLowerCase() === 'kothur' ||
          temple.location?.toLowerCase() === 'barunagar' ||
          temple.location?.toLowerCase() === 'savithribhai' ||
          temple.location?.toLowerCase() === 'polla') {
        return false;
      }

      try {
        const templeLat = parseFloat(temple.latitude);
        const templeLng = parseFloat(temple.longitude);

        if (isNaN(templeLat) || isNaN(templeLng)) return false;

        const distance = this.calculateDistance(
          this.userLocation.lat,
          this.userLocation.lng,
          templeLat,
          templeLng
        );

        // Store distance in temple object for display
        temple.distance = distance;

        return distance <= radiusInMeters;
      } catch (e) {
        return false;
      }
    });

    // Sort by distance (nearest first)
    this.nearbyTemples.sort((a, b) => a.distance - b.distance);
    
    this.filteredTemples = [...this.nearbyTemples];
    this.isLoading = false;
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  }

  toRad(deg: number): number {
    return deg * (Math.PI/180);
  }

  onRadiusChange() {
    this.filterNearbyTemples();
  }

  navigateToTemple(lat: string, lng: string) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_system');
    this.closeModal();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  getDistanceText(temple: any): string {
    if (temple.distance) {
      return `~${temple.distance.toFixed(1)} KM away`;
    }
    return 'Distance not available';
  }
}