import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Auth } from 'src/app/services/auth';
import { RegisterService } from 'src/app/services/register';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: true,
  imports: [ IonicModule,      // ✅ required for all ion-* components
      FormsModule,      // ✅ required for [(ngModel)]
      CommonModule,]
})
export class ChangePasswordPage implements OnInit {
  currentPassword: string = '';
  password: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private modalCtrl: ModalController,
    private registerService: RegisterService,   // ✅ Inject service
    private auth: Auth                   // ✅ Get user data
  ) {}

  ngOnInit() {}

   toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // ==============================
  // 🔥 Submit Change Password
  // ==============================
  async submitChangePassword() {

    const user = await this.auth.getUser(); // Storage నుండి user data load

    if (!user || !user.registerId) {
      console.error("❌ No registerId found");
      return;
    }

    if (!this.currentPassword || !this.password) {
      alert("Please enter both passwords");
      return;
    }

    try {
      // 🔥 Call API
      const res = await this.registerService.changePassword(
        user.registerId,
        this.currentPassword,
        this.password
      );

      console.log("🎉 Change Password Success:", res);

      alert(res.message || "Password updated successfully!");

       await this.auth.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });

    } catch (err) {
      console.error("❌ Change Password Error:", err);
      alert("Password change failed!");
    }
  }

  // Back navigation
  goBack() {
    this.router.navigateByUrl('/settings');
  }

  // Footer navigation examples
  goToAnadanam() { this.router.navigate(['/anadanam']); }
  goToNityaPooja() { this.router.navigate(['/nithyapooja']); }
}

