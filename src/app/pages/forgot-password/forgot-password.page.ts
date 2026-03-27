import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ForgotPassword } from 'src/app/services/forgot-password';

@Component({
  selector: 'app-forgot-password',
    standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  
})
export class ForgotPasswordPage implements OnInit {
   email: string = '';   

  constructor(private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
   private forgotresponse: ForgotPassword) { }

  ngOnInit() {
  }

   isValidEmail(email: string): boolean {

    if (!email || email.trim() === '') {
      this.presentToast('Please Enter Your Email');
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-z]+\.[a-z]+$/;

    if (!emailPattern.test(email)) {
      this.presentToast('Please Enter Valid Email');
      return false;
    }

    return true;
  }
  
 async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
async goToCtreatePassword() {

  if (!this.isValidEmail(this.email)) {
    return;
  }

  try {

    const response = await this.forgotresponse.forgotPassword(this.email);

    console.log('API RESPONSE:', response);

    if (response.errorCode === '201') {

      this.presentToast('Your Email is not registered');
      this.router.navigate(['/register']);

    } else if (response.errorCode === '200') {

      let registerId = '';
      let otp = '';

      if (response.result && response.result.length > 0) {
        registerId = response.result[0].registerId;
        otp = response.result[0].otp;
      }

      this.presentToast('Reset Password Request Sent');

      this.router.navigate(['/create-password'], {
        queryParams: {
          registerId,
          otp
        }
      });

    }

  } catch (error) {
    console.error(error);
    this.presentToast('Server error');
  }
}
}
