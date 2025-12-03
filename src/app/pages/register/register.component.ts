import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AlertController, IonicModule, ModalController, ToastController } from '@ionic/angular';
import { RegisterService, UserDataResponse } from 'src/app/services/register';
import { PrivacyDialogComponent } from '../privacy-dialog/privacy-dialog.component';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, FormsModule, RouterModule, PrivacyDialogComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  
})
export class RegisterPage {
 firstName = '';
  lastName = '';
  email = '';
  mobile = '';
  password = '';

  constructor(
    private toastCtrl: ToastController,
    private router: Router,
    private registerService: RegisterService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {}

  async register() {
  console.log('Register button clicked');
  console.log('Form values:', {
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    mobile: this.mobile,
    password: this.password
  });

  if (!this.firstName || !this.lastName || !this.email || !this.mobile) {
    this.showToast('Please fill all required fields');
    return;
  }

  try {
  const rawRes: any = await this.registerService.register(
    this.firstName,
    this.lastName,
    this.email,
    this.mobile,
    this.password
  );

  console.log('Registration API response:', rawRes);

  // ✅ Normalize iOS JSON string
  const res = typeof rawRes === 'string' ? JSON.parse(rawRes) : rawRes;

  if (res.status === "Success" && res.errorCode === "200" && Array.isArray(res.result) && res.result.length > 0) {
    const { registerId, otp } = res.result[0];
    console.log('✅ Navigating to verify-otp:', registerId, otp);
    this.router.navigate(['/verify-otp'], { queryParams: { registerId, otp } });
    this.showToast('Registration successful! Please verify OTP.');
  } else if (res.errorCode === "203") {
    this.showToast(res.errorMessage || 'Email or mobile already exists');
  } else {
    console.warn('Unexpected API structure:', res);
    this.showToast(res.message || 'Unexpected response from server');
  }
} catch (err) {
  console.error('Network error:', err);
  this.showToast('Network error, please try again later');
}
}
  private isValidEmail(email: string) {
    return /^[a-zA-Z0-9._-]+@[a-z]+\.[a-z]+$/.test(email);
  }

  private isValidMobile(mobile: string) {
    return /^[0-9]{10,15}$/.test(mobile);
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }


  goToLogin() {
    this.router.navigateByUrl('/login');
  }

}



