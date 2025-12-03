import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule, MenuController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AyyappaBajanaSongs } from 'src/app/services/ayyappa-bajana-songs';
import { BajanamandaliDialogComponent } from 'src/app/components/bajanamandali-dialog/bajanamandali-dialog.component';

@Component({
  selector: 'app-ayyappa-bajana-songs',
  templateUrl: './ayyappa-bajana-songs.page.html',
  styleUrls: ['./ayyappa-bajana-songs.page.scss'],
  standalone: true,
   imports: [     
     IonicModule,      // ✅ required for all ion-* components
     FormsModule,      // ✅ required for [(ngModel)]
     CommonModule,
   ]
})
export class AyyappaBajanaSongsPage implements OnInit {

 bajanamandaliList: any[] = [];
  filteredList: any[] = [];
  searchQuery: string = '';

  constructor(private service: AyyappaBajanaSongs, private router: Router, private sanitizer: DomSanitizer, private modalCtrl: ModalController, private menu: MenuController) {}


   ngOnInit() {
    this.loadBajanamandaliList();
  }

  async loadBajanamandaliList() {
  try {
    const res = await this.service.getBajanaSongs(); // <-- Promise-based
    console.log('✅ Response:', res);
    this.bajanamandaliList = res.result || [];
    this.filteredList = [...this.bajanamandaliList];
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

  filterResults(event: any) {
    const query = (event.target.value || '').toLowerCase();

    this.filteredList = this.bajanamandaliList.filter(item => {
      const nameTelugu = (item.songTitle || '').toLowerCase();
     
      const nameEnglish = this.toEnglishTransliteration(item.songTitle || '').toLowerCase();
      

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

  refreshList(event: any) {
    this.loadBajanamandaliList();
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
      component: BajanamandaliDialogComponent,
      cssClass: 'alert-style-modal',
      backdropDismiss: true,
      showBackdrop: true
    });
    await modal.present();
  }

  openDetails(bajana: any) {
    this.router.navigate(['/bajanaSongs_details'], {
      queryParams: {
        songTitle: bajana.songTitle,
        singerName: bajana.singerName,
        writerName: bajana.writerName,
       
        songDescription: bajana.songDescription
       
      }
    });
  }

  closeMenu() {
    this.menu.close('first');
  }
}

