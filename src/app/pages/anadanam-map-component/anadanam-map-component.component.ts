import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { AnadanamDialogComponent } from 'src/app/components/anadanam-dialog/anadanam-dialog.component';
import { Anadanam } from 'src/app/services/anadanam';
import { LocationTracker } from 'src/app/services/location-tracker';

declare var google: any;

// Marker pin size (px). The info card sits just above the pin.
const MARKER_W = 32;
const MARKER_H = 42;

// Android colors for the time text (Color.GREEN / Color.RED)
const COLOR_GREEN = '#00FF00';
const COLOR_RED = '#FF0000';

// Android SharedPreferences equivalents
const ZOOM_KEY = 'anadanam_map_zoom';      // SharedPreferenceHelper.setZoomLevel
const CACHE_KEY = 'anadanam_map_cache';    // SharedPreferenceHelper.saveTempleData

@Component({
  selector: 'app-anadanam-map-component',
  templateUrl: './anadanam-map-component.component.html',
  styleUrls: ['./anadanam-map-component.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
  ]
})
export class AnadanamMapComponentComponent implements AfterViewInit, OnDestroy {
  map: any;
  currentZoomLevel = 15;
  markers: any[] = [];
  userMarker: any;

  private locations: any[] = [];          // last API data (used to re-evaluate colors)
  private cardOverlay: any = null;        // the floating info card
  private selectedMarker: any = null;
  private CardOverlayClass: any = null;

  // user location (for the "Distance : ..." row)
  private userLat: number | null = null;
  private userLng: number | null = null;
  private distanceEl: HTMLElement | null = null;

  // Android: getArguments().getString("TEMPLE_ID")
  private selectedTempleId: string | null = null;

  // If you copy marker_green.png / marker_red.png from Android into src/assets,
  // put their paths here (e.g. 'assets/marker_green.png'). Empty = built-in SVG pins.
  private readonly MARKER_PNG = { green: '', red: '' };

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController,
    private anadanamService: Anadanam,
    private locationTracker: LocationTracker,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit() {
    // Query param name ni mee routing ki taggattu marchandi
    this.selectedTempleId = this.route.snapshot.queryParamMap.get('templeId');

    // Android: SharedPreferenceHelper.getZoomLevel()
    const savedZoom = parseFloat(localStorage.getItem(ZOOM_KEY) || '');
    if (!isNaN(savedZoom)) this.currentZoomLevel = savedZoom;

    this.initMapFirst();
    this.loadMap();
    this.locationTracker.startTracking('annadanam');
  }

  ionViewDidEnter() {
    this.locationTracker.startTracking('annadanam');
    // Android onResume: re-evaluate green/red when user comes back (date may have changed)
    if (this.map && this.locations.length) {
      this.addMarkers(this.locations);
    }
  }

  ionViewWillLeave() {
    this.locationTracker.stopTracking();
  }

  ngOnDestroy() {
    this.locationTracker.stopTracking();
    this.hideCard();
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

    // Tapping anywhere else on the map closes the card
    this.map.addListener('click', () => this.hideCard());

    // Android: setOnCameraIdleListener -> save zoom
    this.map.addListener('idle', () => {
      this.currentZoomLevel = this.map.getZoom() ?? this.currentZoomLevel;
      localStorage.setItem(ZOOM_KEY, String(this.currentZoomLevel));
    });
  }

  async loadMap() {
    this.getUserLocation();     // loads GPS
    this.loadAnadanamList();    // loads markers
  }

  async getUserLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 4000
      });

      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;
      this.userLat = lat;
      this.userLng = lng;

      // selected temple unte map center marchakudadu
      if (!this.selectedTempleId) {
        this.map.setCenter({ lat, lng });
      }

      if (this.userMarker) this.userMarker.setMap(null);
      this.userMarker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map,
        icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });

      // card already open aite distance update
      if (this.selectedMarker) this.updateDistance(this.selectedMarker);

    } catch (err) {
      console.warn('GPS Not available');
    }
  }

  async loadAnadanamList() {
    // 1) Show cached data immediately (fast), if we have any
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      const cached = raw ? JSON.parse(raw) : null;
      if (Array.isArray(cached) && cached.length) {
        this.locations = cached;
        setTimeout(() => this.addMarkers(cached), 200);
      }
    } catch { /* ignore */ }

    // 2) ALWAYS refresh from the API, so API changes reach the app
     try {
      const res = await this.anadanamService.getMapList();
      console.log('API RESPONSE =>', res);

      if (res?.errorCode == '200' && Array.isArray(res?.result)) {
        const data: any[] = res.result;          // <-- local const, closure lo type safe

        localStorage.setItem(CACHE_KEY, JSON.stringify(data));   // update cache
        this.locations = data;
        setTimeout(() => this.addMarkers(data), 200);
      } else {
        console.warn('Invalid Response Format:', res);
      }

    } catch (err) {
      // No internet: keep showing the cached markers
      console.error('API Error:', err);
    }
  }

  // ============ MARKERS: GREEN / RED BY DATE RANGE (same as Android) ============
  addMarkers(locations: any[]) {
    // like mMap.clear()
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];
    this.hideCard();

    locations.forEach(temple => {
      const lat = parseFloat(temple.latitude);
      const lng = parseFloat(temple.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      // Marker color depends on the DATE range only (time of day is not checked here)
      const isActive = this.isDateActive(temple.startingDate, temple.endingDate);

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map,
        title: temple.annadhanamNameTelugu,
        icon: this.pinIcon(isActive)
      });

      marker.addListener('click', () => this.showCard(marker, temple, isActive));
      this.markers.push(marker);

      // Android: selectedTempleId match aite card open + zoom 18
      if (this.selectedTempleId && String(temple.annadhanamId) === String(this.selectedTempleId)) {
        this.map.setZoom(18);
        this.map.setCenter({ lat, lng });
        this.showCard(marker, temple, isActive);
      }
    });
  }

  private pinIcon(active: boolean): any {
    const size = new google.maps.Size(MARKER_W, MARKER_H);
    const anchor = new google.maps.Point(MARKER_W / 2, MARKER_H);   // pin tip = bottom center

    const png = active ? this.MARKER_PNG.green : this.MARKER_PNG.red;
    if (png) {
      return { url: png, scaledSize: size, anchor };
    }

    const fill = active ? '#2EAE3F' : '#E53935';
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${MARKER_W}" height="${MARKER_H}" viewBox="0 0 40 52">` +
      `<path d="M20 1C9.5 1 1 9.5 1 20c0 14 19 31 19 31s19-17 19-31C39 9.5 30.5 1 20 1z" fill="${fill}" stroke="#fff" stroke-width="2"/>` +
      `<circle cx="20" cy="20" r="7" fill="#fff"/></svg>`;
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
      scaledSize: size,
      anchor
    };
  }

  // ============ INFO CARD (same design as custom_info_window.xml) ============
  private showCard(marker: any, temple: any, isActive: boolean) {
    this.hideCard();
    this.selectedMarker = marker;

    const card = this.buildCard(marker, temple, isActive);
    const Overlay = this.getCardOverlayClass();
    this.cardOverlay = new Overlay(marker.getPosition(), card);
    this.cardOverlay.setMap(this.map);

    // Android: updateDistance() + refreshUserLocation()
    this.updateDistance(marker);
    this.refreshUserLocation(marker);

    // After the card is placed, scroll the map so (card + pin) is centered on screen
    setTimeout(() => this.centerMarkerWithCard(), 80);
  }

  private hideCard() {
    if (this.cardOverlay) {
      this.cardOverlay.setMap(null);
      this.cardOverlay = null;
    }
    this.selectedMarker = null;
    this.distanceEl = null;
  }

  /** card open ayinappudu fresh location techukuni distance update */
  private async refreshUserLocation(marker: any) {
    try {
      const c = await Geolocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 4000,
        maximumAge: 60000
      });
      this.userLat = c.coords.latitude;
      this.userLng = c.coords.longitude;
      if (this.selectedMarker === marker) this.updateDistance(marker);
    } catch { /* location ledu -> distance hidden */ }
  }

  /** Android updateDistance(): "Distance : 120 m" / "Distance : 3.4 km" */
  private updateDistance(marker: any) {
    const el = this.distanceEl;
    if (!el) return;

    if (this.userLat === null || this.userLng === null || !marker) {
      el.style.display = 'none';
      return;
    }

    const pos = marker.getPosition();
    const meters = this.haversine(this.userLat, this.userLng, pos.lat(), pos.lng());

    el.textContent = 'Distance : ' +
      (meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`);
    el.style.display = '';
  }

  /** Location.distanceBetween equivalent (meters) */
  private haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000;
    const r = (d: number) => d * Math.PI / 180;
    const a = Math.sin(r(lat2 - lat1) / 2) ** 2 +
      Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lng2 - lng1) / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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

  private buildCard(marker: any, temple: any, isActive: boolean): HTMLDivElement {
    const el = (tag: string, cls?: string, text?: string) => {
      const e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text !== undefined) e.textContent = text;   // textContent = safe for API data
      return e;
    };

    const card = el('div', 'an-card') as HTMLDivElement;
    const body = el('div', 'an-body');

    // title = Telugu name + ", " + locationenglish (Android bindInfoCard)
    let titleText: string = temple.annadhanamNameTelugu || '';
    const locEn = String(temple.locationenglish || '').trim();
    if (locEn && !locEn.startsWith('http')) {
      titleText = titleText + ', ' + locEn;
    }

    // title + close
    const head = el('div', 'an-head');
    head.appendChild(el('div', 'an-title', titleText));
    const close = el('button', 'an-close') as HTMLButtonElement;
    close.type = 'button';
    close.setAttribute('aria-label', 'Close');
    close.innerHTML =
      '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#555" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
    close.addEventListener('click', () => this.hideCard());
    head.appendChild(close);
    body.appendChild(head);

    // (separate location row Android lo ledu, anduke teesesam)

    // Distance row (info_distance) - location unte matrame chupistundi
    this.distanceEl = el('div', 'an-distance');
    this.distanceEl.style.display = 'none';
    body.appendChild(this.distanceEl);

    // అన్నదానం సమయాలు
    body.appendChild(el('div', 'an-times-title', 'అన్నదానం సమయాలు'));

    const dateRow = el('div', 'an-row');
    dateRow.appendChild(el('div', 'an-cell an-cell-first', 'From : ' + this.formatDate(temple.startingDate)));
    dateRow.appendChild(el('div', 'an-cell', 'To : ' + this.formatDate(temple.endingDate)));
    body.appendChild(dateRow);

    // Time: oka row ("Time : 09:30 AM to 12:00 PM"), aa row matrame colored
    // RED marker -> always red. GREEN marker -> green only if now is inside start..end time
    const timeColor = isActive && this.isTimeInRange(temple.startTime, temple.endTime) ? COLOR_GREEN : COLOR_RED;

    const timeRow = el('div', 'an-row');
    const time = el(
      'div',
      'an-cell an-cell-first',
      'Time : ' + this.formatTime(temple.startTime) + ' to ' + this.formatTime(temple.endTime)
    );
    time.style.color = timeColor;
    timeRow.appendChild(time);
    body.appendChild(timeRow);

    // Start Navigation button (bottom right)
    const navRow = el('div', 'an-nav-row');
    const nav = el('div', 'an-nav-btn');
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

  // ============ DATE / TIME HELPERS (same logic as Android) ============

  /** unix seconds (10 digits) / millis (13 digits) / "yyyy-MM-dd" -> Date */
  private toDate(v: any): Date | null {
    if (v === null || v === undefined || v === '') return null;
    const s = String(v).trim();
    if (/^\d+$/.test(s)) {
      const n = parseInt(s, 10);
      return new Date(s.length <= 10 ? n * 1000 : n);
    }
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }

  /** start day 00:00:00 .. end day 23:59:59.999 */
  isDateActive(startDate: any, endDate: any): boolean {
    const start = this.toDate(startDate);
    const end = this.toDate(endDate);
    if (!start || !end) return false;

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const now = new Date();
    return now >= start && now <= end;
  }

  /** "HH:mm" or "HH:mm:ss" -> seconds since midnight */
  private timeToSeconds(t: any): number | null {
    if (!t) return null;
    const p = String(t).split(':').map(Number);
    if (p.length < 2 || p.some(isNaN)) return null;
    return p[0] * 3600 + p[1] * 60 + (p[2] || 0);
  }

  /** now is between start and end time (inclusive) */
  isTimeInRange(startTime: any, endTime: any): boolean {
    const s = this.timeToSeconds(startTime);
    const e = this.timeToSeconds(endTime);
    if (s === null || e === null) return false;

    const now = new Date();
    const nowSec = now.getHours() * 3600 + now.getMinutes() * 60;
    return nowSec >= s && nowSec <= e;
  }

  /** dd-MM-yyyy */
  formatDate(v: any): string {
    const d = this.toDate(v);
    if (!d) return String(v ?? '');
    const p = (n: number) => String(n).padStart(2, '0');
    return `${p(d.getDate())}-${p(d.getMonth() + 1)}-${d.getFullYear()}`;
  }

  /** hh:mm a  (e.g. 09:30 AM) */
  formatTime(t: any): string {
    const sec = this.timeToSeconds(t);
    if (sec === null) return String(t ?? '');
    const h24 = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const h12 = h24 % 12 || 12;
    const p = (n: number) => String(n).padStart(2, '0');
    return `${p(h12)}:${p(m)} ${h24 >= 12 ? 'PM' : 'AM'}`;
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
      component: AnadanamDialogComponent,
      cssClass: 'alert-style-modal',   // ✅ must match exactly
      backdropDismiss: true,
      showBackdrop: true
    });
    await modal.present();
  }
}
