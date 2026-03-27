import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { IonicModule, IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
   imports: [IonicModule, RouterModule]
})
export class AppComponent {
  
 constructor() {
   
  }

 
}