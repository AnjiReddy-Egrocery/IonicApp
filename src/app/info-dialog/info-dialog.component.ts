import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class InfoDialogComponent {
  constructor(private modalCtrl: ModalController) {}

   close() {
    this.modalCtrl.dismiss();
  }

}