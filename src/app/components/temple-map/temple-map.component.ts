import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-temple-map',
  templateUrl: './temple-map.component.html',
  styleUrls: ['./temple-map.component.scss'],
   standalone: true,
  imports: [IonicModule, CommonModule],
})
export class TempleMapComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
