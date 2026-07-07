import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { Http } from '@capacitor-community/http';
import { Share } from '@capacitor/share';
import { VideoMerge } from 'src/app/services/video-merge';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';



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

  userName = '';
  userRole = '';
  profileImage = '';

  currentIndex = 0;
  hasMoreData = true;
  isLoading = false;

  filteredList: any[] = [];
  searchQuery = '';
  isMerging = false;

  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController,
    private videoMergeService: VideoMerge,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.getVideos();
  }

  ionViewWillEnter() {
    this.loadUserData();
  }

  loadUserData() {
    const userId = localStorage.getItem('userId') || '';
    this.userName = localStorage.getItem(`flyerName_${userId}`) || '';
    this.userRole = localStorage.getItem(`flyerDesignation_${userId}`) || '';
    this.profileImage = localStorage.getItem(`flyerPic_${userId}`) || '';
  }
  


async getVideos(event?: any) {

  if (this.isLoading || this.isMerging) return;

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

          console.log('API RESPONSE:', parsedData);

    this.baseUrl = parsedData.videoUrl || '';

    const newVideos = parsedData.result || [];
   

   console.log('NEW VIDEOS:', newVideos);
    console.log('FIRST VIDEO:', newVideos[0]);

    if (newVideos.length > 0) {

      this.videos.push(newVideos[0]);
      console.log('ALL VIDEOS:', this.videos);
      if (this.searchQuery) {

  this.filterResults({
    target: {
      value: this.searchQuery
    }
  });

    console.log('FILTERED LIST:', this.filteredList);

} else {

  this.filteredList =
    [...this.videos];
}
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



hasFlyerData(): boolean {

 return (

  this.userName.trim() !== '' &&
  this.userRole.trim() !== '' &&
  this.profileImage.trim() !== ''

 );

}

goToUploadDetails() {
  this.router.navigate(['/upload-details'], {
    queryParams: {
      returnUrl: '/ayyppa-videos'
    }
  });
}

filterResults(event: any) {
    const query =
    (event.target.value || '')
      .trim()
      .toLowerCase();

  if (!query) {
    this.filteredList = [...this.videos];
    return;
  }

  this.filteredList =
    this.videos.filter(item => {

      const title =
        (item.title ||
         item.videoTitle ||
         item.titleTelugu ||
         '')
        .toLowerCase();

      const titleEnglish =
        this.toEnglishTransliteration(title)
          .toLowerCase();

      return (
        title.includes(query) ||
        titleEnglish.includes(query)
      );
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
async createShareDownload(item: any) {
  if (!this.hasFlyerData()) {
    this.showToast("Please upload the details first.");
    return;
  }
  if (this.isMerging) return;
  this.isMerging = true;

  const loading = await this.loadingController.create({
    message: 'వీడియో సిద్ధమౌతోంది...'
  });
  await loading.present();

  try {
    // 1. Download video
    const videoPath = await this.videoMergeService.downloadFile(this.baseUrl + item.video);

    // 2. Poster file
    const posterPath = await this.base64ToFile(this.profileImage);

    // 3. MERGE
    const outputPath = await this.videoMergeService.merge(videoPath, posterPath, this.userName, this.userRole);
    console.log("FINAL OUTPUT PATH:", outputPath);

    // 4. URL షేరింగ్ కోసం పాత్ సెట్ చేయడం
    // iOS/Androidలో ఫైల్ పాత్ ఖచ్చితంగా 'file://' తో ఉండాలి
    let shareUrl = outputPath;
    if (!shareUrl.startsWith("file://")) {
      shareUrl = "file://" + shareUrl;
    }

    // 5. SHARE VIA URL
    // 'files' బదులు 'url' ని ఉపయోగించండి
    await Share.share({
      title: 'స్వామి శరణం అయ్యప్ప',
      text: '',
      url: shareUrl, 
      dialogTitle: 'Share'
    });

  } catch (e) {
    console.error("Share Error:", e);
    this.showToast("షేర్ చేయడం విఫలమైంది!");
  } finally {
    await loading.dismiss();
    this.isMerging = false;
  }
}

  // ---------------- DOWNLOAD ----------------
async createDownloadOnly(item: any) {

  if (!this.hasFlyerData()) {
    this.showToast("Please upload the details first.");
    return;
  }

  if (this.isMerging) return;
  this.isMerging = true;

  const loading = await this.loadingController.create({
    message: 'వీడియో డౌన్‌లోడ్ అవుతోంది...'
  });

  await loading.present();

  try {

    console.log("🚀 START DOWNLOAD");

    // Download video
    const videoPath =
      await this.videoMergeService.downloadFile(
        this.baseUrl + item.video
      );

    // Poster
    const posterPath =
      await this.base64ToFile(this.profileImage);

    // Merge (already saves into Documents)
    const outputPath =
      await this.videoMergeService.merge(
              videoPath, 
        posterPath, 
        this.userName,   // కొత్తగా పంపాము
        this.userRole    // కొత్తగా పంపాము
      );

    console.log("✅ Saved:", outputPath);

    this.showToast("వీడియో విజయవంతంగా సేవ్ అయింది!");

  } catch (e) {

    console.error(e);
    this.showToast("డౌన్‌లోడ్ విఫలమైంది!");

  } finally {

    await loading.dismiss();
    this.isMerging = false;

  }
}

  // ---------------- BLOB TO BASE64 ----------------
private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data.split(',')[1]); 
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async base64ToFile(base64Data: string): Promise<string> {
    if (!base64Data) return '';
    const fileName = `poster_${Date.now()}.jpg`;
    
    // ఒకవేళ డేటా లో ఆల్రెడీ 'data:image' హెడర్ ఉంటేనే స్ప్లిట్ చేయాలి
    const base64Content = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
    
    await Filesystem.writeFile({
      path: fileName,
      data: base64Content,
      directory: Directory.Cache
    });

    const uri = await Filesystem.getUri({
      directory: Directory.Cache,
      path: fileName
    });

    // FFmpeg కి Native file:// పాత్ కావాలి, కాబట్టి నేరుగా uri.uri రిటర్న్ చేయాలి
    return uri.uri;
  }

  async showToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
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


