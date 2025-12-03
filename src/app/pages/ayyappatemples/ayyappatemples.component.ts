import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';

import { AyyappadetailsComponent } from 'src/app/components/ayyappadetails/ayyappadetails.component';
import { AyyappatemplemapPage } from '../ayyappatemplemap/ayyappatemplemap.page';
import { Ayyappatemplelist } from 'src/app/services/ayyappatemplelist';
import { AyyappatempleListPage } from '../ayyappatemple-list/ayyappatemple-list.page';

@Component({
  selector: 'app-ayyappatemples',
  templateUrl: './ayyappatemples.component.html',
  styleUrls: ['./ayyappatemples.component.scss'],
  standalone: true,
    imports: [     
      IonicModule,      // ✅ required for all ion-* components
      FormsModule,      // ✅ required for [(ngModel)]
      CommonModule,
     AyyappatempleListPage,  // ✅ add here
      AyyappatemplemapPage   // ✅ add here
    ]
})
export class AyyappatemplesComponent  implements OnInit {

  
   selectedTab: string = 'map'; // default tab

  constructor(private http: HttpClient,
    private router: Router,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,) { }

  ngOnInit() {}
  
changeTab(tab: string | undefined) {
  if (!tab) return;   // prevent error

  this.selectedTab = tab;

  if (tab === 'ayyappatemples') {
    setTimeout(() => {
      const listComp = document.querySelector('app-ayyappatemples-list') as any;
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
