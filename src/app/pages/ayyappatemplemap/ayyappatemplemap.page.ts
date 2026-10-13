import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { Templelist } from 'src/app/services/templelist';
import { TemplesMapComponent } from '../temples-map/temples-map.component';
import { Geolocation } from '@capacitor/geolocation';
import { LocationTracker } from 'src/app/services/location-tracker';

declare var google: any;

// Height of the default Google marker pin (px). The info card sits just above it.
// (Android: MARKER_HEIGHT_DP = 40; tune if the card is too high / too low.)
const MARKER_H = 43;

@Component({
  selector: 'app-ayyappatemples-map',
  templateUrl: './ayyappatemplemap.page.html',
  styleUrls: ['./ayyappatemplemap.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicModule]
})
export class AyyappatemplemapPage implements AfterViewInit {

  map: any;
  currentZoomLevel = 15;
  markers: any[] = [];
  userMarker: any;

  // ---------- Find Nearest Temples ----------
  templeList: any[] = [];                 // all temples from the API
  userLat: number | null = null;
  userLng: number | null = null;
  showNearby = false;                     // dialog open / closed
  radiusOptions = [5, 10, 20];            // km
  selectedRadius = 10;                    // default 10 km (same as Android)
  nearbyTemples: any[] = [];              // filtered list shown in the dialog

  private cardOverlay: any = null;        // the floating info card
  private selectedMarker: any = null;
  private CardOverlayClass: any = null;

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController,
    private anadanamService: Templelist,
    private locationTracker: LocationTracker,
    private toastCtrl: ToastController
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
    }, 300);
  }

  ionViewDidEnter() {
    this.locationTracker.startTracking('ayyappa');
  }

  ionViewWillLeave() {
    this.locationTracker.stopTracking();
    this.hideCard();
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

    // Tapping anywhere else on the map closes the card
    this.map.addListener('click', () => this.hideCard());
    this.map.addListener('zoom_changed', () => {
      this.currentZoomLevel = this.map.getZoom() ?? this.currentZoomLevel;
    });

    // 👇 Load markers + user location
    this.loadTempleData();
    this.loadUserLocation();
  }

  async loadUserLocation() {
    try {
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true
      });

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      this.userLat = lat;
      this.userLng = lng;
      this.map.setCenter({ lat, lng });

      // blue user marker
      this.userMarker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map,
        title: 'Your Location',
        icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });

    } catch (e) {
      console.error('Location error:', e);
    }
  }

  async loadTempleData() {
    try {
      const res = await this.anadanamService.getTempleList();
      console.log('API RESPONSE =>', res);

      if (res?.errorCode == '200' && Array.isArray(res?.result)) {
        this.templeList = res.result;
        this.addMarkers(res.result);
      } else {
        console.warn('Invalid Response Format:', res);
      }

    } catch (err) {
      console.error('API Error:', err);
    }
  }

  // ============ MARKERS (default Google red pin, same as Android) ============
  addMarkers(locations: any[]) {
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];
    this.hideCard();

    locations.forEach(temple => {
      const lat = parseFloat(temple.latitude);
      const lng = parseFloat(temple.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map,
        title: temple.templeNameTelugu || temple.templeName
      });

      marker.addListener('click', () => this.showCard(marker, temple));
      this.markers.push(marker);
    });
  }

  // ============ INFO CARD (same design as custom_temple_window.xml) ============
  private showCard(marker: any, temple: any) {
    this.hideCard();
    this.selectedMarker = marker;

    const card = this.buildCard(marker, temple);
    const Overlay = this.getCardOverlayClass();
    this.cardOverlay = new Overlay(marker.getPosition(), card);
    this.cardOverlay.setMap(this.map);

    // After the card is placed, scroll the map so (card + pin) is centered on screen
    setTimeout(() => this.centerMarkerWithCard(), 80);
  }

  private hideCard() {
    if (this.cardOverlay) {
      this.cardOverlay.setMap(null);
      this.cardOverlay = null;
    }
    this.selectedMarker = null;
  }

  private centerMarkerWithCard() {
    if (!this.cardOverlay || !this.selectedMarker) return;
    const proj = this.cardOverlay.getProjection();
    if (!proj) return;

    const mapDiv: HTMLElement = this.map.getDiv();
    const px = proj.fromLatLngToContainerPixel(this.selectedMarker.getPosition());
    const blockHeight = MARKER_H + this.cardOverlay.div.offsetHeight;

    const targetX = mapDiv.offsetWidth / 2;
    const targetY = mapDiv.offsetHeight / 2 + blockHeight / 2;   // marker tip position

    this.map.panBy(px.x - targetX, px.y - targetY);
  }

  private buildCard(marker: any, temple: any): HTMLDivElement {
    const el = (tag: string, cls?: string, text?: string) => {
      const e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text !== undefined) e.textContent = text;   // textContent = safe for API data
      return e;
    };

    const card = el('div', 'tp-card') as HTMLDivElement;
    const body = el('div', 'tp-body');

    // title + close
    const head = el('div', 'tp-head');
    head.appendChild(el('div', 'tp-title', temple.templeNameTelugu || temple.templeName || ''));
    const close = el('button', 'tp-close') as HTMLButtonElement;
    close.type = 'button';
    close.setAttribute('aria-label', 'Close');
    close.innerHTML =
      '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#555" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
    close.addEventListener('click', () => this.hideCard());
    head.appendChild(close);
    body.appendChild(head);

    // location
    body.appendChild(el('div', 'tp-loc', temple.location || ''));

    // Start Navigation button (bottom right)
    const navRow = el('div', 'tp-nav-row');
    const nav = el('div', 'tp-nav-btn');
    nav.appendChild(el('span', undefined, 'Start Navigation'));
    const img = document.createElement('img');
    img.src = 'assets/navigation_icon.png';
    img.alt = '';
    nav.appendChild(img);
    nav.addEventListener('click', () => {
      const pos = marker.getPosition();
      this.startNavigation(pos.lat(), pos.lng());
    });
    navRow.appendChild(nav);
    body.appendChild(navRow);

    card.appendChild(body);
    return card;
  }

  // Overlay that keeps the card glued above the marker while the map moves / zooms
  private getCardOverlayClass(): any {
    if (this.CardOverlayClass) return this.CardOverlayClass;
    const self = this;

    class CardOverlay extends google.maps.OverlayView {
      position: any;
      div: HTMLDivElement;

      constructor(position: any, div: HTMLDivElement) {
        super();
        this.position = position;
        this.div = div;
      }

      onAdd() {
        this.div.style.position = 'absolute';
        (this as any).getPanes().overlayMouseTarget.appendChild(this.div);
        // taps / drags on the card must not reach the map (it would close the card)
        google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.div);
      }

      draw() {
        const proj = (this as any).getProjection();
        if (!proj) return;

        const divPx = proj.fromLatLngToDivPixel(this.position);
        const contPx = proj.fromLatLngToContainerPixel(this.position);
        const w = this.div.offsetWidth;
        const h = this.div.offsetHeight;

        // centered over the marker, but kept fully inside the screen (8px edge)
        const mapW: number = self.map.getDiv().offsetWidth;
        const edge = 8;
        let x = contPx.x - w / 2;
        x = Math.max(edge, Math.min(x, mapW - w - edge));

        this.div.style.left = (divPx.x - contPx.x + x) + 'px';
        this.div.style.top = (divPx.y - MARKER_H - h) + 'px';   // card bottom = top of pin
      }

      onRemove() {
        this.div.parentNode?.removeChild(this.div);
      }
    }

    this.CardOverlayClass = CardOverlay;
    return CardOverlay;
  }

  // ============ FIND NEAREST TEMPLES (same flow as Android MapsFragment) ============
  private readonly EXCLUDED_LOCATIONS = ['ayyappa', 'kothur', 'barunagar', 'savithribhai', 'polla'];

  /** distance in km between user and temple (haversine) */
  private distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const toRad = (d: number) => d * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  private filterTemplesByRadius(radiusKm: number): any[] {
    if (this.userLat == null || this.userLng == null) return [];
    const out: any[] = [];

    for (const temple of this.templeList) {
      // skip unnamed temples and the excluded locations (same as Android)
      const nameTe = (temple.templeNameTelugu || '').trim();
      const loc = (temple.location || '').trim().toLowerCase();
      if (!nameTe || this.EXCLUDED_LOCATIONS.includes(loc)) continue;

      const lat = parseFloat(temple.latitude);
      const lng = parseFloat(temple.longitude);
      if (isNaN(lat) || isNaN(lng)) continue;

      const d = this.distanceKm(this.userLat, this.userLng, lat, lng);
      if (d <= radiusKm) {
        out.push({ ...temple, lat, lng, distanceKm: d });
      }
    }
    return out.sort((a, b) => a.distanceKm - b.distanceKm);   // nearest first
  }

  async findNearestTemples() {
    this.hideCard();

    // get location if we don't have it yet
    if (this.userLat == null || this.userLng == null) {
      await this.loadUserLocation();
    }
    if (this.userLat == null || !this.templeList.length) {
      this.showToast('Location or temple list not available.');
      return;
    }

    this.selectedRadius = 10;                                   // default 10 km
    const list = this.filterTemplesByRadius(this.selectedRadius);
    if (!list.length) {
      this.showToast('No temples found within 10 km.');
      return;
    }
    this.nearbyTemples = list;
    this.showNearby = true;
  }

  selectRadius(km: number) {
    this.selectedRadius = km;
    this.nearbyTemples = this.filterTemplesByRadius(km);
  }

  closeNearby() {
    this.showNearby = false;
  }

  navigateToTemple(temple: any) {
    this.startNavigation(temple.lat, temple.lng);
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, position: 'bottom' });
    await toast.present();
  }

  // ============ NAVIGATION / ZOOM ============
  startNavigation(lat: number, lng: number) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_system');
  }

  zoomIn() {
    this.map.setZoom((this.map.getZoom() ?? this.currentZoomLevel) + 1);
  }

  zoomOut() {
    this.map.setZoom((this.map.getZoom() ?? this.currentZoomLevel) - 1);
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
