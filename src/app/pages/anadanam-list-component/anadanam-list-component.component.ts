import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, MenuController, ModalController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { PinchZoomComponent } from 'src/app/components/pinch-zoom/pinch-zoom.component';
import { Anadanam } from 'src/app/services/anadanam';

const CACHE_KEY = 'ayyappa_anadanam_list';   // Android SharedPreferences equivalent

@Component({
  selector: 'app-anadanam-list-component',
  templateUrl: './anadanam-list-component.component.html',
  styleUrls: ['./anadanam-list-component.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, PinchZoomComponent]
})
export class AnadanamListComponentComponent implements OnInit {

  templeList: any[] = [];
  filteredList: any[] = [];
  searchQuery: string = '';

  // Current user location (null aite distance chupinchadu)
  private userLat: number | null = null;
  private userLng: number | null = null;

  constructor(
    private router: Router,
    private service: Anadanam,
    private modalCtrl: ModalController,
    private menu: MenuController
  ) {}

  async ngOnInit() {
    // Android: location init data load ki mundu
    this.getUserLocation();
    this.loadCachedList();          // cache undhi aite mundu chupinchu
    this.loadAnadanamList();
  }

  // ================= LOCATION =================

  async getUserLocation() {
    try {
      const perm = await Geolocation.checkPermissions();
      if (perm.location !== 'granted' && perm.coarseLocation !== 'granted') {
        const req = await Geolocation.requestPermissions();
        if (req.location !== 'granted' && req.coarseLocation !== 'granted') return;
      }

      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: false,     // PRIORITY_BALANCED_POWER_ACCURACY
        timeout: 8000,
        maximumAge: 60000              // setMaxUpdateAgeMillis(60_000)
      });

      this.userLat = pos.coords.latitude;
      this.userLng = pos.coords.longitude;
      this.updateDistances();          // adapter.setUserLocation() equivalent
    } catch (err) {
      console.warn('Location not available', err);
    }
  }

  /** Location.distanceBetween equivalent (meters) */
  private distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000;
    const toRad = (d: number) => d * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private formatDistance(meters: number): string {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  }

  private parseCoordinate(v: any): number | null {
    if (v === null || v === undefined || String(v).trim() === '') return null;
    const n = parseFloat(String(v).trim());
    return isNaN(n) ? null : n;
  }

  /** prathi item ki lat/lng parse chesi, distance text set chestundi */
  private updateDistances() {
    this.templeList.forEach(item => {
      const lat = this.parseCoordinate(item.latitude);
      const lng = this.parseCoordinate(item.longitude);

      item._lat = lat;
      item._lng = lng;
      item._hasCoords = lat !== null && lng !== null;   // false aite direction hide

      if (item._hasCoords && this.userLat !== null && this.userLng !== null) {
        item._distance = this.formatDistance(
          this.distanceMeters(this.userLat, this.userLng, lat!, lng!)
        );
      } else {
        item._distance = '';                            // distance hide
      }
    });
  }

  /** Map info card la: Telugu name + ", " + locationenglish (http aite skip) */
  private buildTitle(item: any): string {
    const base: string = item.annadhanamNameTelugu || item.annadhanamName || '';
    const locEn = String(item.locationenglish || '').trim();
    if (locEn && !locEn.startsWith('http')) {
      return base + ', ' + locEn;
    }
    return base;
  }

  // ================= DATA =================

  private loadCachedList() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return;
      const cached = JSON.parse(raw);
      if (Array.isArray(cached) && cached.length) {
        this.setList(cached);
      }
    } catch { /* ignore */ }
  }

  private setList(list: any[]) {
    list.forEach(item => item._title = this.buildTitle(item));
    this.templeList = list;
    this.updateDistances();
    this.applyFilter(this.searchQuery);
  }

  async loadAnadanamList() {
    try {
      const res = await this.service.getMapList();

      if (res?.errorCode === '200' && Array.isArray(res?.result)) {
        const data: any[] = res.result;
        this.setList(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));   // save cache
      } else {
        console.warn('⚠️ No temple data found', res);
      }
    } catch (err) {
      console.error('❌ Error loading temples:', err);
      // onFailure: cached list already loaded, so just keep it
      if (!this.templeList.length) this.loadCachedList();
    }
  }

  // ================= SEARCH =================

  filterResults(event: any) {
    this.searchQuery = event?.target?.value ?? '';
    this.applyFilter(this.searchQuery);
  }

  private applyFilter(q: string) {
    const query = (q || '').toLowerCase().trim();
    if (!query) {
      this.filteredList = [...this.templeList];
      return;
    }
    this.filteredList = this.templeList.filter(item => {
      const titleTelugu = (item.annadhanamNameTelugu || '').toLowerCase();
      const titleEnglish = this.toEnglishTransliteration(item.annadhanamName || '').toLowerCase();
      const locationEnglish = String(item.locationenglish || '').toLowerCase();
      return titleTelugu.includes(query) ||
             titleEnglish.includes(query) ||
             locationEnglish.includes(query);
    });
  }

  // Full Telugu → English transliteration (original code)
  toEnglishTransliteration(text: string): string {
    const consonants: any = {
      'క':'k','ఖ':'kh','గ':'g','ఘ':'gh','ఙ':'ng',
      'చ':'ch','ఛ':'chh','జ':'j','ఝ':'jh','ఞ':'ny',
      'ట':'t','ఠ':'th','డ':'d','ఢ':'dh','ణ':'n',
      'త':'t','థ':'th','ద':'d','ధ':'dh','న':'n',
      'ప':'p','ఫ':'ph','బ':'b','భ':'bh','మ':'m',
      'య':'y','ర':'r','ల':'l','వ':'v','శ':'sh',
      'ష':'sh','స':'s','హ':'h','ళ':'l','ఱ':'r'
    };

    const vowels: any = {
      'అ':'a','ఆ':'aa','ఇ':'i','ఈ':'ii','ఉ':'u','ఊ':'uu',
      'ఋ':'ru','ఎ':'e','ఏ':'ee','ఐ':'ai','ఒ':'o','ఓ':'oo','ఔ':'au',
      'ం':'m','ః':'h'
    };

    const vowelSigns: any = {
      'ా':'aa','ి':'i','ీ':'ii','ు':'u','ూ':'uu',
      'ె':'e','ే':'ee','ై':'ai','ొ':'o','ో':'oo','ౌ':'au',
      '్':'' // virama removes implicit 'a'
    };

    let result = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (consonants[ch]) result += consonants[ch] + 'a'; // implicit 'a'
      else if (vowels[ch]) result += vowels[ch];
      else if (vowelSigns[ch]) result = result.slice(0, -1) + vowelSigns[ch]; // replace implicit 'a'
      else result += ch; // punctuation / space
    }
    return result;
  }

  // ================= ACTIONS =================

  async refreshList(event: any) {
    await Promise.all([this.getUserLocation(), this.loadAnadanamList()]);  // location kuda refresh
    event.target.complete();
  }

  openDetails(item: any) {
    this.router.navigate(['/ayyappaanadanamlistdetails'], {
      queryParams: { annadhanamId: item.annadhanamId }
    });
  }

  /** Get Direction -> Google Maps navigation */
  startNavigation(event: Event, item: any) {
    event.stopPropagation();    // item click (details) trigger kakunda
    if (!item._hasCoords) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${item._lat},${item._lng}`;
    window.open(url, '_system');
  }
}
