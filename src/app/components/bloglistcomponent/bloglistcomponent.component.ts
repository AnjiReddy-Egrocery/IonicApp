import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
   standalone: true,
  selector: 'app-bloglistcomponent',
  templateUrl: './bloglistcomponent.component.html',
  styleUrls: ['./bloglistcomponent.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class BloglistcomponentComponent {

  constructor(private modalCtrl: ModalController) {}
  close() {
      this.modalCtrl.dismiss();
    }

}
