import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { IonicModule, IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonicModule]
})
export class AppComponent {
  constructor(private router: Router) {
    this.initializeApp();
  }

async initializeApp() {
  // Always show splash at app start
  await SplashScreen.show({ autoHide: false });

  setTimeout(() => {
    // ❌ isLoggedIn check remove చెయ్యాలి
    // const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // ✅ ఎప్పుడూ login కు వెళ్ళాలి
    this.router.navigateByUrl('/login', { replaceUrl: true });

    // Hide splash after navigation
    SplashScreen.hide();
  }, 3000);
}
}