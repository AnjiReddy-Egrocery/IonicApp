import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
   standalone: true,
  selector: 'app-conformationdialog',
  templateUrl: './conformationdialog.component.html',
  styleUrls: ['./conformationdialog.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ConformationdialogComponent  {

  accepted = false;

  constructor(private modalCtrl: ModalController, private router: Router) {}

  cancel() {
    this.modalCtrl.dismiss();
  }

  accept() {
    this.modalCtrl.dismiss();
    this.router.navigate(['/login']); // navigate to login page
  }

}
