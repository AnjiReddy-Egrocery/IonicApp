import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { AlertController, IonicModule, ModalController, NavController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { Panchangam } from 'src/app/services/panchangam';

@Component({
  selector: 'app-panchangam',
  templateUrl: './panchangam.page.html',
  styleUrls: ['./panchangam.page.scss'],
  standalone: true,
    imports: [     
      IonicModule,      // ✅ required for all ion-* components
      FormsModule,      // ✅ required for [(ngModel)]
      CommonModule,
      RouterModule
    ]
})
export class PanchangamPage implements OnInit {
   selectedDate: string = ''; // YYYY-MM-DD for API
  displayDate: string = '';  // DD MMMM YYYY for UI
  panchangData: any;

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private panchangService: Panchangam
  ) { }

  ngOnInit() {
    const today = new Date();
    this.setDate(today);
    this.loadPanchang();
  }

  setDate(date: Date) {
    // Format for API
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    this.selectedDate = `${yyyy}-${mm}-${dd}`;

    // Display in Telugu
    this.displayDate = date.toLocaleDateString('te-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
async loadPanchang() {
  try {
    const res = await this.panchangService.getPanchang(this.selectedDate);

    if ((res.status || '').toLowerCase() === 'success') {

      this.panchangData = res.data?.data;   // <- FIXED
      console.log('✅ Panchang Data:', this.panchangData);

    } else {
      console.warn('⚠️ No Panchang data', res);
    }

  } catch (err) {
    console.error('❌ Failed to fetch Panchang', err);
  }
}
  prevDate() {
    const date = new Date(this.selectedDate);
    date.setDate(date.getDate() - 1);
    this.setDate(date);
    this.loadPanchang();
  }

  nextDate() {
    const date = new Date(this.selectedDate);
    date.setDate(date.getDate() + 1);
    this.setDate(date);
    this.loadPanchang();
  }

  formatTime(datetime: string): string {
    try {
      const date = new Date(datetime);
      return date.toLocaleTimeString('te-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return datetime;
    }
  }

  navigate(page: string) {
    this.router.navigate([`/${page}`]);
  }

  goToAnadanam() {
    this.router.navigate(['/anadanam']);
  }

  goToNityaPooja() {
    this.router.navigate(['/nityapooja']);
  }
}