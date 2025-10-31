import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
    standalone: true,
  selector: 'app-news-dialog',
  templateUrl: './news-dialog.component.html',
  styleUrls: ['./news-dialog.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class NewsDialogComponent  {
  
 constructor(private modalCtrl: ModalController) {}
close() {
    this.modalCtrl.dismiss();
  }
  
}
