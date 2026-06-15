import { CommonModule } from '@angular/common';
import { Http } from '@capacitor-community/http';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Share } from '@capacitor/share';
import html2canvas from 'html2canvas';



import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

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
@ViewChildren('posterCard', { read: ElementRef })
posterCards!: QueryList<ElementRef>

  images: any[] = [];
  baseUrl: string = '';

  userName = '';
  userRole = '';
  profileImage = '';

   currentIndex = 0;
  hasMoreData = true;
  isLoading = false;



  constructor(
  
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router
  ) { 
  
  }
  ngOnInit() {
      console.log(
    'flyerName =',
    localStorage.getItem('flyerName')
  );

  console.log(
    'flyerDesignation =',
    localStorage.getItem('flyerDesignation')
  );

  console.log(
    'flyerPic =',
    localStorage.getItem('flyerPic')
  );

    const userId =
      localStorage.getItem('userId') || '';

    this.userName =
      localStorage.getItem(
        `flyerName_${userId}`
      ) || '';

    this.userRole =
      localStorage.getItem(
        `flyerDesignation_${userId}`
      ) || '';

    this.profileImage =
      localStorage.getItem(
        `flyerPic_${userId}`
      ) || '';

  console.log(
    'HAS DATA =',
    this.hasFlyerData()
  );

    this.images = [];
    this.currentIndex = 0;
    this.getImages();
  }

    ionViewWillEnter() {

      const userId =
      localStorage.getItem('userId') || '';

    this.userName =
      localStorage.getItem(
        `flyerName_${userId}`
      ) || '';

    this.userRole =
      localStorage.getItem(
        `flyerDesignation_${userId}`
      ) || '';

    this.profileImage =
      localStorage.getItem(
        `flyerPic_${userId}`
      ) || '';

  console.log('flyerName', this.userName);
  console.log('flyerDesignation', this.userRole);
  console.log('flyerPic', this.profileImage);
}

  goToUploadDetails() {
  this.router.navigate(['/upload-details']);
}
async getImages(event?: any) {

    if (this.isLoading) return;

    this.isLoading = true;

    try {

      const response = await Http.post({

        url: 'https://www.ayyappatelugu.com/APICalls/imagesOneByOne',

         headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
                },

        data: {
          startIndex: this.currentIndex
        }

      });

      const parsedData =
        typeof response.data === 'string'
          ? JSON.parse(response.data)
          : response.data;

      this.baseUrl = parsedData.imageUrl || '';

      const newImages = parsedData.result || [];

      console.log(
        'Start Index =',
        this.currentIndex,
        newImages
      );

      if (newImages.length > 0) {

        this.images.push(newImages[0]);

      } else {

        this.hasMoreData = false;

      }

    } catch (error) {

      console.log(error);

      const toast =
        await this.toastController.create({
          message: 'Failed to load images',
          duration: 2000,
          color: 'danger'
        });

      await toast.present();

    } finally {

      this.isLoading = false;

      if (event) {
        event.target.complete();
      }
    }
  }

  async loadMore(event: any) {

    if (!this.hasMoreData) {
      event.target.disabled = true;
      return;
    }

    this.currentIndex++;

    await this.getImages(event);

    if (!this.hasMoreData) {
      event.target.disabled = true;
    }
  }

  async doRefresh(event: any) {

    this.images = [];
    this.currentIndex = 0;
    this.hasMoreData = true;

    await this.getImages();

    event.target.complete();
  }

hasFlyerData(): boolean {

  return (
    this.userName.trim() !== '' &&
    this.userRole.trim() !== '' &&
    this.profileImage.trim() !== ''
  );

}

async generateImageWithName(imageUrl: string): Promise<string> {

  return new Promise((resolve, reject) => {

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = async () => {

      try {

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject('Canvas Context Error');
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        // Main Poster
        ctx.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height
        );

        // Bottom White Area
        const boxHeight = canvas.height * 0.13;

        ctx.fillStyle = '#ffffff';

        ctx.fillRect(
          0,
          canvas.height - boxHeight,
          canvas.width,
          boxHeight
        );

        // Top Orange Line
        ctx.fillStyle = '#f57c00';

        ctx.fillRect(
          0,
          canvas.height - boxHeight,
          canvas.width,
          6
        );

        // Bottom Orange Line
        ctx.fillRect(
          0,
          canvas.height - 6,
          canvas.width,
          6
        );

        // Profile Image
        if (this.profileImage) {

          try {

            const pImg = new Image();
            pImg.crossOrigin = 'anonymous';

            await new Promise<void>((res) => {
              pImg.onload = () => res();
              pImg.src = this.profileImage;
            });

            const size = canvas.width * 0.15;

            const x =
              canvas.width - size - 25;

            const y =
              canvas.height - boxHeight +
              (boxHeight - size) / 2;

            ctx.save();

            ctx.beginPath();

            ctx.arc(
              x + size / 2,
              y + size / 2,
              size / 2,
              0,
              Math.PI * 2
            );

            ctx.closePath();
            ctx.clip();

            ctx.drawImage(
              pImg,
              x,
              y,
              size,
              size
            );

            ctx.restore();

          } catch (e) {

            console.log(
              'Profile image failed',
              e
            );
          }
        }

        // Name
        ctx.fillStyle = '#000000';

        ctx.font =
          `bold ${canvas.width * 0.035}px Arial`;

        ctx.fillText(
          this.userName || '',
          25,
          canvas.height - boxHeight + 45
        );

        // Designation
        ctx.fillStyle = '#444444';

        ctx.font =
          `${canvas.width * 0.025}px Arial`;

        ctx.fillText(
          this.userRole || '',
          25,
          canvas.height - boxHeight + 85
        );

        const finalImage =
          canvas.toDataURL(
            'image/jpeg',
            0.95
          );

        resolve(finalImage);

      } catch (err) {

        console.log(
          'Canvas Error',
          err
        );

        reject(err);
      }
    };

    img.onerror = (err) => {

      console.log(
        'Image Load Error',
        err
      );

      reject(err);
    };

    img.src = imageUrl;
  });
}
private async loadImage(src: string): Promise<HTMLImageElement> {
  const response = await fetch(src);
  const blob = await response.blob();

  const bitmap = await createImageBitmap(blob);

  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas error');

  ctx.drawImage(bitmap, 0, 0);

  const img = new Image();
  img.src = canvas.toDataURL();

  await new Promise((res) => {
    img.onload = res;
  });

  return img;
}

async sharePoster(index: number) {

  try {

    const item = this.images[index];

    const imageUrl =
      this.baseUrl + item.image;

    const imageData =
      await this.generateImageWithName(imageUrl);

    const result =
      await Filesystem.writeFile({

        path: `Poster_${Date.now()}.jpg`,

        data: imageData.split(',')[1],

        directory: Directory.Cache

      });

    await Share.share({
      title: 'Ayyappa Poster',
      url: result.uri
    });

  } catch (e) {

    console.log('SHARE ERROR', e);
  }
}
async downloadPoster(index: number) {

  try {

    console.log('DOWNLOAD START');

    const imageData = await this.captureCard(index);

    console.log('IMAGE GENERATED');

    const result = await Filesystem.writeFile({
      path: `Poster_${Date.now()}.png`,
      data: imageData.split(',')[1],
      directory: Directory.Cache
    });

    console.log('FILE SAVED', result.uri);

    await Share.share({
      title: 'Ayyappa Poster',
      url: result.uri
    });

  } catch (e) {

    console.log('DOWNLOAD ERROR =>', e);
  }
}
async captureCard(index: number): Promise<string> {

  console.log('CAPTURE START');

  const cards = this.posterCards.toArray();

  if (!cards[index]) {
    throw new Error('Card not found');
  }

  const element = cards[index].nativeElement;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    removeContainer: false
  });

  console.log('CANVAS CREATED');

  const image = canvas.toDataURL('image/png');

  console.log('CAPTURE SUCCESS');

  return image;
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
function addIcons(arg0: { 'share-social': any; download: any; }) {
  throw new Error('Function not implemented.');
}

