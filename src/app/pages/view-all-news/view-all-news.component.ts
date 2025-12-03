import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IonicModule, MenuController, ModalController } from '@ionic/angular';
import { NewsDialogComponent } from 'src/app/components/news-dialog/news-dialog.component';
import { InfoDialogComponent } from 'src/app/info-dialog/info-dialog.component';
import { News } from 'src/app/services/news';

@Component({
  selector: 'app-view-all-news',
  templateUrl: './view-all-news.component.html',
  styleUrls: ['./view-all-news.component.scss'],
     standalone: true,
  imports: [     
    IonicModule,      // ✅ required for all ion-* components
    FormsModule,      // ✅ required for [(ngModel)]
    CommonModule,
  ]
})
export class ViewAllNewsComponent  implements OnInit {
    newsList: any[] = [];
   filteredList: any[] = [];
  searchQuery: string = '';

  constructor(private service: News, private router: Router, private sanitizer: DomSanitizer, private modalCtrl: ModalController, private menu: MenuController) { }

  ngOnInit() {
    this.loadNews();
      }
    
      async loadNews() {
     
           try {
    const res = await this.service.getNewsList(); // <-- Promise-based
    console.log('✅ Response:', res);
    this.newsList = res.result || [];
    this.filteredList = [...this.newsList];
  } catch (err) {
    console.error('❌ Error:', err);
  }
      }
    
      filterResults(event: any) {
        const query = event.target.value ? event.target.value.toLowerCase() : '';
    
        this.filteredList = this.newsList.filter(item => {
          const nameTelugu = item.newsTitle.toLowerCase();
         
          const nameEnglish = this.toEnglishTransliteration(item.guruswamiName).toLowerCase();
          
    
          return nameTelugu.includes(query) ||
                 
                 nameEnglish.includes(query) ;
                
        });
      }
    
      // Full Telugu → English transliteration
      toEnglishTransliteration(text: string): string {
        const consonants: any = {
          'క':'k','ఖ':'kh','గ':'g','ఘ':'gh','ఙ':'ng',
          'చ':'ch','ఛ':'chh','జ':'j','ఝ':'jh','ఞ':'ny',
          'ట':'t','ఠ':'th','డ':'d','ఢ':'dh','ణ':'n',
          'త':'t','థ':'th','ద':'d','ధ':'dh','న':'n',
          'ప':'p','ఫ':'ph','బ':'b','భ':'bh','మ':'m',
          'య':'y','ర':'r','ల':'l','వ':'v','శ':'sh',
          'ష':'sh','స':'s','హ':'h','ళ':'l','ఱ':'r'
        };
    
        const vowels: any = {
          'అ':'a','ఆ':'aa','ఇ':'i','ఈ':'ii','ఉ':'u','ఊ':'uu',
          'ఋ':'ru','ఎ':'e','ఏ':'ee','ఐ':'ai','ఒ':'o','ఓ':'oo','ఔ':'au',
          'ం':'m','ః':'h'
        };
    
        const vowelSigns: any = {
          'ా':'aa','ి':'i','ీ':'ii','ు':'u','ూ':'uu',
          'ె':'e','ే':'ee','ై':'ai','ొ':'o','ో':'oo','ౌ':'au',
          '్':'' // virama removes implicit 'a'
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
    
      refreshList(event: any) {
        this.loadNews();
        event.target.complete();
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
      async openInfo() {
        const modal = await this.modalCtrl.create({
          component: NewsDialogComponent,
          cssClass: 'alert-style-modal',
          backdropDismiss: true,
          showBackdrop: true
        });
        await modal.present();
      }
    
      openDetails(news: any) {
      // 👉 Option 1: Navigate to another page with query params
      this.router.navigate(['/viewallnews_details'], { 
        queryParams: { 
          Name: news.newsTitle,          
          Discription: news.newsDescription,
          Image: news.image
        } 
      });
    }  

}
