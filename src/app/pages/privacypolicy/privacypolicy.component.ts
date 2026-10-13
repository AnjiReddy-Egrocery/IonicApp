import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PinchZoomComponent } from 'src/app/components/pinch-zoom/pinch-zoom.component';

@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.component.html',
  styleUrls: ['./privacypolicy.component.scss'],
    standalone: true,
  imports: [     
    IonicModule,      // ✅ required for all ion-* components
    FormsModule,      // ✅ required for [(ngModel)]
    CommonModule,
    PinchZoomComponent
  ]
})
export class PrivacypolicyComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
