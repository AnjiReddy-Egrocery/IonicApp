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
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  mobile: string = '';

  
  
  constructor(private toastCtrl: ToastController,private router: Router,  private alertCtrl: AlertController,
    private registerService: RegisterService,  private modalCtrl: ModalController,) {}

  async register() {
        if (!this.firstName || !this.lastName || !this.email || !this.mobile ) {
          this.showToast('Please fill all fields');
          return;
        }
     
        // 🔹 Call Registration API
        this.registerService.register(this.firstName, this.lastName, this.email, this.mobile)
          .subscribe(res => {
            if (res.errorCode === '203') {
              this.showToast('Email or mobile already exists');
            } else if (res.errorCode === '200' && res.result?.length) {
              const { registerId, otp } = res.result[0];

              // ✅ Immediately go to login page
              this.router.navigate(['/verify-otp'], {
                          queryParams: {
                            registerId: registerId,
                            otp: otp
                          }
                        });

            } else {
              this.showToast('Unexpected response from server');
            }
          }, err => {
            console.error(err);
            this.showToast('Network error, try again');
          });
      }

     
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
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



  goToLogin() {
    this.router.navigateByUrl('/login');
  }

}
