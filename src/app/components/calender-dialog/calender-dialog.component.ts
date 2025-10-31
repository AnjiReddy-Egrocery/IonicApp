import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
   standalone: true,
  selector: 'app-calender-dialog',
  templateUrl: './calender-dialog.component.html',
  styleUrls: ['./calender-dialog.component.scss'],
   imports: [IonicModule, CommonModule],
})
export class CalenderDialogComponent   {

 constructor(private modalCtrl: ModalController) {}

  close() {
    this.modalCtrl.dismiss();
  }

}
