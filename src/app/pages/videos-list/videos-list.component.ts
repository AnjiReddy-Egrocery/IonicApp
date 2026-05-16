import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { Http } from '@capacitor-community/http';
import { Share } from '@capacitor/share';


@Component({
  selector: 'app-videos-list',
  templateUrl: './videos-list.component.html',
  styleUrls: ['./videos-list.component.scss'],
   standalone: true,
  imports: [     
    IonicModule,      // ✅ required for all ion-* components
    FormsModule,      // ✅ required for [(ngModel)]
    CommonModule,
  ],
})
export class VideosListComponent  implements OnInit {

  videos: any[] = [];

  baseUrl = '';
  currentPlayingVideo?: HTMLVideoElement;

  constructor(
     private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.getVideos();
  }

   async getVideos(event?: any) {

    const loading = await this.loadingController.create({
      message: 'Loading Videos...'
    });

    if (!event) {
      await loading.present();
    }

    try {

      const response = await Http.post({

        url: 'https://www.ayyappatelugu.com/APICalls/videos',

        headers: {
          'Content-Type': 'application/json'
        },

        data: {}
      });

      const parsedData =
        typeof response.data === 'string'
          ? JSON.parse(response.data)
          : response.data;

      console.log('VIDEOS:', parsedData);

      this.baseUrl = parsedData.videoUrl;

      this.videos = parsedData.result;

    } catch (e) {

      console.log(e);

      const toast = await this.toastController.create({
        message: 'Failed to load videos',
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

  playVideo(event: any) {

    const video: HTMLVideoElement = event.target;

    // pause previous
    if (this.currentPlayingVideo &&
        this.currentPlayingVideo !== video) {

      this.currentPlayingVideo.pause();
    }

    this.currentPlayingVideo = video;

    video.play();
  }

  pauseVideo(event: any) {

    const video: HTMLVideoElement = event.target;

    video.pause();
  }

  async shareVideo(videoUrl: string) {

    try {

      await Share.share({

        title: 'Ayyappa Telugu',

        text: 'Share Video',

        url: videoUrl,

        dialogTitle: 'Share Video'
      });

    } catch (e) {

      console.log(e);
    }
  }

  downloadVideo(videoUrl: string, fileName: string) {

    const a = document.createElement('a');

    a.href = videoUrl;

    a.download = fileName;

    a.target = '_blank';

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
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


