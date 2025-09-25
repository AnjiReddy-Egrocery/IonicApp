import { Component, OnInit } from '@angular/core';


import { Router } from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { News } from 'src/app/services/news';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class DashboardPage {
   newsList: any[] = [];
   
  constructor(private router: Router,private menu: MenuController,private service: News) {}

    ngOnInit() {
    this.loadNews();
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

  logout() {
    console.log('Logout clicked');
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

  viewAllNews() {
   this.router.navigateByUrl('/view-all-news');
  }
    


}
