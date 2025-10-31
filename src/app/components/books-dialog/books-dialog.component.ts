import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-books-dialog',
  templateUrl: './books-dialog.component.html',
  styleUrls: ['./books-dialog.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class BooksDialogComponent {

  constructor(private modalCtrl: ModalController) {}
 close() {
     this.modalCtrl.dismiss();
   }

}
