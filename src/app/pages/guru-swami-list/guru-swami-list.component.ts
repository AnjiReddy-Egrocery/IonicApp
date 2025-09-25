import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { InfoDialogComponent } from 'src/app/info-dialog/info-dialog.component';
import { GuruSwami } from 'src/app/services/guru-swami';

@Component({
  selector: 'app-guru-swami-list',
  templateUrl: './guru-swami-list.component.html',
  styleUrls: ['./guru-swami-list.component.scss'],
    standalone: true,
  imports: [     
    IonicModule,      // ✅ required for all ion-* components
    FormsModule,      // ✅ required for [(ngModel)]
    CommonModule,
  ]
})
export class GuruSwamiListComponent {

 guruswamiList: any[] = [];
  filteredList: any[] = [];
  searchQuery: string = '';

  constructor(private service: GuruSwami, private router: Router, private sanitizer: DomSanitizer, private modalCtrl: ModalController) {}


  ngOnInit() {
    this.loadGuruswami();
  }

  loadGuruswami() {
    this.service.getGuruSwamiList().subscribe(res => {
      this.guruswamiList = res.result;
      this.filteredList = [...this.guruswamiList];
    }, err => {
      console.error(err);
    });
  }

  filterResults(event: any) {
    const query = event.target.value ? event.target.value.toLowerCase() : '';

    this.filteredList = this.guruswamiList.filter(item => {
      const nameTelugu = item.guruswamiName.toLowerCase();
      const cityTelugu = item.cityName.toLowerCase();
      const nameEnglish = this.toEnglishTransliteration(item.guruswamiName).toLowerCase();
      const cityEnglish = this.toEnglishTransliteration(item.cityName).toLowerCase();

      return nameTelugu.includes(query) ||
             cityTelugu.includes(query) ||
             nameEnglish.includes(query) ||
             cityEnglish.includes(query);
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
    this.loadGuruswami();
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
      component: InfoDialogComponent,
      cssClass: 'custom-modal',
      backdropDismiss: true
    });
    await modal.present();
  }

  openDetails(guru: any) {
  // 👉 Option 1: Navigate to another page with query params
  this.router.navigate(['/guru_swami_details'], { 
    queryParams: { 
      Name: guru.guruswamiName,
      Temple: guru.templeName,
      City: guru.cityName,
      Image: guru.profilePic
    } 
  });
}
}
