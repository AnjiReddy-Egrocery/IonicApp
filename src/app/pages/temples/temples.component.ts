import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { InfoDialogComponent } from 'src/app/info-dialog/info-dialog.component';
import { TemplesListComponent } from '../temples-list/temples-list.component';
import { TemplesMapComponent } from '../temples-map/temples-map.component';
import { AyyappatemplesComponent } from '../ayyappatemples/ayyappatemples.component';
import { AyyappadetailsComponent } from 'src/app/components/ayyappadetails/ayyappadetails.component';

@Component({
  selector: 'app-temples',
  templateUrl: './temples.component.html',
  styleUrls: ['./temples.component.scss'],
  standalone: true,
    imports: [     
      IonicModule,      // ✅ required for all ion-* components
      FormsModule,      // ✅ required for [(ngModel)]
      CommonModule,
      TemplesMapComponent,   // ✅ add here
      TemplesListComponent   // ✅ add here
    ]
})
export class TemplesComponent  implements OnInit {

   selectedTab: string = 'map'; // default tab

  constructor(private http: HttpClient,
    private router: Router,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,) { }

  ngOnInit() {}
  
changeTab(tab: string | undefined) {
  if (!tab) return;   // prevent error

  this.selectedTab = tab;

  if (tab === 'temples') {
    setTimeout(() => {
      const listComp = document.querySelector('app-temples-list') as any;
      listComp?.loadTempleList?.();
    }, 100);
  }
}
  goToAnadanam() {
    this.router.navigate(['/anadanam']);
  }

  goToNityaPooja() {
    this.router.navigate(['/nityapooja']);
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: 'danger'
    });
    await toast.present();
  }

  async openInfo() {
      const modal = await this.modalCtrl.create({
        component: AyyappadetailsComponent,
       cssClass: 'alert-style-modal',   // ✅ must match exactly
              backdropDismiss: true,
              showBackdrop: true
      });
      await modal.present();
    }
  navigate(page: string) {
    this.router.navigate([`/${page}`]);
  }
}
