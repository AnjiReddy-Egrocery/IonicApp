import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AlertController, IonicModule, MenuController, Platform } from '@ionic/angular';
import { News } from 'src/app/services/news';
import { Templelist } from 'src/app/services/templelist';
import { Ayyappatemplelist } from 'src/app/services/ayyappatemplelist';
import { Auth } from 'src/app/services/auth';
import { Ads, AdItem, BannerItem } from 'src/app/services/ads';
import { App } from '@capacitor/app';
import { PinchZoomComponent } from 'src/app/components/pinch-zoom/pinch-zoom.component';

@Component({
  selector: 'app-swamy-dashboard',
  templateUrl: './swamy-dashboard.page.html',
  styleUrls: ['./swamy-dashboard.page.scss'],
  standalone: true,
 imports: [IonicModule, CommonModule,PinchZoomComponent],
})
export class SwamyDashboardPage implements OnInit, OnDestroy {

   newsList: any[] = [];
     name: string = '';
      email: string = '';
      image: string = 'assets/ic_launcher.png';

       @ViewChild('templeScroll', { read: ElementRef }) templeScroll!: ElementRef;
              @ViewChild('ayyappatempleScroll', { read: ElementRef }) ayyappatempleScroll!: ElementRef;



  // ---------- Hero section (static data, same as Android HomeActivity) ----------
  @ViewChild('heroTrack') heroTrack?: ElementRef<HTMLDivElement>;
  heroIndex = 0;
  private heroTimer: any = null;
  private readonly HERO_AUTO_SLIDE_MS = 4000;

  heroBanners: BannerItem[] = [];
  heroBaseUrl = '';

  async loadHero() {
    try {
      const res = await this.adsService.getBannerImages();
      if (res && res.errorCode === '200' && res.result?.length) {
        this.heroBaseUrl = res.imageUrl || '';
        this.heroBanners = res.result;
        this.heroIndex = 0;
        this.startHeroAutoSlide();
      } else {
        this.hideHero();
      }
    } catch (err) {
      console.error('HERO_API error', err);
      this.hideHero();
    }
  }

  private hideHero() {
    this.stopHeroAutoSlide();
    this.heroBanners = [];
  }

  /** Opens banner button / ad links: http(s) -> browser, "/route" -> in-app route */
  openLink(url?: string) {
    if (!url || !url.trim()) return;
    const link = url.trim();
    if (link.startsWith('/')) {
      this.router.navigateByUrl(link);
      return;
    }
    window.open(link, '_blank');
  }

  // ---------- Ads carousel (API: APICalls/ad-images) ----------
  @ViewChild('adsTrack') adsTrack?: ElementRef<HTMLDivElement>;
  ads: AdItem[] = [];
  adsBaseUrl = '';
  adsIndex = 0;
  private adsTimer: any = null;
  private readonly ADS_AUTO_SLIDE_MS = 3000;

  async loadAds() {
    try {
      const res = await this.adsService.getAdImages();
      if (res && res.errorCode === '200' && res.result?.length) {
        this.adsBaseUrl = res.imageUrl || '';
        this.ads = res.result;
        this.adsIndex = 0;
        this.startAdsAutoSlide();
      } else {
        this.hideAds();
      }
    } catch (err) {
      console.error('ADS_API error', err);
      this.hideAds();
    }
  }

  private hideAds() {
    this.stopAdsAutoSlide();
    this.ads = [];
  }

  onAdsScroll() {
    const el = this.adsTrack?.nativeElement;
    if (!el || !el.clientWidth) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== this.adsIndex) {
      this.adsIndex = idx;
      this.startAdsAutoSlide();
    }
  }

  startAdsAutoSlide() {
    this.stopAdsAutoSlide();
    if (this.ads.length < 2) return;
    this.adsTimer = setTimeout(() => {
      const el = this.adsTrack?.nativeElement;
      if (!el) return;
      const next = (this.adsIndex + 1) % this.ads.length; // loops back to first
      el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
    }, this.ADS_AUTO_SLIDE_MS);
  }

  stopAdsAutoSlide() {
    if (this.adsTimer) {
      clearTimeout(this.adsTimer);
      this.adsTimer = null;
    }
  }

  openAd(url: string) {
    this.openLink(url);   // adds nothing special: http(s) -> browser, "/route" -> in-app
  }

  onHeroScroll() {
    const el = this.heroTrack?.nativeElement;
    if (!el || !el.clientWidth) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== this.heroIndex) {
      this.heroIndex = idx;
      this.startHeroAutoSlide(); // restart timer after swipe / slide change
    }
  }

  goToHeroSlide(i: number) {
    const el = this.heroTrack?.nativeElement;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  }

  startHeroAutoSlide() {
    this.stopHeroAutoSlide();
    if (this.heroBanners.length < 2) return;
    this.heroTimer = setTimeout(() => {
      this.goToHeroSlide((this.heroIndex + 1) % this.heroBanners.length); // loops back to first
    }, this.HERO_AUTO_SLIDE_MS);
  }

  stopHeroAutoSlide() {
    if (this.heroTimer) {
      clearTimeout(this.heroTimer);
      this.heroTimer = null;
    }
  }

  ionViewDidEnter() {
    this.startHeroAutoSlide();
    this.startAdsAutoSlide();
  }

  ionViewWillLeave() {
    this.stopHeroAutoSlide();
    this.stopAdsAutoSlide();
  }

  ngOnDestroy() {
    this.stopHeroAutoSlide();
    this.stopAdsAutoSlide();
  }

  ayyappaTemples: any[] = [];
  temples: any[] =[];
  
   
  constructor(private router: Router,private menu: MenuController,private service: News,
    private templeservice: Templelist,private ayyappatempleservice: Ayyappatemplelist, 
    private authService: Auth, private adsService: Ads, private alertCtrl: AlertController, private platform: Platform,private menuCtrl: MenuController
    
) {
    
  }
 

    async ngOnInit() {

        this.platform.ready().then(() => {
            this.platform.backButton.subscribeWithPriority(10, () => {
                this.showExitConfirmationDialog();
            });
          });

      const user = await this.authService.getUser();
        if (user) {
          this.name = user.name;
          this.email = user.email;
          this.image = user.image || this.image;
        }

        const userId = localStorage.getItem('userId') || '';

  const profilePic =
    localStorage.getItem(`profilePic_${userId}`);

  if (profilePic) {
    this.image = profilePic;
  } else if (user?.image) {
    this.image = user.image;
  } else {
    this.image = 'assets/ic_launcher.png';
  }
    this.loadNews();
        this.loadHero();
        this.loadAds();
        this.loadAyyappaTemples();
        this.loadTemples();

        this.menuCtrl.close();

  }
  ionViewWillEnter() {

  const userId =
    localStorage.getItem('userId') || '';

  this.name =
    (localStorage.getItem('firstName') || '') +
    ' ' +
    (localStorage.getItem('lastName') || '');

  this.email =
    localStorage.getItem('email') || '';

  this.image =
    localStorage.getItem(`profilePic_${userId}`) ||
    'assets/ic_launcher.png';
}
  async loadTemples() {
     try {
    const res = await this.ayyappatempleservice.getTempleList();

    if (res.errorCode === '200' && res.result?.length) {

      const baseUrl = `https://www.ayyappatelugu.com/public/assets/img/temple_images/`;

      this.temples = res.result.slice(0, 10).map((t: any) => ({
        templeName: t.templeName,
        templeNameTelugu: t.templeNameTelugu,
        openingTime: t.openingTime,
        closingTime: t.closingTime,
        location: t.location,
        image: t.image,
        imageUrl: baseUrl + t.image, // for UI
        fullData: t                   // ⭐ Keep entire object
      }));
    }
  } catch (err) {
    console.error('Error fetching temples', err);
  }
  }

  async loadAyyappaTemples() {
  try {
    const res = await this.templeservice.getTempleList();

    if (res.errorCode === '200' && res.result?.length) {

      const baseUrl = `https://www.ayyappatelugu.com/public/assets/img/temple_images/`;

      this.ayyappaTemples = res.result.slice(0, 10).map((t: any) => ({
        templeName: t.templeName,
        templeNameTelugu: t.templeNameTelugu,
        openingTime: t.openingTime,
        closingTime: t.closingTime,
        location: t.location,
        image: t.image,
        imageUrl: baseUrl + t.image, // for UI
        fullData: t                   // ⭐ Keep entire object
      }));
    }
  } catch (err) {
    console.error('Error fetching temples', err);
  }
}


  navigate(page: string) {
    switch (page) {
      case 'Ayyapa_karyam': this.router.navigate(['/ayyapa-karyam']); break;
      case 'ayyappa_calender': this.router.navigate(['/calendar']); break;
    }
  }

   async loadNews() {
    
           try {
    const res = await this.service.getNewsList(); // <-- Promise-based
    console.log('✅ Response:', res);
    this.newsList = res.result || [];
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
   }

   refreshList(event: any) {
    this.loadNews();
    event.target.complete();
  }

async logout() {

  await this.authService.logout();

  localStorage.removeItem('userId');
  localStorage.removeItem('userMid');
  localStorage.removeItem('userName');

  // flyer data remove cheyyoddu

  this.router.navigateByUrl('/dashboard', {
    replaceUrl: true
  });
}
  goToAnadanam() {
     this.menuCtrl.close();
    this.router.navigateByUrl('/anadanam');
  }

  goToTemples(){
     this.menuCtrl.close();
    this.router.navigateByUrl('/temples');
  }
  goToAyyappaTemples(){
     this.menuCtrl.close();
    this.router.navigateByUrl('/ayyappatemples');
  }

  goToNityaPooja() {
     this.menuCtrl.close();
    this.router.navigate(['/nityapooja']);
  }

  goToGuruSwami() {
     this.menuCtrl.close();
  this.router.navigateByUrl('/ayyappa_guruswami');
}

  goToBhajanaMandali() {
     this.menuCtrl.close();
    this.router.navigateByUrl('/ayyappa_bajanamandali');
  }

   goToBhajanaSongs() {
     this.menuCtrl.close();
    this.router.navigateByUrl('/ayyappabajana-songs');
  }

  goToBlogs() {
     this.menuCtrl.close();
    this.router.navigateByUrl('/ayyappa_blogs');
  }

  goToPadaYatra() {
     this.menuCtrl.close();
    this.router.navigateByUrl('/ayyppa-padayatra');
  }
goToProfile() {
     this.menuCtrl.close();
    this.router.navigateByUrl('/ayyappaprofile');
  }
  gotoImages() {
     this.menuCtrl.close();
    this.router.navigateByUrl('/ayyppa-images');
  }

  gotoVideos() {
     this.menuCtrl.close();
    this.router.navigateByUrl('/ayyppa-videos');
  }


    goToSharanughosha() {
       this.menuCtrl.close();
    this.router.navigateByUrl('/sharanughosha');
     
  }
  goToPoojaKaryakramam(){
     this.menuCtrl.close();
    this.router.navigateByUrl('/poojakrayakramam');
  }
  gotoaboutUs(){
     this.menuCtrl.close();
    this.router.navigateByUrl('/aboutUs');
  }
  goToPrivacyPolicy(){
     this.menuCtrl.close();
    this.router.navigateByUrl('/privacypolicy');
  }
  goToCalender(){
     this.menuCtrl.close();
    this.router.navigateByUrl('/calender');
  }
  goToTeluguCalender(){
     this.menuCtrl.close();
    this.router.navigateByUrl('/telugu-calender');
  }
  goToPanchangam(){
     this.menuCtrl.close();
    this.router.navigateByUrl('/panchangam');
  }
  goToBooks(){
     this.menuCtrl.close();
    this.router.navigateByUrl('/books');
  }
  goToToures(){
     this.menuCtrl.close();
    this.router.navigateByUrl('/toures');
  }
  goToPoojaPetam(){
     this.menuCtrl.close();
    this.router.navigateByUrl('/poojapetam');
  }
  goToProducts(){
     this.menuCtrl.close();
     this.router.navigateByUrl('/products');
  }

    openNewsDetails(news: any) {
       this.menuCtrl.close();
       this.router.navigate(['/viewallnews_details'], {
    queryParams: { 
      newsId:
        news.newsId,
        Name: news.newsTitle,
        Image: news.image, 
        Discription: news.newsDescription
    }
  });

  
}

 async showExitConfirmationDialog() {
     const alert = await this.alertCtrl.create({
    header: 'Exit App',
    message: 'Do you want to exit Ayyappa Telugu?',
    buttons: [
      {
        text: 'No',
        role: 'cancel'
      },
      {
        text: 'Yes',
        handler: () => {
          App.exitApp();
        }
      }
    ]
  });

  await alert.present();
  }

 

  viewAllNews() {
     this.menuCtrl.close();
   this.router.navigateByUrl('/view-all-news');
  }

  viewAllAyyappaTemples(){
     this.menuCtrl.close();
    this.router.navigateByUrl('/temples');
  }

  gotoSettings(){
     this.menuCtrl.close();
    this.router.navigateByUrl('/settings');
  }

   scrollLeft() {
    this.templeScroll.nativeElement.scrollBy({
      left: -200,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    this.templeScroll.nativeElement.scrollBy({
      left: 200,
      behavior: 'smooth'
    });
  }

     ayyappascrollLeft() {
    this.ayyappatempleScroll.nativeElement.scrollBy({
      left: -200,
      behavior: 'smooth'
    });
  }

  ayyapascrollRight() {
    this.ayyappatempleScroll.nativeElement.scrollBy({
      left: 200,
      behavior: 'smooth'
    });
  }

 
openTempleDetails(temple: any) {
 this.menuCtrl.close();

  console.log("Selected Temple:", temple);

 this.router.navigate(['/ayyappatemplelistdetails'], {
    queryParams: {
      templeName: temple.templeName,
      templeNameTelugu: temple.templeNameTelugu,
      openingTime: temple.openingTime,
      closingTime: temple.closingTime,
      location: temple.location,
      image: temple.imageUrl
    }
  });


}

viewAllTemples(){
 this.menuCtrl.close();
  this.router.navigateByUrl('/ayyappatemples');

}

openAyyappaTempleDetails(ayyappatemple: any){
   this.menuCtrl.close();
  console.log("Selected Temple:", ayyappatemple);

 this.router.navigate(['/ayyappatemplelistdetails'], {
    queryParams: {
      templeName: ayyappatemple.templeName,
      templeNameTelugu: ayyappatemple.templeNameTelugu,
      openingTime: ayyappatemple.openingTime,
      closingTime: ayyappatemple.closingTime,
      location: ayyappatemple.location,
      image: ayyappatemple.imageUrl
    }
  });
}

  onImageError(event: any) {
  event.target.src = '../../../assets/ayyapaimage.jpeg'; // fallback static image
}


}

