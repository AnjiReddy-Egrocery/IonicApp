import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { InfoDialogComponent } from 'src/app/info-dialog/info-dialog.component';
import { Yatralu } from 'src/app/services/yatralu';

@Component({
  selector: 'app-tourespage',
  templateUrl: './tourespage.component.html',
  styleUrls: ['./tourespage.component.scss'],
   standalone: true,
    imports: [     
      IonicModule,      // ✅ required for all ion-* components
      FormsModule,      // ✅ required for [(ngModel)]
      CommonModule,
    ]
})
export class TourespageComponent  implements OnInit {
   yatraList: any[] = [];
  filteredList: any[] = [];
  searchQuery: string = '';

  constructor(private yatraService: Yatralu,
    private http: HttpClient,
    private router: Router,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,) { }

  ngOnInit() {this.loadYatras();}

   loadYatras() {
    this.yatraService.getYatraList().subscribe({
      next: (res) => {
        this.yatraList = res.result;
        this.filteredList = [...this.yatraList];
      },
      error: (err) => {
        console.error('API Error', err);
      }
    });
  }

   filterResults(event: any) {
    const query = event.target.value ? event.target.value.toLowerCase() : '';

    this.filteredList = this.yatraList.filter(item => {
      const nameTelugu = item.nameOfPlace.toLowerCase();
      
      const nameEnglish = this.toEnglishTransliteration(item.nameOfPlace).toLowerCase();
     

      return nameTelugu.includes(query) || nameEnglish.includes(query) ;
            
    });
  }

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
      this.loadYatras();
      event.target.complete();
    }
  
  
    openDetails(yatra: any) {
      this.router.navigate(['/yatra-details'], {
        queryParams: {
          name: yatra.nameOfPlace,
          days: yatra.days,
          devotees: yatra.devotees,
          amount: yatra.amount,
          image: yatra.image
        }
      });
    }
  
    async openInfo() {
      const modal = await this.modalCtrl.create({
        component: InfoDialogComponent,
        cssClass: 'custom-modal',
        backdropDismiss: true
      });
      await modal.present();
    }
  
    goToAnadanam() {
      this.router.navigate(['/anadanam']);
    }
  
    goToNityaPooja() {
      this.router.navigate(['/nityapooja']);
    }
  
    async showToast(message: string) {
      const toast = await this.toastCtrl.create({
        message,
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }

}
