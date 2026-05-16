import { CommonModule } from '@angular/common';
import { Http } from '@capacitor-community/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Share } from '@capacitor/share';


import { IonicModule, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-images-list',
  templateUrl: './images-list.component.html',
  styleUrls: ['./images-list.component.scss'],
    standalone: true,
  imports: [     
    IonicModule,      // ✅ required for all ion-* components
    FormsModule,      // ✅ required for [(ngModel)]
    CommonModule,
  ],
})
export class ImagesListComponent  implements OnInit {

  images: any[] = [];
  baseUrl: string = '';

  constructor(
  
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router
  ) { 
    
  }

  ngOnInit() {
    this.getImages();
  }
async getImages(event?: any) {

  const loading = await this.loadingController.create({
    message: 'Loading...'
  });

  if (!event) {
    await loading.present();
  }

  try {

    const response = await Http.post({

      url: 'https://www.ayyappatelugu.com/APICalls/images',

      headers: {
        'Content-Type': 'application/json'
      },

      data: {}

    });

    console.log('API RESPONSE:', response.data);

    const parsedData =
      typeof response.data === 'string'
        ? JSON.parse(response.data)
        : response.data;

    this.baseUrl = parsedData.imageUrl;
    this.images = parsedData.result;

  } catch (error) {

    console.log('API ERROR:', error);

    const toast = await this.toastController.create({
      message: 'Failed to load images',
      duration: 2000,
      color: 'danger'
    });

    toast.present();

  } finally {

    if (!event) {
      loading.dismiss();
    }

    if (event) {
      event.target.complete();
    }
  }
}
async shareImage(imageUrl: string) {

    try {

      await Share.share({
        title: 'Ayyappa Telugu',
        text: 'Share Image',
        url: imageUrl,
        dialogTitle: 'Share Image'
      });

    } catch (e) {

      console.log(e);
    }
  }
downloadImage(imageUrl: string, fileName: string) {

  try {

    const link = document.createElement('a');

    link.href = imageUrl;

    link.download = fileName;

    link.target = '_blank';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  } catch (e) {

    console.log('Download Error:', e);
  }
}

  navigate(page: string) {
      this.router.navigate([`/${page}`]);
    }
      goToAnadanam() {
      this.router.navigate(['/anadanam']);
    }
  
    goToNityaPooja() {
      this.router.navigate(['/nityapooja']);
    }

}
