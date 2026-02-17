import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Auth } from 'src/app/services/auth';

@Component({
  selector: 'app-introslider',
  templateUrl: './introslider.page.html',
  styleUrls: ['./introslider.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicModule]
})
export class IntrosliderPage {

 constructor(private router: Router,private authService: Auth) {}

   async continue() {

   
    const isLoggedIn = await this.authService.getLoginState();
  if (isLoggedIn) {
    this.router.navigateByUrl('/swamy-dashboard', { replaceUrl: true });
  } else {
    this.router.navigateByUrl('/dashboard', { replaceUrl: true });
  }
  }
  

}
