import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-nityapooja-dialog',
  templateUrl: './nityapooja-dialog.component.html',
  styleUrls: ['./nityapooja-dialog.component.scss'],
})
export class NityapoojaDialogComponent {

  constructor(private modalCtrl: ModalController) {}
 close() {
     this.modalCtrl.dismiss();
   }

}
