import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
   constructor(private router: Router, private authService: Auth) {}

  async ngOnInit() {
    // Make sure storage is ready first
    await this.authService.init();  

    // Wait for 3 seconds
    setTimeout(async () => {
      const isLoggedIn = await this.authService.getLoginState();
      if (isLoggedIn) {
        this.router.navigateByUrl('/dashboard', { replaceUrl: true });
      } else {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      }
    }, 3000);
  }
}

