import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule, ToastController } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from 'src/app/services/auth';
import { CreatePassword } from 'src/app/services/create-password';

@Component({
  selector: 'app-create-password',
   standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './create-password.page.html',
  styleUrls: ['./create-password.page.scss'],
 
})
export class CreatePasswordPage implements OnInit {
  password: string = '';
  Confirmpassword: string = '';
  showPassword: boolean = false;

   registerId: string = '';
  otp: string = '';


  constructor( private router: Router, 
      private authService: Auth,
       private route: ActivatedRoute,
       private service: CreatePassword,
    private toastCtrl: ToastController) { }

  ngOnInit() {

      // ✅ Get values from previous page
    this.route.queryParams.subscribe(params => {
      this.registerId = params['registerId'];
      this.otp = params['otp'];

      console.log('registerId:', this.registerId);
      console.log('otp:', this.otp);
    });
  }

     
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  isValidPassword(password: string): boolean {
    if (!password) {
      this.showToast('Please enter password');
      return false;
    }
    if (password.length < 6) {
      this.showToast('Password must be at least 6 characters');
      return false;
    }
    return true;
  }
  doPasswordsMatch(): boolean {
    if (this.password !== this.Confirmpassword) {
      this.showToast('Passwords do not match');
      return false;
    }
    return true;
  }

async goToResetPassword() {

    if (!this.isValidPassword(this.password)) return;
    if (!this.doPasswordsMatch()) return;

    try {

      const res = await this.service.resetPassword(
        this.registerId,
        this.otp,
        this.password
      );

      console.log('API RESPONSE:', res);

      if (res.errorCode === '200') {

        this.showToast('Password Reset Successful');

        this.router.navigate(['/login']);

      } else {
        this.showToast(res.message || 'Something went wrong');
      }

    } catch (error) {
      console.error(error);
      this.showToast('Server error');
    }
  }

   async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
