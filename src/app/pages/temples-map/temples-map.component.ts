import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';


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

  constructor(private http: HttpClient, private router: Router) {}

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    const mapElement: HTMLElement = document.getElementById('map')!;
    this.map = new google.maps.Map(mapElement, {
      center: { lat: 17.385044, lng: 78.486671 }, // Hyderabad default
      zoom: this.currentZoomLevel,
    });

    this.loadTemples();
  }

  loadTemples() {
    const url = '/api/Temples/index';

  // If you need to send some data in the POST body
  const body = {}; // Replace with actual data if needed, or leave empty

  this.http.post<any>(url, body).subscribe(res => {
    if (res.errorCode === '200') {
      this.addMarkers(res.result);
    }
  });
}
   

  addMarkers(temples: any[]) {
    temples.forEach((temple) => {
      const position = {
        lat: parseFloat(temple.latitude),
        lng: parseFloat(temple.longitude),
      };

      // Create a container for custom marker content
      const markerDiv = document.createElement('div');
      markerDiv.className = 'custom-marker';
      markerDiv.innerHTML = `
        <img src="https://www.ayyappatelugu.com/public/assets/img/temple_images/${temple.image}" style="width:40px;height:40px;border-radius:50%;border:2px solid #fff;" />
      `;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position,
        map: this.map,
        title: temple.templeName,
        content: markerDiv,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div>
            <h4>${temple.templeName}</h4>
            <p>${temple.location}</p>
            <button id="nav-${temple.latitude}-${temple.longitude}">Start Navigation</button>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
        // Attach navigation button listener
        setTimeout(() => {
          const btn = document.getElementById(`nav-${temple.latitude}-${temple.longitude}`);
          btn?.addEventListener('click', () => this.startNavigation(position.lat, position.lng));
        }, 0);
      });

      this.markers.push(marker);
    });
  }

  startNavigation(lat: number, lng: number) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_system'); // Opens Google Maps app or browser
  }

  zoomIn() {
    this.currentZoomLevel++;
    this.map.setZoom(this.currentZoomLevel);
  }

  zoomOut() {
    this.currentZoomLevel--;
    this.map.setZoom(this.currentZoomLevel);
  }
}