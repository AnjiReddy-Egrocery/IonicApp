import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { Auth } from 'src/app/services/auth';
import { LoginDataResponse, LoginService } from 'src/app/services/login';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginPage {
  email: string = '';   
  password: string = '';
  showPassword: boolean = false;

  constructor(
     private loginService: LoginService,
    private router: Router, 
      private authService: Auth,
    private toastCtrl: ToastController) {}

      // ✅ Email validation
  isValidEmail(email: string): boolean {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }


   
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

     async goToLogin() {
    if (!this.email || !this.password) {
      this.showToast('Please enter email and password');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.showToast('Please enter a valid email address');
      return;
    }

    try {
      // 🔑 Backend key is STILL "username"
      const response = await this.loginService.login(
        this.email,     // email value
        this.password
      );

      if (response.status === 'Success' && response.errorCode === '200') {

        const user = response.result;

        const userData = {
          registerId: user.userId,
          userMid: user.userMid,
          name: user.userFirstName || '',
          email: user.userEmail || '',
          image: user.userImage || 'assets/ic_launcher.png'
        };

        await this.authService.setLoginData(userData);
        await this.showToast('✅ Login Successful');
        this.router.navigateByUrl('/swamy-dashboard', { replaceUrl: true });

      } else {
        this.showToast(response.message || 'Invalid email or password');
      }

    } catch (err) {
      this.showToast('Login failed. Check internet connection');
    }
  }



  private async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
     
    });
    await toast.present();
  }  

   goToRegister() {
    this.router.navigateByUrl('/register'); // ✅ Now this works
  }
  goToForgotPassword() {
    this.router.navigateByUrl('/forgotpassword');
  }

  

}
