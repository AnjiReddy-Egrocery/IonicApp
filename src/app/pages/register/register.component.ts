import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AlertController, IonicModule, ModalController, ToastController } from '@ionic/angular';
import { RegisterService, UserDataResponse } from 'src/app/services/register';
import { PrivacyDialogComponent } from '../privacy-dialog/privacy-dialog.component';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, FormsModule, RouterModule, PrivacyDialogComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  
})
export class RegisterPage {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  mobile: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  
  
  constructor(private toastCtrl: ToastController,private router: Router,  private alertCtrl: AlertController,
    private registerService: RegisterService,  private modalCtrl: ModalController,) {}

  async register() {
        if (!this.firstName || !this.lastName || !this.email || !this.mobile || !this.password) {
          this.showToast('Please fill all fields');
          return;
        }

        // 🔹 Show Privacy Modal
        const modal = await this.modalCtrl.create({
          component: PrivacyDialogComponent
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();

        if (!data?.accepted) {
          this.showToast('You must accept the privacy policy');
          return;
        }

        // 🔹 Call Registration API
        this.registerService.register(this.firstName, this.lastName, this.email, this.mobile, this.password)
          .subscribe(res => {
            if (res.errorCode === '203') {
              this.showToast('Email or mobile already exists');
            } else if (res.errorCode === '200' && res.result?.length) {
              const { registerId, otp } = res.result[0];

              // ✅ Immediately go to login page
              this.router.navigateByUrl('/login', { replaceUrl: true });

              // 🔥 Verify OTP in background (no user blocking)
              this.verifyOtp(registerId, otp);

            } else {
              this.showToast('Unexpected response from server');
            }
          }, err => {
            console.error(err);
            this.showToast('Network error, try again');
          });
      }

      verifyOtp(registerId: string, otp: string) {
        this.registerService.verifyOtp(registerId, otp).subscribe(res => {
          if (res.errorCode === '200') {
            console.log('✅ User verified successfully in background');
          } else {
            console.warn('⚠️ OTP verification failed in background');
          }
        }, err => {
          console.error('❌ Network error during OTP verification', err);
        });
      }
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }

  private isValidEmail(email: string) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-z]+\.[a-z]+$/;
    return emailPattern.test(email);
  }

  private isValidMobile(mobile: string) {
    const phonePattern = /^[0-9]{10,15}$/;
    return phonePattern.test(mobile);
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }


  goToLogin() {
    this.router.navigateByUrl('/login');
  }

   async pickGoogleAccount() {
    try {
      const result = await GoogleAuth.signIn();
      this.email = result.email;  // auto-fill ion-input
    } catch (err) {
      console.error('Google Sign-In error:', err);
    }
  }
}
