import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Http } from '@capacitor-community/http';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, IonicModule, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile-page',
  standalone: true,
    imports: [IonicModule, FormsModule, RouterModule],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent  implements OnInit {
firstName = '';
  lastName = '';
  email = '';
  mobile = '';

  flyerName = '';
  flyerDesignation = '';
  flyerPic = '';

  selectedImage = '';        // Profile Image
  selectedFlyerImage = '';   // Flyer Image

  constructor(
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {

    const userId = localStorage.getItem('userId') || '';

    this.firstName = localStorage.getItem('firstName') || '';
    this.lastName = localStorage.getItem('lastName') || '';
    this.email = localStorage.getItem('email') || '';
    this.mobile = localStorage.getItem('mobile') || '';

    this.flyerName =
      localStorage.getItem(`flyerName_${userId}`) || '';

    this.flyerDesignation =
      localStorage.getItem(`flyerDesignation_${userId}`) || '';

    this.flyerPic =
      localStorage.getItem(`flyerPic_${userId}`) || '';

    this.selectedFlyerImage = this.flyerPic;

    // PROFILE IMAGE LOAD
    this.selectedImage =
      localStorage.getItem(`profilePic_${userId}`) ||
      'assets/ic_launcher.png';
  }

  // ---------------- IMAGE PICK ----------------

  async selectProfileImage() {
    this.selectImage('profile');
  }

  async selectFlyerImage() {
    this.selectImage('flyer');
  }

  async selectImage(type: 'profile' | 'flyer') {

    const alert = await this.alertController.create({
      header: 'Select Image',
      buttons: [
        {
          text: 'Camera',
          handler: () => this.pickImage(type, CameraSource.Camera)
        },
        {
          text: 'Gallery',
          handler: () => this.pickImage(type, CameraSource.Photos)
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  // ⭐ COMMON IMAGE PICKER (FIXED FOR iOS + ANDROID)

  async pickImage(
    type: 'profile' | 'flyer',
    source: CameraSource
  ) {

    try {

      const image = await Camera.getPhoto({
        quality: 90,
        source: source,
        resultType: CameraResultType.DataUrl
      });

      const imageData = image.dataUrl || '';

      if (type === 'profile') {
        this.selectedImage = imageData;
      } else {
        this.selectedFlyerImage = imageData;
      }

    } catch (e) {
      console.log('Image Error:', e);
    }
  }

  // ---------------- UPDATE PROFILE ----------------

  async updateProfile() {

    const userId =
      localStorage.getItem('userId') || '';

    const loading =
      await this.loadingController.create({
        message: 'Updating Profile...'
      });

    await loading.present();

    try {

      const response = await Http.request({
        method: 'POST',
        url: 'https://www.ayyappatelugu.com/APICalls/updateProfileInfo',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: {
          registerId: userId,
          firstName: this.firstName,
          lastName: this.lastName,
          mobileNumber: this.mobile,
          emailId: this.email,
          nameOnFlyer: this.flyerName,
          designationOnFlyer: this.flyerDesignation,

          profilePic:
            this.selectedImage ||
            localStorage.getItem(`profilePic_${userId}`) ||
            '',

          picOnFlyer:
            this.selectedFlyerImage ||
            localStorage.getItem(`flyerPic_${userId}`) ||
            ''
        }
      });

      const parsed =
        typeof response.data === 'string'
          ? JSON.parse(response.data)
          : response.data;

      if (
        parsed.status === 'Success' ||
        parsed.errorCode === '200'
      ) {

        // SAVE DATA
        localStorage.setItem('firstName', this.firstName);
        localStorage.setItem('lastName', this.lastName);
        localStorage.setItem('email', this.email);
        localStorage.setItem('mobile', this.mobile);

        localStorage.setItem(
          `flyerName_${userId}`,
          this.flyerName
        );

        localStorage.setItem(
          `flyerDesignation_${userId}`,
          this.flyerDesignation
        );

        localStorage.setItem(
          `profilePic_${userId}`,
          this.selectedImage
        );

        localStorage.setItem(
          `flyerPic_${userId}`,
          this.selectedFlyerImage
        );

        const toast =
          await this.toastController.create({
            message: 'Profile Updated Successfully',
            duration: 2000,
            color: 'success'
          });

        await toast.present();
        await toast.onDidDismiss();

        this.router.navigateByUrl('/swamy-dashboard', {
          replaceUrl: true
        });

      } else {

        const toast =
          await this.toastController.create({
            message: parsed.message || 'Update Failed',
            duration: 2000,
            color: 'danger'
          });

        await toast.present();
      }

    } catch (e) {

      const toast =
        await this.toastController.create({
          message: 'Profile Update Failed',
          duration: 2000,
          color: 'danger'
        });

      await toast.present();

    } finally {
      await loading.dismiss();
    }
  }
}
