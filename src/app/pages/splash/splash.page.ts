import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Auth } from 'src/app/services/auth';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
 
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonicModule]
})
export class SplashPage implements OnInit {

   constructor(private router: Router, private authService: Auth) {}

 async ngOnInit() {
 setTimeout(async () => {
  
    this.router.navigateByUrl('/introslider', { replaceUrl: true });
 
}, 500); // 0.5 seconds
}

}
