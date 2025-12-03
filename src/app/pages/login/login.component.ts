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
  username: string = '';   // email or mobile
  password: string = '';
  showPassword: boolean = false;

  constructor(
     private loginService: LoginService,
    private router: Router, 
      private authService: Auth,
    private toastCtrl: ToastController) {}

   
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

     async goToLogin() {
    if (!this.username || !this.password) {
      this.showToast('Please enter mobile & password');
      return;
    }

    try {
      const response: LoginDataResponse = await this.loginService.login(this.username, this.password);
      console.log('✅ Login Response:', response);

      if (response.status === 'Success' && response.errorCode === '200') {
        const user = response.result;; // backend returns an array

       const userData = {
            name: user.userFirstName || '',
            email: user.userEmail || '',
            image: user.userImage || 'assets/ic_launcher.png'
    };

        await this.authService.setLoginData(userData);
        await this.showToast('✅ Login Successful');
        this.router.navigateByUrl('/dashboard', { replaceUrl: true });
      } else {
        this.showToast(response.message || '❌ Invalid credentials');
      }
    } catch (error) {
      console.error('Login Error:', error);
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
    this.router.navigate(['/forgot-password']);
  }

  

}
