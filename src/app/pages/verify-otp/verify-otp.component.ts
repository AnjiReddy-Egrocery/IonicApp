import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertController, IonicModule, ModalController, ToastController } from '@ionic/angular';
import { RegisterService } from 'src/app/services/register';
import { PrivacyDialogComponent } from '../privacy-dialog/privacy-dialog.component';

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

  constructor(private toastCtrl: ToastController,private router: Router,  private alertCtrl: AlertController,
    private registerService: RegisterService,  private modalCtrl: ModalController, private route: ActivatedRoute) {}

    ngOnInit() {
    // 🔹 Read query params sent from registration page
    this.route.queryParams.subscribe(params => {
      this.registerId = params['registerId'];
      this.sentOtp = params['otp'];
     

      console.log('RegisterId:', this.registerId);
      console.log('Received OTP:', this.sentOtp);
      
    });
  }


  async verifyBtn() {
        if (!this.otp || !this.password  ) {
          this.showToast('Please fill all fields');
          return;
        }

         if (this.otp !== this.sentOtp) {
      this.showToast('Invalid OTP');
      return;
    }
     
        // 🔹 Call Registration API
            this.registerService.verifyOtp(this.registerId, this.otp, this.password).subscribe(
      res => {
        if (res.errorCode === '200') {
          this.showToast('Verification successful!');
          this.router.navigate(['/login']); // ✅ go to login after verification
        } else {
          this.showToast('Verification failed');
        }
      },
      err => {
        console.error(err);
        this.showToast('Network error, try again');
      }
    );
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