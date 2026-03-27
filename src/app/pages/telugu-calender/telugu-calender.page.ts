import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AlertController, IonicModule, MenuController, NavController, Platform } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { Telugucalender } from 'src/app/services/telugucalender';
import { Keyboard } from '@capacitor/keyboard';

export interface PanchangDay {
  date?: string;
  data?: {
    data?: {
      vaara?: string;
      tithi?: { name: string }[];
      nakshatra?: { name: string }[];
      sunrise?: string;
      sunset?: string;
    };
  };
}


@Component({
  selector: 'app-telugu-calender',
  templateUrl: './telugu-calender.page.html',
  styleUrls: ['./telugu-calender.page.scss'],
 standalone: true,
    imports: [     
      IonicModule,      // ✅ required for all ion-* components
      FormsModule,      // ✅ required for [(ngModel)]
      CommonModule,
      RouterModule
    ]
})
export class TeluguCalenderPage implements OnInit {
 days: PanchangDay[] = [];
  displayMonth: number = 0;
  displayYear: number = 0;
  monthNames = ['జనవరి','ఫిబ్రవరి','మార్చి','ఏప్రిల్','మే','జూన్','జూలై','ఆగస్ట్','సెప్టెంబర్','అక్టోబర్','నవంబర్','డిసెంబర్'];

  constructor(
    private api: Telugucalender,
    private alertCtrl: AlertController,
    private platform: Platform,
    private router: Router,
    private menuCtrl: MenuController,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    await this.platform.ready();

    const now = new Date();
    this.displayMonth = now.getMonth() + 1;
    this.displayYear = now.getFullYear();
    await this.loadMonth(this.displayMonth, this.displayYear);
  }

  async loadMonth(month: number, year: number) {
    try {
      const res = await this.api.getAyyappaCalendar(month, year);
      if (res.status === 'success' && res.data) {
        const firstDate = new Date(year, month - 1, 1);
        const startOffset = firstDate.getDay();
        this.days = [];
        for (let i = 0; i < startOffset; i++) this.days.push({});
        this.days.push(...res.data);
      }
    } catch (err) {
      console.error('Failed to load month:', err);
    }
  }

  prevMonth() {
    this.displayMonth--;
    if (this.displayMonth < 1) { this.displayMonth = 12; this.displayYear--; }
    this.loadMonth(this.displayMonth, this.displayYear);
  }

  nextMonth() {
    this.displayMonth++;
    if (this.displayMonth > 12) { this.displayMonth = 1; this.displayYear++; }
    this.loadMonth(this.displayMonth, this.displayYear);
  }

  updateMonthTitle() {
    return `${this.monthNames[this.displayMonth - 1]} ${this.displayYear}`;
  }

  isToday(day?: string) {
    if (!day) return false;
    const today = new Date();
    const dayNum = Number(day.substring(8,10));
    return today.getDate() === dayNum &&
           today.getMonth() + 1 === this.displayMonth &&
           today.getFullYear() === this.displayYear;
  }

 isSunday(date?: string) {
  if (!date) return false;
  const d = new Date(date);
  return d.getDay() === 0;
}

  async showDayDialog(day: PanchangDay) {
    const data = day.data?.data;
    const alert = await this.alertCtrl.create({
      header: day.date,
      message: `
       వారం: ${data?.vaara || ''}
        తిథి: ${data?.tithi?.[0]?.name || ''}
        నక్షత్రం: ${data?.nakshatra?.[0]?.name || ''}
       సూర్యోదయం: ${data?.sunrise || ''}
      సూర్యాస్తమయం: ${data?.sunset || ''}
      `,
      buttons: ['Close']
    });
    await alert.present();
  }

  goHome() {
  this.menuCtrl.close().then(() => {
    this.navCtrl.navigateRoot('/swamy-dashboard'); // navigate and reset history
  });
}

  goToAnadanam() {
    this.router.navigate(['/anadanam']);
  }

  goToNityaPooja() {
    this.router.navigate(['/nityapooja']);
  }
}