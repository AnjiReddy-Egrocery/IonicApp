import { CommonModule } from '@angular/common';
import { Http } from '@capacitor-community/http';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Share } from '@capacitor/share';
import { Media } from '@capacitor-community/media';

import html2canvas from 'html2canvas';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';

register();


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
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImagesListComponent  implements OnInit {
@ViewChildren('posterCard') posterCards!: QueryList<ElementRef>;

  images: any[] = [];
  baseUrl: string = '';
  currentIndex = 0;
  hasMoreData = true;
  isLoading = false;
  userName = '';
  userRole = '';
  profileImage = '';

  constructor(private toastController: ToastController, private router: Router) {}

  ngOnInit() {
    this.loadFlyerData();
    this.getImages();
  }

  loadFlyerData() {
    const userId = localStorage.getItem('userId') || '';
    this.userName = localStorage.getItem(`flyerName_${userId}`) || '';
    this.userRole = localStorage.getItem(`flyerDesignation_${userId}`) || '';
    this.profileImage = localStorage.getItem(`flyerPic_${userId}`) || '';
  }

  async getImages(event?: any) {
    if (this.isLoading) return;
    this.isLoading = true;
    try {
      const response = await Http.post({
        url: 'https://www.ayyappatelugu.com/APICalls/imagesOneByOne',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: { startIndex: this.currentIndex },
      });
      const parsedData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      this.baseUrl = parsedData.imageUrl || '';
      if (parsedData.result?.length > 0) {
        this.images.push(parsedData.result[0]);
      } else {
        this.hasMoreData = false;
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
      if (event) event.target.complete();
    }
  }

async sharePoster(index: number) {
  console.log("=== [STARTING SHARE PROCESS] ===");

  if (!this.hasFlyerData()) {
    this.showToast("Please upload details first.");
    return;
  }

  try {
    const item = this.images[index];
    const imageUrl = this.baseUrl + item.image;

    // 1. Download
    const result = await Filesystem.downloadFile({
      url: imageUrl,
      path: 'share_temp.jpg',
      directory: Directory.Cache
    });

    const fileUri = await Filesystem.getUri({ path: 'share_temp.jpg', directory: Directory.Cache });

    // 2. Conversion
    const finalSrc = (window as any).Ionic?.WebView?.convertFileSrc 
                     ? (window as any).Ionic.WebView.convertFileSrc(fileUri.uri) 
                     : Capacitor.convertFileSrc(fileUri.uri);

    const img = new Image();
    img.src = finalSrc;
    await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; });

    const profileImg = new Image();
    profileImg.src = this.profileImage;
    await new Promise((resolve) => { profileImg.onload = resolve; profileImg.onerror = () => resolve(null); });

    // 3. Canvas Drawing (Profile Right, Text Left)
    const stripHeight = 200;
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height + stripHeight;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const centerY = img.height + (stripHeight / 2);
    const profileX = canvas.width - 120; // Position on right
    const textX = 30;                   // Position on left

    // Draw Profile (Right)
    if (profileImg.complete && profileImg.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(profileX, centerY, 70, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(profileImg, profileX - 70, centerY - 70, 140, 140);
      ctx.restore();
    }

    // Draw Text (Left)
    ctx.fillStyle = "#333";
    ctx.font = "bold 50px Arial";
    ctx.textAlign = "left";
    ctx.fillText(this.userName, textX, img.height + 90);
    
    ctx.fillStyle = "#666";
    ctx.font = "40px Arial";
    ctx.fillText(this.userRole, textX, img.height + 150);

    // 4. Saving & Sharing
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    const shareFileName = `share_${Date.now()}.jpg`;

    await Filesystem.writeFile({
      path: shareFileName,
      data: imageData.split(',')[1],
      directory: Directory.Cache
    });

    const shareUri = await Filesystem.getUri({ path: shareFileName, directory: Directory.Cache });

    await Share.share({
      title: 'స్వామి శరణం',
      text: '',
      files: [shareUri.uri], 
      dialogTitle: 'Share your poster',
    });

  } catch (e: any) {
    console.error("Share Error:", e);
    this.showToast("Share failed");
  }
}

async downloadPoster(index: number) {
  console.log("=== [STARTING DOWNLOAD PROCESS] ===");
  
  if (!this.hasFlyerData()) {
    this.showToast("Please upload details first.");
    return;
  }

  try {
    const item = this.images[index];
    const imageUrl = this.baseUrl + item.image;

    const result = await Filesystem.downloadFile({
      url: imageUrl,
      path: 'poster_temp.jpg',
      directory: Directory.Cache
    });

    const fileUri = await Filesystem.getUri({ path: 'poster_temp.jpg', directory: Directory.Cache });
    const finalSrc = (window as any).Ionic?.WebView?.convertFileSrc 
                     ? (window as any).Ionic.WebView.convertFileSrc(fileUri.uri) 
                     : Capacitor.convertFileSrc(fileUri.uri);

    const img = new Image();
    img.src = finalSrc;
    await new Promise((resolve, reject) => { img.onload = () => resolve(true); img.onerror = reject; });

    const profileImg = new Image();
    profileImg.src = this.profileImage;
    await new Promise((resolve) => { profileImg.onload = () => resolve(true); profileImg.onerror = () => resolve(null); });

    // Canvas Drawing (Profile Right, Text Left)
    const stripHeight = 200;
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height + stripHeight;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const centerY = img.height + (stripHeight / 2);
    const profileX = canvas.width - 120;
    const textX = 30;

    if (profileImg.complete && profileImg.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(profileX, centerY, 70, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(profileImg, profileX - 70, centerY - 70, 140, 140);
      ctx.restore();
    }

    ctx.fillStyle = "#333333";
    ctx.font = "bold 50px Arial";
    ctx.textAlign = "left";
    ctx.fillText(this.userName, textX, img.height + 90);
    ctx.fillStyle = "#666666";
    ctx.font = "40px Arial";
    ctx.fillText(this.userRole, textX, img.height + 150);

    // Saving
    const imageData = canvas.toDataURL('image/jpeg', 1.0);
    const fileName = `poster_${Date.now()}.jpg`;

    await Filesystem.writeFile({
      path: fileName,
      data: imageData.split(',')[1],
      directory: Directory.Documents
    });

    const finalUri = await Filesystem.getUri({ path: fileName, directory: Directory.Documents });
    await Media.savePhoto({ path: finalUri.uri });
    
    this.showToast("Poster Downloaded Successfully!");

  } catch (e: any) {
    console.error("=== CRITICAL ERROR ===", e);
    this.showToast("Download failed.");
  }
}

// హెల్పర్ ఫంక్షన్: Blob నుండి Base64 కి మార్చడానికి
blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
 async showToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }



  async loadMore(event: any) {
  // ఇండెక్స్‌ని పెంచి మళ్ళీ డేటా ఫెచ్ చేయడం
  this.currentIndex++;
  await this.getImages(event);
}

  hasFlyerData(): boolean {
    return this.userName.trim() !== '' && this.userRole.trim() !== '' && this.profileImage.trim() !== '';
  }

  goToUploadDetails() {
  this.router.navigate(['/upload-details'], {
    queryParams: {
      returnUrl: '/ayyppa-images'
    }
  });
}
  goToAnadanam() { this.router.navigate(['/anadanam']); }
  goToNityaPooja() { this.router.navigate(['/nityapooja']); }
}