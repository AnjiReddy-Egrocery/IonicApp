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

  currentIndex = 0;
hasMoreData = true;
isLoading = false;

filteredList: any[] = [];
searchQuery = '';



  constructor(
     private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.videos = [];
   this.currentIndex = 0;
    this.getVideos();
  }
async getVideos(event?: any) {

  if (this.isLoading) return;

  this.isLoading = true;

  try {

    const response = await Http.post({

      url: 'https://www.ayyappatelugu.com/APICalls/videosOneByOne',

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

    this.baseUrl = parsedData.videoUrl || '';

    const newVideos = parsedData.result || [];
   

    console.log(
      'Start Index =',
      this.currentIndex,
      newVideos
    );

    if (newVideos.length > 0) {

      this.videos.push(newVideos[0]);
      this.filteredList = [...this.videos];

    } else {

      this.hasMoreData = false;

    }

  } catch (e) {

    console.log(e);

  } finally {

    this.isLoading = false;

    if (event) {
      event.target.complete();
    }
  }
}

filterResults(event: any) {
    const query = (event.target.value || '').toLowerCase();

    this.filteredList = this.videos.filter(item => {
      const nameTelugu = (item. titleTelugu || '').toLowerCase();
     
      const nameEnglish = this.toEnglishTransliteration(item.title || '').toLowerCase();
      

      return nameTelugu.includes(query) ||
             
             nameEnglish.includes(query) ;
    });
  }

  // ✅ Telugu → English transliteration
  toEnglishTransliteration(text: string): string {
    const consonants: any = {
      'క': 'k', 'ఖ': 'kh', 'గ': 'g', 'ఘ': 'gh', 'ఙ': 'ng',
      'చ': 'ch', 'ఛ': 'chh', 'జ': 'j', 'ఝ': 'jh', 'ఞ': 'ny',
      'ట': 't', 'ఠ': 'th', 'డ': 'd', 'ఢ': 'dh', 'ణ': 'n',
      'త': 't', 'థ': 'th', 'ద': 'd', 'ధ': 'dh', 'న': 'n',
      'ప': 'p', 'ఫ': 'ph', 'బ': 'b', 'భ': 'bh', 'మ': 'm',
      'య': 'y', 'ర': 'r', 'ల': 'l', 'వ': 'v', 'శ': 'sh',
      'ష': 'sh', 'స': 's', 'హ': 'h', 'ళ': 'l', 'ఱ': 'r'
    };

    const vowels: any = {
      'అ': 'a', 'ఆ': 'aa', 'ఇ': 'i', 'ఈ': 'ii', 'ఉ': 'u', 'ఊ': 'uu',
      'ఋ': 'ru', 'ఎ': 'e', 'ఏ': 'ee', 'ఐ': 'ai', 'ఒ': 'o', 'ఓ': 'oo', 'ఔ': 'au',
      'ం': 'm', 'ః': 'h'
    };

    const vowelSigns: any = {
      'ా': 'aa', 'ి': 'i', 'ీ': 'ii', 'ు': 'u', 'ూ': 'uu',
      'ె': 'e', 'ే': 'ee', 'ై': 'ai', 'ొ': 'o', 'ో': 'oo', 'ౌ': 'au', '్': ''
    };

    let result = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (consonants[ch]) result += consonants[ch] + 'a';
      else if (vowels[ch]) result += vowels[ch];
      else if (vowelSigns[ch]) result = result.slice(0, -1) + vowelSigns[ch];
      else result += ch;
    }
    return result;
  }


async loadMore(event: any) {

  if (!this.hasMoreData) {
    event.target.disabled = true;
    return;
  }

  this.currentIndex++;

  await this.getVideos(event);

  if (!this.hasMoreData) {
    event.target.disabled = true;
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


