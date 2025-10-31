import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';


import { Router } from '@angular/router';
import { AlertController, IonicModule, MenuController, Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { News } from 'src/app/services/news';
import { Auth } from 'src/app/services/auth';
import { HttpClient } from '@angular/common/http'



import { Geolocation } from '@capacitor/geolocation';
import { Filesystem } from '@capacitor/filesystem';

import { Device } from '@capacitor/device';
import { Capacitor } from '@capacitor/core';
import { Contacts } from '@capacitor-community/contacts';
import { App } from '@capacitor/app';
import { Templelist } from 'src/app/services/templelist';
import { Ayyappatemplelist } from 'src/app/services/ayyappatemplelist';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class DashboardPage {
   newsList: any[] = [];
     name: string = '';
      email: string = '';
      image: string = 'assets/ic_launcher.png';

       @ViewChild('templeScroll', { read: ElementRef }) templeScroll!: ElementRef;
              @ViewChild('ayyappatempleScroll', { read: ElementRef }) ayyappatempleScroll!: ElementRef;


  ayyappaTemples: any[] = [];
  temples: any[] =[];
  
   
  constructor(private router: Router,private menu: MenuController,private service: News,private templeservice: Templelist,private ayyappatempleservice: Ayyappatemplelist, private authService: Auth, private alertCtrl: AlertController, private platform: Platform,
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
    this.loadNews();
        this.loadAyyappaTemples();
        this.loadTemples();

  }
  loadTemples() {
        this.ayyappatempleservice.getTempleList().subscribe({
      next: (res) => {
        if (res.errorCode === '200' && res.result?.length) {
          this.temples = res.result.slice(0, 10).map((t: any) => ({
            templeName: t.templeName,
            imageUrl: `https://www.ayyappatelugu.com/public/assets/img/temple_images/${t.image}`,
          }));
        }
      },
      error: (err) => console.error('Error fetching temples', err),
    });
  }

  loadAyyappaTemples() {
    //const url = 'https://www.ayyappatelugu.com/APICalls/Temples/getAyyappaTemplesList';
    this.templeservice.getTempleList().subscribe({
      next: (res) => {
        if (res.errorCode === '200' && res.result?.length) {
          this.ayyappaTemples = res.result.slice(0, 10).map((t: any) => ({
            templeName: t.templeName,
            imageUrl: `https://www.ayyappatelugu.com/public/assets/img/temple_images/${t.image}`,
          }));
        }
      },
      error: (err) => console.error('Error fetching temples', err),
    });

  }


  navigate(page: string) {
    switch (page) {
      case 'Ayyapa_karyam': this.router.navigate(['/ayyapa-karyam']); break;
      case 'ayyappa_calender': this.router.navigate(['/calendar']); break;
    }
  }

   loadNews() {
    this.service.getNewsList().subscribe(res => {
          this.newsList = res.result;
         
        }, err => {
          console.error(err);
        });
   }

   refreshList(event: any) {
    this.loadNews();
    event.target.complete();
  }

  async logout() {
    await this.authService.logout();  // ✅ Clear login state
    this.router.navigateByUrl('/login', { replaceUrl: true });  // ✅ Go back to login
  }
  goToAnadanam() {
    this.router.navigateByUrl('/anadanam');
  }

  goToTemples(){
    this.router.navigateByUrl('/temples');
  }
  goToAyyappaTemples(){
    this.router.navigateByUrl('/ayyappatemples');
  }

  goToNityaPooja() {
    this.router.navigate(['/nityapooja']);
  }

  goToGuruSwami() {
  this.router.navigateByUrl('/ayyappa_guruswami');
}

  goToBhajanaMandali() {
    this.router.navigateByUrl('/ayyappa_bajanamandali');
  }

    goToSharanughosha() {
    this.router.navigateByUrl('/sharanughosha');
     
  }
  goToPoojaKaryakramam(){
    this.router.navigateByUrl('/poojakrayakramam');
  }
  gotoaboutUs(){
    this.router.navigateByUrl('/aboutUs');
  }
  goToPrivacyPolicy(){
    this.router.navigateByUrl('/privacypolicy');
  }
  goToCalender(){
    this.router.navigateByUrl('/calender');
  }
  goToBooks(){
    this.router.navigateByUrl('/books');
  }
  goToToures(){
    this.router.navigateByUrl('/toures');
  }
  goToPoojaPetam(){
    this.router.navigateByUrl('/poojapetam');
  }
  goToProducts(){
     this.router.navigateByUrl('/products');
  }

    openNewsDetails(news: any) {
       this.router.navigate(['/viewallnews_details'], {
    queryParams: { 
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

 async checkAndRequestPermissions() {
    if (Capacitor.getPlatform() === 'ios' || Capacitor.getPlatform() === 'android') {

      // 📍 Location permission
      const locStatus = await Geolocation.requestPermissions();
      console.log('Location Permission:', locStatus);

      // 📂 Storage permission (Android only)
      const fsStatus = await Filesystem.requestPermissions();
      console.log('Filesystem Permission:', fsStatus);

      // 👥 Contacts permission
      const contactStatus = await Contacts.requestPermissions();
      console.log('Contacts Permission:', contactStatus);

      // 📱 Device info (no explicit permission required)
      const deviceInfo = await Device.getInfo();
      console.log('Device Info:', deviceInfo);
    }
  }

  viewAllNews() {
   this.router.navigateByUrl('/view-all-news');
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

  viewAllTemples() {
    //this.navCtrl.navigateForward('/view-all-temples');
  }

  openTempleDetails(temple: any) {
    //this.navCtrl.navigateForward('/temple-details', {
   //   queryParams: { data: JSON.stringify(temple) }
   // });
  }

  onImageError(event: any) {
  event.target.src = '../../../assets/ayyapaimage.jpeg'; // fallback static image
}


}
