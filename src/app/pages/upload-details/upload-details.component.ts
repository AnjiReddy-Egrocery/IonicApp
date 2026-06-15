import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonicModule, LoadingController, ToastController } from '@ionic/angular';
import {
  Camera,
  CameraResultType,
  CameraSource
} from '@capacitor/camera';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Http } from '@capacitor-community/http';

@Component({
  selector: 'app-upload-details',
  templateUrl: './upload-details.component.html',
  styleUrls: ['./upload-details.component.scss'],
   standalone: true,
    imports: [     
      IonicModule,      // ✅ required for all ion-* components
      FormsModule,      // ✅ required for [(ngModel)]
      CommonModule,
    ],
})
export class UploadDetailsComponent  {
 nameOnFlyer = '';
  designationOnFlyer = '';

  selectedImage = '';

  constructor(
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  async selectImage() {

    const alert = await this.alertController.create({
      header: 'Select Image',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            this.openCamera();
          }
        },
        {
          text: 'Gallery',
          handler: () => {
            this.openGallery();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  async openCamera() {

    try {

      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Camera,
        resultType: CameraResultType.Base64
      });

      this.selectedImage =
        `data:image/jpeg;base64,${image.base64String}`;

    } catch (e) {
      console.log(e);
    }
  }

  async openGallery() {

    try {

      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Photos,
        resultType: CameraResultType.Base64
      });

      this.selectedImage =
        `data:image/jpeg;base64,${image.base64String}`;

    } catch (e) {
      console.log(e);
    }
  }

  async updateProfile() {

     const userId =
    localStorage.getItem('userId') || '';

  console.log('USER ID = ', userId);

  if (!userId) {

    const toast =
      await this.toastController.create({
        message: 'User ID Not Found. Login Again.',
        duration: 2500,
        color: 'danger'
      });

    await toast.present();
    return;
  }

  if (!this.nameOnFlyer.trim()) {

    const toast =
      await this.toastController.create({
        message: 'Enter Name',
        duration: 2000,
        color: 'danger'
      });

    await toast.present();
    return;
  }

  const loading =
    await this.loadingController.create({
      message: 'Updating...'
    });

  await loading.present();

  try {

    const data: any = {

      userId: userId,

      nameOnFlyer: this.nameOnFlyer,

      designationOnFlyer:
        this.designationOnFlyer || '',

      picOnFlyer:
        this.selectedImage || ''
    };

    console.log(
      'REQUEST DATA',
      JSON.stringify(data)
    );

    const response =
      await Http.request({

        method: 'POST',

        url:
          'https://www.ayyappatelugu.com/APICalls/Users/updateUserFlyerInfo',

        headers: {
          'Content-Type':
            'multipart/form-data'
        },

        data
      });

    console.log(
      'RAW RESPONSE',
      response.data
    );

    const parsed =
      typeof response.data === 'string'
        ? JSON.parse(response.data)
        : response.data;

    console.log(
      'PARSED RESPONSE',
      parsed
    );

    // SUCCESS CHECK

    if (
      parsed.status === 'Success' ||
      parsed.errorCode === '200' ||
      (parsed.message &&
        parsed.message
          .toLowerCase()
          .includes('success'))
    ) {

            // Flyer Data Save

         const userId =
  localStorage.getItem('userId') || '';

      // User-wise save
      localStorage.setItem(
        `flyerName_${userId}`,
        this.nameOnFlyer
      );

      localStorage.setItem(
        `flyerDesignation_${userId}`,
        this.designationOnFlyer
      );

      localStorage.setItem(
        `flyerPic_${userId}`,
        this.selectedImage
      );

      console.log(
        'Saved Flyer Data',
        localStorage.getItem(`flyerName_${userId}`),
        localStorage.getItem(`flyerDesignation_${userId}`),
        localStorage.getItem(`flyerPic_${userId}`)
      );

      const toast =
        await this.toastController.create({
          message:
            parsed.message ||
            'Profile Updated Successfully',
          duration: 2000,
          color: 'success'
        });

      await toast.present();

      console.log(
        'Navigating to Images List'
      );

      setTimeout(() => {

        this.router.navigateByUrl(
          '/ayyppa-images',
          {
            replaceUrl: true
          }
        );

      }, 500);

    } else {

      const toast =
        await this.toastController.create({
          message:
            parsed.message ||
            'Update Failed',
          duration: 2500,
          color: 'danger'
        });

      await toast.present();
    }

  } catch (e) {

    console.log(
      'UPLOAD ERROR',
      e
    );

    const toast =
      await this.toastController.create({
        message:
          'Upload Failed',
        duration: 2000,
        color: 'danger'
      });

    await toast.present();

  } finally {

    await loading.dismiss();
  }
}
}