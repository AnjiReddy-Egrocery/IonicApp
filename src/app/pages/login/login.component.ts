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

   
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

   async goToLogin() {
    if (!this.email || !this.password) {
      this.showToast(' Please enter email & password');
      return;
    }

    this.loginService.login(this.email, this.password).subscribe({
      next: async (response: LoginDataResponse) => {
        if (response.errorCode === '200') {
            const userData = {
                name: response.result.userFirstName,
                email: response.result.userEmail,
                image: response.result.userImage || 'assets/ic_launcher.png'
              };

              await this.authService.setLoginData(userData);
              this.showToast('✅ Login Successful');
              this.router.navigateByUrl('/dashboard', { replaceUrl: true });
            
        } else {
          this.showToast('❌ Incorrect Email or Password');
        }
      },
      error: (err) => {
        console.error('Login Error:', err);
        this.showToast('Login failed. Check internet connection');
      }
    });
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
