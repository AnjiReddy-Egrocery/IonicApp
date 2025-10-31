import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-anadanam-dialog',
  templateUrl: './anadanam-dialog.component.html',
  styleUrls: ['./anadanam-dialog.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class AnadanamDialogComponent  {

   constructor(private modalCtrl: ModalController) {}
  close() {
      this.modalCtrl.dismiss();
    }

}
