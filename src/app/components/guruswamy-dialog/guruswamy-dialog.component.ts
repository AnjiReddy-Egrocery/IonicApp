import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-guruswamy-dialog',
  templateUrl: './guruswamy-dialog.component.html',
  styleUrls: ['./guruswamy-dialog.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class GuruswamyDialogComponent  {
  constructor(private modalCtrl: ModalController) {}

  close() {
    this.modalCtrl.dismiss();
  }
}
