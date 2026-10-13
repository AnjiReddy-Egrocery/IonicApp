
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nearby-temple-dialog',
   standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './nearby-temple-dialog.component.html',
  styleUrls: ['./nearby-temple-dialog.component.scss'],
})
export class NearbyTempleDialogComponent {

   @Input() places: any[] = [];

  constructor(
    private modalCtrl: ModalController
  ) {}

  close() {
    this.modalCtrl.dismiss();
  }

}
