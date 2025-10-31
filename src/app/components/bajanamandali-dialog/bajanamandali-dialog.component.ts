import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-bajanamandali-dialog',
  templateUrl: './bajanamandali-dialog.component.html',
  styleUrls: ['./bajanamandali-dialog.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class BajanamandaliDialogComponent   {
 constructor(private modalCtrl: ModalController) {}
close() {
    this.modalCtrl.dismiss();
  }
  

}
