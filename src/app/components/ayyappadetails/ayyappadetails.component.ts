import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-ayyappadetails',
  templateUrl: './ayyappadetails.component.html',
  styleUrls: ['./ayyappadetails.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class AyyappadetailsComponent   {

  constructor(private modalCtrl: ModalController) {}
   close() {
       this.modalCtrl.dismiss();
     }

}
