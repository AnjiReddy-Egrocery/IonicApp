import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-tourse-dialog',
  templateUrl: './tourse-dialog.component.html',
  styleUrls: ['./tourse-dialog.component.scss'],
  imports: [IonicModule, CommonModule],

})
export class TourseDialogComponent {

   constructor(private modalCtrl: ModalController) {}
  close() {
      this.modalCtrl.dismiss();
    }
}
