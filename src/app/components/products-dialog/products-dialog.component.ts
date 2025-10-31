import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-products-dialog',
  templateUrl: './products-dialog.component.html',
  styleUrls: ['./products-dialog.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class ProductsDialogComponent   {

   constructor(private modalCtrl: ModalController) {}
  close() {
      this.modalCtrl.dismiss();
    }

}
