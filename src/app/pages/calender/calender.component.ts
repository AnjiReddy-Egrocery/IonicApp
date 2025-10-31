import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AlertController, IonicModule, ModalController, NavController, ToastController } from '@ionic/angular';
import { CalenderDialogComponent } from 'src/app/components/calender-dialog/calender-dialog.component';
import { InfoDialogComponent } from 'src/app/info-dialog/info-dialog.component';
import { Calender } from 'src/app/services/calender';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss'],
   standalone: true,
    imports: [     
      IonicModule,      // ✅ required for all ion-* components
      FormsModule,      // ✅ required for [(ngModel)]
      CommonModule,
      RouterModule
    ]
})
export class CalenderComponent  implements OnInit {
   currentYear: string = '';
  previousYear: string = '';
  nextYear: string = '';
  poojas: any[] = [];

  constructor(private router: Router,  private modalCtrl: ModalController, private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private navCtrl: NavController, private calendarService: Calender) { }

  ngOnInit() {
    this.loadCalendar(this.currentYear);
  }

async loadCalendar(year: string) {
  this.calendarService.getCalendar(year).subscribe(async (res: any) => {
    if (res.errorCode === '200') {
      const result = res.result[0];

      this.currentYear = result.year;
      this.previousYear = result.prevYear;
      this.nextYear = result.nextYear;

      // Use dates as-is (strings)
      this.poojas = result.poojasList?.map((p: any) => {
          return {
            ...p,
            openingDate: p.openingDate
              ? formatDate(new Date(Number(p.openingDate) * 1000), 'dd-MM-yyyy', 'en-US')
              : '--',
            closingDate: p.closingDate
              ? formatDate(new Date(Number(p.closingDate) * 1000), 'dd-MM-yyyy', 'en-US')
              : '--'
          };
        }) || [];
    } else {
      const toast = await this.toastCtrl.create({
        message: 'డేటా లభించలేదు',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  });
}
    
async loadNextYear() {
  if (this.nextYear) {
    this.loadCalendar(this.nextYear);
  } else {
    this.showToast('No data available for the next year.');
  }
}

    async loadPreviousYear() {
      if (this.previousYear) {
        this.loadCalendar(this.previousYear);
      } else {
        this.showToast('No data available for the previous year.');
      }
    }

    // Toast helper
    async showToast(message: string) {
      const toast = await this.toastCtrl.create({
        message,
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      toast.present();
    }

  doRefresh(event: any) {
    this.loadCalendar(this.currentYear);
    event.target.complete();
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
  async openInfo() {
    const modal = await this.modalCtrl.create({
      component: CalenderDialogComponent,
      cssClass: 'alert-style-modal ',
      backdropDismiss: true,
      showBackdrop: true
      });
      await modal.present();
  }

}
