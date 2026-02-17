import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AlertController, IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Auth } from 'src/app/services/auth';
import { RegisterPage } from '../register/register.component';
import { RegisterService } from 'src/app/services/register';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [ IonicModule,      // ✅ required for all ion-* components
      FormsModule,      // ✅ required for [(ngModel)]
      CommonModule,]
})
export class SettingsPage implements OnInit {
  http: any;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router,private alertCtrl: AlertController,private auth: Auth,private registerService: RegisterService ) { }

  ngOnInit() {
  }

   navigate(page: string) {
    this.router.navigate([`/${page}`]);
  }
    goToAnadanam() {
    this.router.navigate(['/anadanam']);
  }

  goToNityaPooja() {
    this.router.navigate(['/nityapooja']);
  }

  goToChangePassword() {
  this.router.navigateByUrl('/changepassword');
}

async confirmDelete() {
  const alert = await this.alertCtrl.create({
    header: 'Delete Account',
    message: 'Are you sure you want to permanently delete your account? This action cannot be undone.',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Yes, Delete',
        handler: () => {
          this.deleteAccount();
        }
      }
    ]
  });

  await alert.present();
}
 async deleteAccount() {

  const user = await this.auth.getUser();

  if (!user || !user.registerId) {
    console.error("❌ registerId missing");
    return;
  }

  try {
    const res = await this.registerService.deleteAccount(user.registerId);
    console.log("🎉 Delete Success:", res);

    await this.auth.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });

  } catch (err) {
    console.error("❌ Error deleting:", err);
  }
}
}