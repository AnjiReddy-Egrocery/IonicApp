import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-padayatracomponent',
  templateUrl: './padayatracomponent.component.html',
  styleUrls: ['./padayatracomponent.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class PadayatracomponentComponent   {

  constructor(private modalCtrl: ModalController) {}
    close() {
        this.modalCtrl.dismiss();
      }

}
