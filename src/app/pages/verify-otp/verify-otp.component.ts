import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertController, IonicModule, ModalController, ToastController } from '@ionic/angular';
import { RegisterService } from 'src/app/services/register';
import { PrivacyDialogComponent } from '../privacy-dialog/privacy-dialog.component';
import { Verifyotp } from 'src/app/services/verifyotp';
import { ConformationdialogComponent } from 'src/app/components/conformationdialog/conformationdialog.component';

@Component({
  selector: 'app-verify-otp',
   standalone: true,
  imports: [IonicModule, FormsModule, RouterModule, PrivacyDialogComponent],
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss'],
})
export class VerifyOtpComponent implements OnInit {  
  otp: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  registerId: string = ''; // 👈 will store registerId from query params
   sentOtp: string = '';     // 👈 store OTP from query params
  
  accepted = false;

  constructor(private toastCtrl: ToastController,private router: Router,  private alertCtrl: AlertController,
    private registerService: RegisterService,  private modalCtrl: ModalController, private route: ActivatedRoute, private verifyOtpService: Verifyotp,) {}

    ngOnInit() {
    // 🔹 Read query params sent from registration page
    this.route.queryParams.subscribe(params => {
      this.registerId = params['registerId'];
      this.sentOtp = params['otp'];
     

      console.log('RegisterId:', this.registerId);
      console.log('Received OTP:', this.sentOtp);
      
    });
  }

  async verifyOtp() {
  if (!this.otp) {
    this.showToast('Please enter OTP');
    return;
  }

  console.log('🔹 Sending OTP verification request...');
  console.log('Register ID:', this.registerId, 'Entered OTP:', this.otp);

  try {
    const response = await this.verifyOtpService.register(this.registerId, this.otp);
    console.log('✅ Verify OTP Response:', response);

    if (response.status === 'Success' && response.errorCode === '200') {
      this.showToast('OTP verified successfully! 🎉');
      // Navigate to next page, e.g., login or home
      this.confirmationDialog();
    } else {
      this.showToast(response.message || 'Invalid OTP');
    }
  } catch (error) {
    console.error('❌ Verify OTP Error:', error);
    this.showToast('Verification failed. Try again.');
  }
}
  async confirmationDialog() {
   const modal = await this.modalCtrl.create({
              component: ConformationdialogComponent,
              cssClass: 'alert-style-modal',   // ✅ must match exactly
              backdropDismiss: true,
              showBackdrop: true
             
            });
            await modal.present();
          }


 
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

    toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}