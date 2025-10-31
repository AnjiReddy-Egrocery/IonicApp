import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-poojapetam-dialog',
  templateUrl: './poojapetam-dialog.component.html',
  styleUrls: ['./poojapetam-dialog.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class PoojapetamDialogComponent {
 constructor(private modalCtrl: ModalController) {}
 close() {
     this.modalCtrl.dismiss();
   }
  }
