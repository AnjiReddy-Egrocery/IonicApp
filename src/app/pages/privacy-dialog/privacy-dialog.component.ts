import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { PinchZoomComponent } from 'src/app/components/pinch-zoom/pinch-zoom.component';

@Component({
  selector: 'app-privacy-dialog',
  templateUrl: './privacy-dialog.component.html',
  styleUrls: ['./privacy-dialog.component.scss'],
  standalone: true,
  imports: [
    IonicModule, // ✅ For ion-button, ion-label, ion-checkbox, etc.
    FormsModule,  // ✅ For [(ngModel)]
    PinchZoomComponent
  ]
})
export class PrivacyDialogComponent  {

   isPrivacyChecked = false;

  constructor(private modalCtrl: ModalController) {}

  onAccept() {
    if (this.isPrivacyChecked) {
      this.modalCtrl.dismiss({ accepted: true });
    }
  }

  onCancel() {
    this.modalCtrl.dismiss({ accepted: false });
  }
}